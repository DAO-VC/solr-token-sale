use solana_program::program_error::ProgramError;
use std::convert::TryInto;
use std::mem::size_of;

use crate::error::TokenSaleError::InvalidInstruction;

#[derive(Clone, Debug, PartialEq)]
pub enum TokenSaleInstruction {

    /// Instruction to initialise token sale with info and transfer
    /// token sale account ownership to program derived address
    ///
    /// Accounts expected by InitTokenSale
    ///
    /// 0. `[signer]` The account initialising the sale
    /// 1. `[writable]` Account holding token sale init info
    /// 2. `[writable]` Pool token account for receiving funds from sale
    /// 3. `[writable]` Sale token account for holding the tokens for sale
    /// 4. `[]` Account holding token whitelist info
    /// 5. `[]` The token program
    /// 6. `[]` The token whitelist program
    /// 7. `[]` SYSVAR_RENT_PUBKEY
    InitTokenSale {
        token_sale_amount: u64, // amount of tokens for sale, to be deposited into sale
        usd_min_amount: u64,    // minimum purchase amount in usd
        usd_max_amount: u64,    // maximum purchase amount in usd
        token_sale_price: u64,  // token sale price (multiplied by 100 for easy arithmetic)
        token_sale_time: u64,   // time when token sale goes live
        initial_fraction: u16, // initial fraction of tokens to be released in base points (10000 = 100%)
        release_schedule: Vec<u64>, // release schedule, rest of tokens to be released equally over time
    },

    /// Instruction to fund token sale account with tokens
    ///
    /// Accounts expected by FundTokenSale
    ///
    /// 0. `[signer]` The account funding the sale
    /// 1. `[]` Account holding token sale init info
    /// 2. `[writable]` Pool token account containing tokens for sale
    /// 3. `[writable]` Sale token account for holding the tokens for sale
    /// 4. `[]` The token program
    FundTokenSale {
        token_sale_amount: u64, // amount of tokens deposited into token sale account
    },

    /// Instruction to execute token sale. User purchases tokens from token sale
    /// account and transfer USDT to the pool account. It is done via atomic swap.
    ///
    /// Accounts expected by ExecuteTokenSale
    ///
    /// 0. `[signer]` The account buying from the sale
    /// 1. `[]` Account holding sale init info
    /// 2. `[writable]` Sale token account containing tokens for sale
    /// 3. `[writable]` User token account for receiving tokens purchased <----
    /// 4. `[writable]` User token account for sending funds
    /// 5. `[writable]` Pool token account for receiving user funds
    /// 6. `[]` The Sale program derived address
    /// 7. `[]` The token program
    /// 8. `[]` Account holding token whitelist map
    /// 9. `[writable]` Account holding token whitelist info
    /// 10. `[]` The token whitelist program
    ///
    /// Vesting::Init
    /// 0. `[]` The system program account
    /// 1. `[]` The sysvar Rent account
    /// 1. `[signer]` The fee payer account
    /// 1. `[]` The vesting account
    ///
    /// Vesting::Create
    /// 0. `[]` The spl-token program account
    /// 1. `[writable]` The vesting account
    /// 2. `[writable]` The vesting spl-token account
    /// 3. `[signer]` The source spl-token account owner
    /// 4. `[writable]` The source spl-token account
    ExecuteTokenSale {
        usd_amount: u64, // purchase amount in usd
    },

    /// Instruction to pause token sale
    ///
    /// Accounts expected by PauseTokenSale
    ///
    /// 0. `[signer]` The account which owns token sale init
    /// 1. `[writable]` Account holding token sale init info
    PauseTokenSale {
    },

    /// Instruction to resume token sale
    ///
    /// Accounts expected by ResumeTokenSale
    ///
    /// 0. `[signer]` The account which owns token sale init
    /// 1. `[writable]` Account holding token sale init info
    ResumeTokenSale {
    },

    /// Instruction to end token sale
    ///
    /// Accounts expected by EndTokenSale
    ///
    /// 0. `[signer]` The account which owns token sale init
    /// 1. `[writable]` Account holding token sale init info
    EndTokenSale {
    },
}

impl TokenSaleInstruction {
    /// Unpacks a byte buffer into a [TokenSaleInstruction](enum.TokenSaleInstruction.html).
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

        Ok(match tag {
            0 => {
                let (token_sale_amount, rest) = rest.split_at(8);
                let token_sale_amount = token_sale_amount
                    .try_into()
                    .ok()
                    .map(u64::from_le_bytes)
                    .ok_or(InvalidInstruction)?;

                let (usd_min_amount, rest) = rest.split_at(8);
                let usd_min_amount = usd_min_amount
                    .try_into()
                    .ok()
                    .map(u64::from_le_bytes)
                    .ok_or(InvalidInstruction)?;

                let (usd_max_amount, rest) = rest.split_at(8);
                let usd_max_amount = usd_max_amount
                    .try_into()
                    .ok()
                    .map(u64::from_le_bytes)
                    .ok_or(InvalidInstruction)?;

                let (token_sale_price, rest) = rest.split_at(8);
                let token_sale_price = token_sale_price
                    .try_into()
                    .ok()
                    .map(u64::from_le_bytes)
                    .ok_or(InvalidInstruction)?;

                let (token_sale_time, rest) = rest.split_at(8);
                let token_sale_time = token_sale_time
                    .try_into()
                    .ok()
                    .map(u64::from_le_bytes)
                    .ok_or(InvalidInstruction)?;

                let (initial_fraction, rest) = rest.split_at(2);
                let initial_fraction = initial_fraction
                    .try_into()
                    .ok()
                    .map(u16::from_le_bytes)
                    .ok_or(InvalidInstruction)?;

                let len = rest.len() / 8;
                let mut release_schedule = Vec::with_capacity(len);
                let mut offset = 0;
                for _ in 0..len {
                    let release_time = rest
                        .get(offset..offset + 8)
                        .and_then(|slice| slice.try_into().ok())
                        .map(u64::from_le_bytes)
                        .ok_or(InvalidInstruction)?;
                    offset += 8;
                    release_schedule.push(release_time);
                }
                    
                Self::InitTokenSale {
                    token_sale_amount,
                    usd_min_amount,
                    usd_max_amount,
                    token_sale_price,
                    token_sale_time,
                    initial_fraction,
                    release_schedule,
                }
            },
            1 => {
                let (token_sale_amount, _rest) = rest.split_at(8);
                let token_sale_amount = token_sale_amount
                    .try_into()
                    .ok()
                    .map(u64::from_le_bytes)
                    .ok_or(InvalidInstruction)?;

                Self::FundTokenSale {token_sale_amount}
            },
            2 => {
                let (usd_amount, _rest) = rest.split_at(8);
                let usd_amount = usd_amount
                    .try_into()
                    .ok()
                    .map(u64::from_le_bytes)
                    .ok_or(InvalidInstruction)?;

                Self::ExecuteTokenSale {usd_amount}
            },
            3 => {
                Self::PauseTokenSale {}
            },
            4 => {
                Self::ResumeTokenSale {}
            },
            5 => {
                Self::EndTokenSale {}
            },
            _ => return Err(InvalidInstruction.into()),
        })
    }

    /// Packs a [TokenSaleInstruction](enum.TokenSaleInstruction.html) into a byte buffer.
    pub fn pack(&self) -> Vec<u8> {
        let mut buf = Vec::with_capacity(size_of::<Self>());
        match *self {
            Self::InitTokenSale {
                token_sale_amount,
                usd_min_amount,
                usd_max_amount,
                token_sale_price,
                token_sale_time,
                initial_fraction,
                ref release_schedule,
            } => {
                buf.push(0);
                buf.extend_from_slice(&token_sale_amount.to_le_bytes());
                buf.extend_from_slice(&usd_min_amount.to_le_bytes());
                buf.extend_from_slice(&usd_max_amount.to_le_bytes());
                buf.extend_from_slice(&token_sale_price.to_le_bytes());
                buf.extend_from_slice(&token_sale_time.to_le_bytes());
                buf.extend_from_slice(&initial_fraction.to_le_bytes());
                for s in release_schedule.iter() {
                    buf.extend_from_slice(&s.to_le_bytes());
                }
            }
            Self::FundTokenSale { token_sale_amount } => {
                buf.push(1);
                buf.extend_from_slice(&token_sale_amount.to_le_bytes());
            }
            Self::ExecuteTokenSale { usd_amount } => {
                buf.push(2);
                buf.extend_from_slice(&usd_amount.to_le_bytes());
            }
            Self::PauseTokenSale {} => {
                buf.push(3);
            }
            Self::ResumeTokenSale {} => {
                buf.push(4);
            }
            Self::EndTokenSale {} => {
                buf.push(5);
            }
        };
        buf
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_pack_init_token_sale() {
        let sale_amount: u64 = 1000;
        let min_amount: u64 = 100;
        let max_amount: u64 = 500;
        let price: u64 = 10;
        let timestamp: u64 = 123456789;
        let initial_fraction: u16 = 6000;
        let release_schedule: Vec<u64> = vec![1, 2];

        let check = TokenSaleInstruction::InitTokenSale {
            token_sale_amount: sale_amount,
            usd_min_amount: min_amount,
            usd_max_amount: max_amount,
            token_sale_price: price,
            token_sale_time: timestamp,
            initial_fraction,
            release_schedule: release_schedule.clone(),
        };
        let packed = check.pack();
        let mut expect = vec![0];
        expect.extend_from_slice(&sale_amount.to_le_bytes());
        expect.extend_from_slice(&min_amount.to_le_bytes());
        expect.extend_from_slice(&max_amount.to_le_bytes());
        expect.extend_from_slice(&price.to_le_bytes());
        expect.extend_from_slice(&timestamp.to_le_bytes());
        expect.extend_from_slice(&initial_fraction.to_le_bytes());
        for s in release_schedule.iter() {
            expect.extend_from_slice(&s.to_le_bytes());
        }
        assert_eq!(packed, expect);
        let unpacked = TokenSaleInstruction::unpack(&expect).unwrap();
        assert_eq!(unpacked, check);
    }

    #[test]
    fn test_pack_fund_token_sale() {
        let amount: u64 = 1000;
        let check = TokenSaleInstruction::FundTokenSale { token_sale_amount: amount };
        let packed = check.pack();
        let mut expect = vec![1];
        expect.extend_from_slice(&amount.to_le_bytes());
        assert_eq!(packed, expect);
        let unpacked = TokenSaleInstruction::unpack(&expect).unwrap();
        assert_eq!(unpacked, check);
    }

    #[test]
    fn test_pack_execute_token_sale() {
        let amount: u64 = 100;
        let check = TokenSaleInstruction::ExecuteTokenSale { usd_amount: amount };
        let packed = check.pack();
        let mut expect = vec![2];
        expect.extend_from_slice(&amount.to_le_bytes());
        assert_eq!(packed, expect);
        let unpacked = TokenSaleInstruction::unpack(&expect).unwrap();
        assert_eq!(unpacked, check);
    }
}
