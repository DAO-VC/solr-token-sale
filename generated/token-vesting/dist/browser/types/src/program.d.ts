import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
interface GetProgramParams {
    programId?: PublicKey;
    provider?: AnchorProvider;
}
export declare function tokenVestingProgram(params?: GetProgramParams): Program<TokenVesting>;
declare type TokenVesting = {
    version: "0.1.0";
    name: "token-vesting";
    instructions: [
        {
            name: "Init";
            accounts: [
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
                    name: "payer";
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: "vesting";
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: "seeds";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "numberOfSchedules";
                    type: "u32";
                }
            ];
        },
        {
            name: "Create";
            accounts: [
                {
                    name: "tokenProgram";
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
                    name: "user";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "userToken";
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: "mintAddress";
                    type: "publicKey";
                },
                {
                    name: "seeds";
                    type: {
                        array: ["u8", 32];
                    };
                },
                {
                    name: "destToken";
                    type: "publicKey";
                },
                {
                    name: "schedules";
                    type: {
                        vec: {
                            defined: "Schedule";
                        };
                    };
                }
            ];
        },
        {
            name: "Unlock";
            accounts: [
                {
                    name: "tokenProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "clock";
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
                    name: "destToken";
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: "seeds";
                    type: {
                        array: ["u8", 32];
                    };
                }
            ];
        },
        {
            name: "ChangeDestination";
            accounts: [
                {
                    name: "vesting";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "currentDestToken";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "currentDestAuthority";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "targetDestToken";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: "seeds";
                    type: {
                        array: ["u8", 32];
                    };
                }
            ];
        }
    ];
    types: [
        {
            name: "Schedule";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "releaseTime";
                        type: "u64";
                    },
                    {
                        name: "amount";
                        type: "u64";
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
        }
    ];
};
export {};
//# sourceMappingURL=program.d.ts.map