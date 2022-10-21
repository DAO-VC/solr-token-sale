use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};

use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};

pub struct TokenSale {
    pub is_initialized: bool,
    pub init_pubkey: Pubkey,
    pub sale_token_account_pubkey: Pubkey,
    pub pool_token_account_pubkey: Pubkey,
    pub whitelist_map_pubkey: Pubkey,
    pub whitelist_program_pubkey: Pubkey,
    pub token_sale_amount: u64,
    pub usd_min_amount: u64,
    pub usd_max_amount: u64,
    pub token_sale_price: u64,
    pub token_sale_time: u64,
    pub initial_fraction: u16,
    pub token_sale_paused: bool,
    pub token_sale_ended: bool,
}

impl Sealed for TokenSale {}

impl IsInitialized for TokenSale {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for TokenSale {
    const LEN: usize = 205;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, TokenSale::LEN];
        let (
            is_initialized,
            init_pubkey,
            sale_token_account_pubkey,
            pool_token_account_pubkey,
            whitelist_map_pubkey,
            whitelist_program_pubkey,
            token_sale_amount,
            usd_min_amount,
            usd_max_amount,
            token_sale_price,
            token_sale_time,
            initial_fraction,
            token_sale_paused,
            token_sale_ended,
        ) = array_refs![src, 1, 32, 32, 32, 32, 32, 8, 8, 8, 8, 8, 2, 1, 1];

        Ok(TokenSale {
            is_initialized: match is_initialized {
                [0] => false,
                [1] => true,
                _ => return Err(ProgramError::InvalidAccountData),
            },
            init_pubkey: Pubkey::new_from_array(*init_pubkey),
            sale_token_account_pubkey: Pubkey::new_from_array(*sale_token_account_pubkey),
            pool_token_account_pubkey: Pubkey::new_from_array(*pool_token_account_pubkey),
            whitelist_map_pubkey: Pubkey::new_from_array(*whitelist_map_pubkey),
            whitelist_program_pubkey: Pubkey::new_from_array(*whitelist_program_pubkey),
            token_sale_amount: u64::from_le_bytes(*token_sale_amount),
            usd_min_amount: u64::from_le_bytes(*usd_min_amount),
            usd_max_amount: u64::from_le_bytes(*usd_max_amount),
            token_sale_price: u64::from_le_bytes(*token_sale_price),
            token_sale_time: u64::from_le_bytes(*token_sale_time),
            initial_fraction: match u16::from_le_bytes(*initial_fraction) {
                base_points if base_points <= 10000 => base_points,
                _ => return Err(ProgramError::InvalidAccountData),
            },
            token_sale_paused: match token_sale_paused {
                [0] => false,
                [1] => true,
                _ => return Err(ProgramError::InvalidAccountData),
            },
            token_sale_ended: match token_sale_ended {
                [0] => false,
                [1] => true,
                _ => return Err(ProgramError::InvalidAccountData),
            },
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, TokenSale::LEN];
        let (
            is_initialized_dst,
            init_pubkey_dst,
            sale_token_account_pubkey_dst,
            pool_token_account_pubkey_dst,
            whitelist_map_pubkey_dst,
            whitelist_program_pubkey_dst,
            token_sale_amount_dst,
            usd_min_amount_dst,
            usd_max_amount_dst,
            token_sale_price_dst,
            token_sale_time_dst,
            initial_fraction_dst,
            token_sale_paused_dst,
            token_sale_ended_dst,
        ) = mut_array_refs![dst, 1, 32, 32, 32, 32, 32, 8, 8, 8, 8, 8, 2, 1, 1];

        let TokenSale {
            is_initialized,
            init_pubkey,
            sale_token_account_pubkey,
            pool_token_account_pubkey,
            whitelist_map_pubkey,
            whitelist_program_pubkey,
            token_sale_amount,
            usd_min_amount,
            usd_max_amount,
            token_sale_price,
            token_sale_time,
            initial_fraction,
            token_sale_paused,
            token_sale_ended,
        } = self;

        is_initialized_dst[0] = *is_initialized as u8;
        init_pubkey_dst.copy_from_slice(init_pubkey.as_ref());
        sale_token_account_pubkey_dst.copy_from_slice(sale_token_account_pubkey.as_ref());
        pool_token_account_pubkey_dst.copy_from_slice(pool_token_account_pubkey.as_ref());
        whitelist_map_pubkey_dst.copy_from_slice(whitelist_map_pubkey.as_ref());
        whitelist_program_pubkey_dst.copy_from_slice(whitelist_program_pubkey.as_ref());
        *token_sale_amount_dst = token_sale_amount.to_le_bytes();
        *usd_min_amount_dst = usd_min_amount.to_le_bytes();
        *usd_max_amount_dst = usd_max_amount.to_le_bytes();
        *token_sale_price_dst = token_sale_price.to_le_bytes();
        *token_sale_time_dst = token_sale_time.to_le_bytes();
        *initial_fraction_dst = (*initial_fraction).to_le_bytes();
        token_sale_paused_dst[0] = *token_sale_paused as u8;
        token_sale_ended_dst[0] = *token_sale_ended as u8;
    }
}

pub fn unpack_schedule(input: &[u8]) -> Result<Vec<u64>, ProgramError> {
    let len = input.len() / 8;
    let mut output: Vec<u64> = Vec::with_capacity(len);

    for idx in 0..len {
        let release_time = input
            .get(idx * 8..idx * 8 + 8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(ProgramError::InvalidAccountData)?;
        output.push(release_time);
    }

    Ok(output)
}

pub fn pack_schedule_into_slice(schedule: Vec<u64>, target: &mut [u8]) -> Result<(), ProgramError> {
    for (idx, release_time) in schedule.iter().enumerate() {
        target
            .get_mut(idx * 8..idx * 8 + 8)
            .map(|slice| {
                slice.copy_from_slice(&release_time.to_le_bytes());
            })
            .ok_or(ProgramError::InvalidInstructionData)?;
    }
    Ok(())
}
