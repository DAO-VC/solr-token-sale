
/**
 * pubkeys.js - stores all pubkeys used across the program
 */

import {PublicKey} from '@solana/web3.js';

/// program ids

export const TOKEN_PROGRAM_ID: PublicKey = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // localnet && devnet
);
export const ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL', // localnet && devnet
);
export const TOKEN_SALE_PROGRAM_ID: PublicKey = new PublicKey(
  '5W2HZJuZTgYUebszgMcZjzgUxhBqmAHVkvfjgv6Qggvm', // localnet && devnet
);
export const TOKEN_WHITELIST_PROGRAM_ID: PublicKey = new PublicKey(
  '13PWaYgXsXrk1y2tSJDdMqBZp7jrqDMJCojP5pJCSUsu', // localnet && devnet
);
export const VESTING_PROGRAM_ID: PublicKey = new PublicKey(
  'DDE4RU8aHQTdbamEptMEMoXEscGu9aNW71iyNXo1WyMt', // localnet && devnet
);
// this must be updated with pubkey generated after init token whitelist
export const tokenWhitelistMap = new PublicKey('4dkW3qpDuu26eHPhouyHQhRBF5jSjZXYi69DbUWjUhmt'); // change this to token-whitelist map account