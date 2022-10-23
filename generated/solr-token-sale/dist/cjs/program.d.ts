import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
interface GetProgramParams {
    programId?: PublicKey;
    provider?: AnchorProvider;
}
export declare function solrTokenSaleProgram(params?: GetProgramParams): Program<SolrTokenSale>;
declare type SolrTokenSale = {
    version: "1.0.0";
    name: "token-sale";
    instructions: [
        {
            name: "InitTokenSale";
            accounts: [
                {
                    name: "authority";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "sale";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "poolToken";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "saleToken";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "whitelist";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "tokenProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "whitelistProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "vestingProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "rent";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: "tokenSaleAmount";
                    type: "u64";
                },
                {
                    name: "usdMinAmount";
                    type: "u64";
                },
                {
                    name: "usdMaxAmount";
                    type: "u64";
                },
                {
                    name: "tokenSalePrice";
                    type: "u64";
                },
                {
                    name: "tokenSaleTime";
                    type: "u64";
                },
                {
                    name: "initialFraction";
                    type: "u16";
                },
                {
                    name: "releaseSchedule";
                    type: {
                        vec: "u64";
                    };
                }
            ];
        },
        {
            name: "FundTokenSale";
            accounts: [
                {
                    name: "funder";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "sale";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "srcToken";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "saleToken";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "tokenProgram";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: "tokenSaleAmount";
                    type: "u64";
                }
            ];
        },
        {
            name: "ExecuteTokenSale";
            accounts: [
                {
                    name: "user";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "sale";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "saleToken";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "userDestToken";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "userSourceToken";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "poolToken";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "signer";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "tokenProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "whitelistMap";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "whitelist";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "whitelistProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "rent";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "vesting";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "vestingToken";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "vestingProgram";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: "usdAmount";
                    type: "u64";
                }
            ];
        },
        {
            name: "PauseTokenSale";
            accounts: [
                {
                    name: "authority";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "sale";
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: "ResumeTokenSale";
            accounts: [
                {
                    name: "authority";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "sale";
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: "EndTokenSale";
            accounts: [
                {
                    name: "authority";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "sale";
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [];
        }
    ];
    accounts: [
        {
            name: "sale";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "isInitialized";
                        type: "bool";
                    },
                    {
                        name: "authority";
                        type: "publicKey";
                    },
                    {
                        name: "saleToken";
                        type: "publicKey";
                    },
                    {
                        name: "poolToken";
                        type: "publicKey";
                    },
                    {
                        name: "whitelistMap";
                        type: "publicKey";
                    },
                    {
                        name: "whitelistProgram";
                        type: "publicKey";
                    },
                    {
                        name: "vestingProgram";
                        type: "publicKey";
                    },
                    {
                        name: "saleAmount";
                        type: "u64";
                    },
                    {
                        name: "usdMin";
                        type: "u64";
                    },
                    {
                        name: "usdMax";
                        type: "u64";
                    },
                    {
                        name: "salePrice";
                        type: "u64";
                    },
                    {
                        name: "saleTime";
                        type: "u64";
                    },
                    {
                        name: "initialFraction";
                        type: "u16";
                    },
                    {
                        name: "isPaused";
                        type: "bool";
                    },
                    {
                        name: "isEnded";
                        type: "bool";
                    },
                    {
                        name: "releaseSchedule";
                        type: {
                            vec: "u64";
                        };
                    }
                ];
            };
        }
    ];
    errors: [
        {
            code: 0;
            name: "InvalidInstruction";
            msg: "Invalid Instruction";
        },
        {
            code: 1;
            name: "NotRentExempt";
            msg: "Not Rent Exempt";
        },
        {
            code: 2;
            name: "UserNotWhitelisted";
            msg: "User Not Whitelisted";
        },
        {
            code: 3;
            name: "TokenSaleNotInit";
            msg: "Token Sale Not Initialized";
        },
        {
            code: 4;
            name: "TokenSaleNotStarted";
            msg: "Token Sale Not Started";
        },
        {
            code: 5;
            name: "TokenSaleFunded";
            msg: "Token Sale Funded";
        },
        {
            code: 6;
            name: "TokenSaleAmountExceeds";
            msg: "Token Sale Amount Exceeds";
        },
        {
            code: 7;
            name: "TokenSaleComplete";
            msg: "Token Sale Complete";
        },
        {
            code: 8;
            name: "AmountMinimum";
            msg: "Amount Less Than Minimum";
        },
        {
            code: 9;
            name: "AmountMaximum";
            msg: "Amount More Than Maximum";
        },
        {
            code: 10;
            name: "AmountExceeds";
            msg: "Amount Exceeds Tokens Available For Sale";
        },
        {
            code: 11;
            name: "ExceedsAllocation";
            msg: "Amount Exceeds Your Allocation";
        },
        {
            code: 12;
            name: "TokenSalePaused";
            msg: "Token Sale Paused";
        },
        {
            code: 13;
            name: "TokenSaleEnded";
            msg: "Token Sale Ended";
        }
    ];
};
export {};
//# sourceMappingURL=program.d.ts.map