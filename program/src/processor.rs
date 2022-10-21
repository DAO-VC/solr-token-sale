use crate::state::{pack_schedule_into_slice, unpack_schedule};
use crate::{error::TokenSaleError, instruction::TokenSaleInstruction, state::TokenSale};
use num_traits::FromPrimitive;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    decode_error::DecodeError,
    entrypoint::ProgramResult,
    instruction::{AccountMeta, Instruction},
    msg,
    program::{invoke, invoke_signed},
    program_error::{PrintProgramError, ProgramError},
    program_pack::{IsInitialized, Pack},
    pubkey,
    pubkey::Pubkey,
    sysvar::{clock::Clock, rent::Rent, Sysvar},
};
use solr_token_whitelist::state::TokenWhitelist;
use spl_token::state::Account as TokenAccount;
use token_vesting::instruction::Schedule;

pub struct Processor;
impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = TokenSaleInstruction::unpack(instruction_data)?;

        match instruction {
            TokenSaleInstruction::InitTokenSale {
                token_sale_amount,
                usd_min_amount,
                usd_max_amount,
                token_sale_price,
                token_sale_time,
                initial_fraction,
                release_schedule,
            } => {
                msg!("Instruction: InitTokenSale");
                Self::process_init_sale(
                    accounts,
                    token_sale_amount,
                    usd_min_amount,
                    usd_max_amount,
                    token_sale_price,
                    token_sale_time,
                    initial_fraction,
                    release_schedule,
                    program_id
                )
            }
            TokenSaleInstruction::FundTokenSale { token_sale_amount } => {
                msg!("Instruction: FundTokenSale");
                Self::process_fund_sale(
                    accounts,
                    token_sale_amount,
                    program_id
                )
            }
            TokenSaleInstruction::ExecuteTokenSale { usd_amount } => {
                msg!("Instruction: ExecuteTokenSale");
                Self::process_execute_sale(
                    accounts,
                    usd_amount,
                    program_id
                )
            }
            TokenSaleInstruction::PauseTokenSale {} => {
                msg!("Instruction: PauseTokenSale");
                Self::process_pause_sale(
                    accounts,
                    program_id
                )
            }
            TokenSaleInstruction::ResumeTokenSale {} => {
                msg!("Instruction: ResumeTokenSale");
                Self::process_resume_sale(
                    accounts,
                    program_id
                )
            }
            TokenSaleInstruction::EndTokenSale {} => {
                msg!("Instruction: EndTokenSale");
                Self::process_end_sale(
                    accounts,
                    program_id
                )
            }
        }
    }

    /// Processes [InitTokenSale](enum.TokenSaleInstruction.html) instruction
    fn process_init_sale(
        accounts: &[AccountInfo],
        token_sale_amount: u64,
        usd_min_amount: u64,
        usd_max_amount: u64,
        token_sale_price: u64,
        token_sale_time: u64,
        initial_fraction: u16,
        release_schedule: Vec<u64>,
        program_id: &Pubkey,
    ) -> ProgramResult {
        if initial_fraction > 10000 {
            msg!("invalid initial fraction, it should be less than 10000");
            return Err(ProgramError::InvalidAccountData);
        }

        let account_info_iter = &mut accounts.iter();

        let pool_account = next_account_info(account_info_iter)?;
        if !pool_account.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let token_sale_account = next_account_info(account_info_iter)?;
        let state_size = TokenSale::LEN + release_schedule.len() * 8;
        if token_sale_account.data_len() != state_size {
            msg!("Invalid token sale account size for given release schedule");
            return Err(ProgramError::InvalidAccountData);
        }

        let pool_usdt_account = next_account_info(account_info_iter)?;
        let token_sale_solr_account = next_account_info(account_info_iter)?;
        let token_whitelist_map = next_account_info(account_info_iter)?;

        let token_program = next_account_info(account_info_iter)?;
        if !spl_token::check_id(token_program.key) {
            msg!("invalid token program");
            msg!(&token_program.key.to_string());
            return Err(ProgramError::InvalidAccountData);
        }

        let token_whitelist_program = next_account_info(account_info_iter)?;
        if token_whitelist_map.owner != token_whitelist_program.key {
            msg!("token whitelist map is not owned by token whitelist program");
            return Err(ProgramError::InvalidAccountData);
        }

        let sysvar_rent_pubkey = &Rent::from_account_info(next_account_info(account_info_iter)?)?;
        if !sysvar_rent_pubkey.is_exempt(token_sale_account.lamports(), state_size) {
            msg!("SOLR_ERROR_1: token sale account must be rent exempt");
            return Err(TokenSaleError::NotRentExempt.into());
        }

        let mut token_sale_state =
            TokenSale::unpack_unchecked(&token_sale_account.data.borrow()[..TokenSale::LEN])?;
        if token_sale_state.is_initialized() {
            msg!("token sale already initialized");
            return Err(ProgramError::AccountAlreadyInitialized);
        }

        // Transfer token sale solr account ownership to the token sale program derived address
        let (token_sale_program_address, _nonce) = Pubkey::find_program_address(&[b"solrsale"], program_id);
        msg!("Transfer token sale solr account ownership to the token sale program derived address");
        let transfer_ownership_ix = spl_token::instruction::set_authority(
            token_program.key,
            token_sale_solr_account.key,
            Some(&token_sale_program_address),
            spl_token::instruction::AuthorityType::AccountOwner,
            pool_account.key,
            &[&pool_account.key],
        )?;
        invoke(
            &transfer_ownership_ix,
            &[
                token_sale_solr_account.clone(),
                pool_account.clone(),
                token_program.clone(),
            ],
        )?;

        token_sale_state.is_initialized = true;
        token_sale_state.init_pubkey = *pool_account.key;
        token_sale_state.sale_token_account_pubkey = *token_sale_solr_account.key;
        token_sale_state.pool_token_account_pubkey = *pool_usdt_account.key;
        token_sale_state.whitelist_map_pubkey = *token_whitelist_map.key;
        token_sale_state.whitelist_program_pubkey = *token_whitelist_program.key;
        token_sale_state.token_sale_amount = token_sale_amount;
        token_sale_state.usd_min_amount = usd_min_amount;
        token_sale_state.usd_max_amount = usd_max_amount;
        token_sale_state.token_sale_price = token_sale_price;
        token_sale_state.token_sale_time = token_sale_time;
        token_sale_state.initial_fraction = initial_fraction;
        token_sale_state.token_sale_paused = false;
        token_sale_state.token_sale_ended = false;

        TokenSale::pack(
            token_sale_state,
            &mut token_sale_account.data.borrow_mut()[..TokenSale::LEN],
        )?;
        pack_schedule_into_slice(
            release_schedule,
            &mut token_sale_account.data.borrow_mut()[TokenSale::LEN..],
        )?;

        Ok(())
    }

    /// This instruction is redundant. Use spl token transfer to fund the sale
    /// Processes [FundTokenSale](enum.TokenSaleInstruction.html) instruction
    fn process_fund_sale(
        accounts: &[AccountInfo],
        token_sale_amount: u64,
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();

        let pool_account = next_account_info(account_info_iter)?;
        if !pool_account.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let token_sale_account = next_account_info(account_info_iter)?;

        let pool_solr_account = next_account_info(account_info_iter)?;
        let token_sale_solr_account = next_account_info(account_info_iter)?;

        let token_program = next_account_info(account_info_iter)?;
        if !spl_token::check_id(token_program.key) {
            msg!("invalid token program");
            msg!(&token_program.key.to_string());
            return Err(ProgramError::InvalidAccountData);
        }

        // check if token sale can be funded
        let token_sale_state =
            TokenSale::unpack(&token_sale_account.data.borrow()[..TokenSale::LEN])?;
        let token_sale_solr_account_info =
            TokenAccount::unpack(&token_sale_solr_account.data.borrow())?;
        if !token_sale_state.is_initialized() {
            msg!("SOLR_ERROR_3: token sale needs to be initialized before funding");
            return Err(TokenSaleError::TokenSaleNotInit.into());
        }
        if token_sale_amount != token_sale_state.token_sale_amount {
            msg!("SOLR_ERROR_6: funding amount has to match token sale amount");
            msg!(&token_sale_amount.to_string());
            msg!(&token_sale_state.token_sale_amount.to_string());
            return Err(TokenSaleError::TokenSaleAmountExceeds.into());
        }
        if token_sale_solr_account_info.amount == token_sale_state.token_sale_amount {
            msg!("SOLR_ERROR_5: token sale already funded");
            msg!(&token_sale_solr_account_info.amount.to_string());
            msg!(&token_sale_state.token_sale_amount.to_string());
            return Err(TokenSaleError::TokenSaleFunded.into());
        }

        // Fund the token sale account with SOLR
        msg!("Fund the token sale account with SOLR");
        let transfer_solr_to_sale_ix = spl_token::instruction::transfer(
            token_program.key,
            pool_solr_account.key,
            token_sale_solr_account.key,
            pool_account.key,
            &[&pool_account.key],
            token_sale_amount,
        )?;
        invoke(
            &transfer_solr_to_sale_ix,
            &[
                pool_solr_account.clone(),
                token_sale_solr_account.clone(),
                pool_account.clone(),
                token_program.clone(),
            ],
        )?;

        Ok(())
    }

    /// Processes [ExecuteTokenSale](enum.TokenSaleInstruction.html) instruction
    fn process_execute_sale(
        accounts: &[AccountInfo],
        usd_amount: u64,
        program_id: &Pubkey,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();

        let user_account = next_account_info(account_info_iter)?;
        if !user_account.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let token_sale_account = next_account_info(account_info_iter)?;

        let token_sale_solr_account = next_account_info(account_info_iter)?;
        let user_solr_account = next_account_info(account_info_iter)?;

        let user_usdt_account = next_account_info(account_info_iter)?;
        let pool_usdt_account = next_account_info(account_info_iter)?;

        let sale_pda = next_account_info(account_info_iter)?;
        let token_program = next_account_info(account_info_iter)?;

        let token_whitelist_map = next_account_info(account_info_iter)?;
        let token_whitelist_account = next_account_info(account_info_iter)?;
        let token_whitelist_program = next_account_info(account_info_iter)?;

        // Vesting accounts
        let system_program = next_account_info(account_info_iter)?;
        let rent = next_account_info(account_info_iter)?;
        let vesting_account = next_account_info(account_info_iter)?;
        let vesting_token_account = next_account_info(account_info_iter)?;
        let vesting_program = next_account_info(account_info_iter)?;

        let token_sale_state =
            TokenSale::unpack(&token_sale_account.data.borrow()[..TokenSale::LEN])?;
        let schedule = unpack_schedule(&token_sale_account.data.borrow()[TokenSale::LEN..])?;

        let token_sale_solr_account_info =
            TokenAccount::unpack(&token_sale_solr_account.data.borrow())?;
        let mut token_whitelist_map_state =
            TokenWhitelist::unpack_from_slice(&token_whitelist_map.data.borrow())?;
        let mut token_whitelist_account_state =
            TokenWhitelist::unpack_from_slice(&token_whitelist_account.data.borrow())?;

        if !spl_token::check_id(token_program.key) {
            msg!("invalid token program");
            msg!(&token_program.key.to_string());
            return Err(ProgramError::InvalidAccountData);
        }

        // check vesting program pubkey, other vesting accounts will be checked by the vesting program
        if vesting_program.key != &pubkey!("CChTq6PthWU82YZkbveA3WDf7s97BWhBK4Vx9bmsT743") {
            msg!("invalid vesting program");
            msg!(&vesting_program.key.to_string());
            return Err(ProgramError::InvalidAccountData);
        }

        let (vesting_seed, vesting_account_key) = Self::find_vesting_seed(
            program_id,
            user_account.key,
            token_sale_account.key,
            vesting_program.key,
        );

        if vesting_account.key != &vesting_account_key {
            msg!("invalid vesting account");
            msg!(
                "vesting seed {}",
                Pubkey::new_from_array(vesting_seed).to_string()
            );
            return Err(ProgramError::InvalidAccountData);
        }

        if token_sale_state.whitelist_map_pubkey != *token_whitelist_map.key {
            msg!("invalid token whitelist account map");
            msg!(&token_sale_state.whitelist_map_pubkey.to_string());
            msg!(&token_whitelist_map.key.to_string());
            return Err(ProgramError::InvalidAccountData);
        }
        if token_sale_state.whitelist_program_pubkey != *token_whitelist_program.key {
            msg!("invalid token whitelist program");
            msg!(&token_sale_state.whitelist_program_pubkey.to_string());
            msg!(&token_whitelist_program.key.to_string());
            return Err(ProgramError::InvalidAccountData);
        }
        if !token_whitelist_map_state.contains_key(&token_whitelist_account.key.to_string()) {
            msg!("invalid token whitelist account");
            msg!("{}", token_whitelist_account.key);
            return Err(ProgramError::InvalidAccountData);
        }
        if !token_whitelist_account_state.contains_key(&user_account.key.to_string()) {
            msg!("SOLR_ERROR_2: user is not whitelisted");
            msg!("{}", user_account.key);
            return Err(TokenSaleError::UserNotWhitelisted.into());
        }
        let mut allocation_amount: u64 = 0;
        if let Some(value) = token_whitelist_account_state.get(&user_account.key.to_string()) {
            allocation_amount = *value;
        }
        if usd_amount > allocation_amount {
            msg!("SOLR_ERROR_11: amount exceeds your allocation");
            msg!("{}", usd_amount);
            msg!("{}", allocation_amount);
            return Err(TokenSaleError::ExceedsAllocation.into());
        }
        let clock = Clock::get()?;
        if (clock.unix_timestamp as u64) < token_sale_state.token_sale_time {
            msg!("SOLR_ERROR_4: token sale has not started");
            msg!("{}", clock.unix_timestamp);
            msg!("{}", token_sale_state.token_sale_time);
            return Err(TokenSaleError::TokenSaleNotStarted.into());
        }
        if token_sale_state.token_sale_paused {
            msg!("SOLR_ERROR_12: token sale has been paused");
            return Err(TokenSaleError::TokenSalePaused.into());
        }
        if token_sale_state.token_sale_ended {
            msg!("SOLR_ERROR_13: token sale has ended");
            return Err(TokenSaleError::TokenSaleEnded.into());
        }
        if token_sale_state.sale_token_account_pubkey != *token_sale_solr_account.key {
            msg!("token sale account does not match");
            msg!(&token_sale_state.sale_token_account_pubkey.to_string());
            msg!(&token_sale_solr_account.key.to_string());
            return Err(ProgramError::InvalidAccountData);
        }
        if token_sale_state.pool_token_account_pubkey != *pool_usdt_account.key {
            msg!("pool usdt account does not match");
            msg!(&token_sale_state.pool_token_account_pubkey.to_string());
            msg!(&pool_usdt_account.key.to_string());
            return Err(ProgramError::InvalidAccountData);
        }
        if token_sale_solr_account_info.amount == 0 {
            msg!("SOLR_ERROR_7: token sale complete");
            msg!(&token_sale_solr_account_info.amount.to_string());
            return Err(TokenSaleError::TokenSaleComplete.into());
        }
        if usd_amount < token_sale_state.usd_min_amount {
            msg!("SOLR_ERROR_8: amount less than minimum allocation");
            msg!(&usd_amount.to_string());
            msg!(&token_sale_state.usd_min_amount.to_string());
            return Err(TokenSaleError::AmountMinimum.into());
        }
        if usd_amount > token_sale_state.usd_max_amount {
            msg!("SOLR_ERROR_9: amount more than maximum allocation");
            msg!(&usd_amount.to_string());
            msg!(&token_sale_state.usd_max_amount.to_string());
            return Err(TokenSaleError::AmountMaximum.into());
        }
        let token_purchase_amount = usd_amount * token_sale_state.token_sale_price;
        if token_purchase_amount > token_sale_solr_account_info.amount {
            msg!("SOLR_ERROR_10: amount exceeds tokens available for sale");
            msg!(&token_purchase_amount.to_string());
            msg!(&token_sale_solr_account_info.amount.to_string());
            return Err(TokenSaleError::AmountExceeds.into());
        }

        // Transfer USDT to the pool account
        msg!("Transfer USDT to the pool account");
        let transfer_usdt_to_pool_ix = spl_token::instruction::transfer(
            token_program.key,
            user_usdt_account.key,
            pool_usdt_account.key,
            user_account.key,
            &[&user_account.key],
            usd_amount,
        )?;
        invoke(
            &transfer_usdt_to_pool_ix,
            &[
                user_usdt_account.clone(),
                pool_usdt_account.clone(),
                user_account.clone(),
                token_program.clone(),
            ],
        )?;

        let number_of_vesting_schedules = schedule.len() as u64;
        let advance_amount = (token_purchase_amount as u128
            * token_sale_state.initial_fraction as u128
            / 10000) as u64;
        let remaining_portion_amount =
            (token_purchase_amount - advance_amount) / number_of_vesting_schedules;
        let advance_amount =
            token_purchase_amount - remaining_portion_amount * number_of_vesting_schedules;
        msg!(
            "Advance: {}, remaining {} x {}",
            advance_amount,
            number_of_vesting_schedules,
            remaining_portion_amount
        );

        let vesting_schedule: Vec<Schedule> = schedule
            .iter()
            .map(|&release_time| Schedule {
                release_time,
                amount: remaining_portion_amount,
            })
            .collect();

        msg!("Transfer advance payment");
        let (token_sale_program_address, bump) =
            Pubkey::find_program_address(&[b"solrsale"], program_id);
        let advance_payment_ix = spl_token::instruction::transfer(
            token_program.key,
            token_sale_solr_account.key,
            user_solr_account.key,
            &token_sale_program_address,
            &[&token_sale_program_address],
            advance_amount,
        )?;
        invoke_signed(
            &advance_payment_ix,
            &[
                token_sale_solr_account.clone(),
                user_solr_account.clone(),
                sale_pda.clone(),
                token_program.clone(),
            ],
            &[&[&b"solrsale"[..], &[bump]]],
        )?;

        msg!("Initialize vesting account");
        let vesting_init_ix = token_vesting::instruction::init(
            system_program.key,
            rent.key,
            vesting_program.key,
            user_account.key,
            vesting_account.key,
            vesting_seed,
            number_of_vesting_schedules as u32,
        )?;
        invoke(
            &vesting_init_ix,
            &[
                system_program.clone(),
                rent.clone(),
                vesting_program.clone(),
                user_account.clone(),
                vesting_account.clone(),
            ],
        )?;

        msg!("Create vesting schedule and transfer tokens to vesting");
        let vesting_create_ix = token_vesting::instruction::create(
            vesting_program.key,
            token_program.key,
            vesting_account.key,
            vesting_token_account.key,
            &token_sale_program_address,
            token_sale_solr_account.key,
            user_solr_account.key,
            &token_sale_solr_account_info.mint,
            vesting_schedule,
            vesting_seed,
        )?;
        invoke_signed(
            &vesting_create_ix,
            &[
                token_program.clone(),
                vesting_account.clone(),
                vesting_token_account.clone(),
                sale_pda.clone(),
                token_sale_solr_account.clone(),
            ],
            &[&[&b"solrsale"[..], &[bump]]],
        )?;

        // Update token whitelist data after successful purchase
        // Purchase is allowed only once and allocation will be reset to zero
        let accounts_to_send = vec![
            AccountMeta::new_readonly(*user_account.key, true),
            AccountMeta::new(*token_whitelist_account.key, false),
            AccountMeta::new_readonly(*user_account.key, false),
        ];
        let data: Vec<u8> = vec![3]; // instruction to reset allocation to zero
        let update_token_whitelist_ix = Instruction {
            program_id: *token_whitelist_program.key,
            accounts: accounts_to_send,
            data,
        };
        invoke(
            &update_token_whitelist_ix,
            &[
                user_account.clone(),
                token_whitelist_account.clone(),
                token_whitelist_program.clone(),
            ],
        )?;

        Ok(())
    }

    fn find_vesting_seed(
        token_sale_program_id: &Pubkey,
        user: &Pubkey,
        token_sale: &Pubkey,
        vesting_program_id: &Pubkey,
    ) -> ([u8; 32], Pubkey) {
        let (vesting_seed, _) = Pubkey::find_program_address(
            &[token_sale.as_ref(), user.as_ref()],
            token_sale_program_id,
        );
        let mut vesting_seed = vesting_seed.to_bytes();
        let (vesting_account_key, nonce) =
            Pubkey::find_program_address(&[&vesting_seed[..31]], vesting_program_id);
        vesting_seed[31] = nonce;
        (vesting_seed, vesting_account_key)
    }
    /// Processes [PauseTokenSale](enum.TokenSaleInstruction.html) instruction
    fn process_pause_sale(
        accounts: &[AccountInfo],
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();

        let init_account = next_account_info(account_info_iter)?;
        if !init_account.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let token_sale_account = next_account_info(account_info_iter)?;

        // check if token sale can be paused
        let mut token_sale_state = TokenSale::unpack(&token_sale_account.data.borrow()[..TokenSale::LEN])?;
        if token_sale_state.init_pubkey != *init_account.key {
            msg!("invalid signer");
            msg!(&token_sale_state.init_pubkey.to_string());
            msg!(&init_account.key.to_string());
            return Err(ProgramError::InvalidAccountData);
        }
        if !token_sale_state.is_initialized() {
            msg!("SOLR_ERROR_3: token sale needs to be initialized before pausing");
            return Err(TokenSaleError::TokenSaleNotInit.into());
        }
        
        // pause the sale
        token_sale_state.token_sale_paused = true;
        
        TokenSale::pack(token_sale_state, &mut token_sale_account.data.borrow_mut()[..TokenSale::LEN])?;

        Ok(())
    }

    /// Processes [ResumeTokenSale](enum.TokenSaleInstruction.html) instruction
    fn process_resume_sale(
        accounts: &[AccountInfo],
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();

        let init_account = next_account_info(account_info_iter)?;
        if !init_account.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let token_sale_account = next_account_info(account_info_iter)?;

        // check if token sale can be resumed
        let mut token_sale_state = TokenSale::unpack(&token_sale_account.data.borrow()[..TokenSale::LEN])?;
        if token_sale_state.init_pubkey != *init_account.key {
            msg!("invalid signer");
            msg!(&token_sale_state.init_pubkey.to_string());
            msg!(&init_account.key.to_string());
            return Err(ProgramError::InvalidAccountData);
        }
        if !token_sale_state.is_initialized() {
            msg!("SOLR_ERROR_3: token sale is not initialized");
            return Err(TokenSaleError::TokenSaleNotInit.into());
        }
        
        // resume the sale
        token_sale_state.token_sale_paused = false;
        
        TokenSale::pack(token_sale_state, &mut token_sale_account.data.borrow_mut()[..TokenSale::LEN])?;

        Ok(())
    }

    /// Processes [EndTokenSale](enum.TokenSaleInstruction.html) instruction
    fn process_end_sale(
        accounts: &[AccountInfo],
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();

        let init_account = next_account_info(account_info_iter)?;
        if !init_account.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let token_sale_account = next_account_info(account_info_iter)?;

        // check if token sale can be ended
        let mut token_sale_state = TokenSale::unpack(&token_sale_account.data.borrow()[..TokenSale::LEN])?;
        if token_sale_state.init_pubkey != *init_account.key {
            msg!("invalid signer");
            msg!(&token_sale_state.init_pubkey.to_string());
            msg!(&init_account.key.to_string());
            return Err(ProgramError::InvalidAccountData);
        }
        if !token_sale_state.is_initialized() {
            msg!("SOLR_ERROR_3: token sale is not initialized");
            return Err(TokenSaleError::TokenSaleNotInit.into());
        }
        
        // end the sale (can't be resumed once ended)
        token_sale_state.token_sale_ended = true;
        
        TokenSale::pack(token_sale_state, &mut token_sale_account.data.borrow_mut()[..TokenSale::LEN])?;

        Ok(())
    }
}

impl PrintProgramError for TokenSaleError {
    fn print<E>(&self)
    where
        E: 'static + std::error::Error + DecodeError<E> + PrintProgramError + FromPrimitive,
    {
        match self {
            TokenSaleError::InvalidInstruction => msg!("Error: Invalid Instruction"),
            TokenSaleError::NotRentExempt => msg!("Error: Not Rent Exempt"),
            TokenSaleError::UserNotWhitelisted => msg!("Error: User Not Whitelisted"),
            TokenSaleError::TokenSaleNotInit => msg!("Error: Token Sale Not Initialized"),
            TokenSaleError::TokenSaleNotStarted => msg!("Error: Token Sale Not Started"),
            TokenSaleError::TokenSaleFunded => msg!("Error: Token Sale Funded"),
            TokenSaleError::TokenSaleAmountExceeds => msg!("Error: Token Sale Amount Exceeds"),
            TokenSaleError::TokenSaleComplete => msg!("Error: Token Sale Complete"),
            TokenSaleError::AmountMinimum => msg!("Error: Amount Less Than Minimum"),
            TokenSaleError::AmountMaximum => msg!("Error: Amount More Than Maximum"),
            TokenSaleError::AmountExceeds => msg!("Error: Amount Exceeds Tokens Available For Sale"),
            TokenSaleError::ExceedsAllocation => msg!("Error: Amount Exceeds Your Allocation"),
            TokenSaleError::TokenSalePaused => msg!("Error: Token Sale Paused"),
            TokenSaleError::TokenSaleEnded => msg!("Error: Token Sale Ended"),
        }
    }
}
