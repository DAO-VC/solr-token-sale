import { Idl, Coder } from "@project-serum/anchor";
import { TokenVestingAccountsCoder } from "./accounts";
import { TokenVestingEventsCoder } from "./events";
import { TokenVestingInstructionCoder } from "./instructions";
import { TokenVestingStateCoder } from "./state";
import { TokenVestingTypesCoder } from "./types";
/**
 * Coder for TokenVesting
 */
export declare class TokenVestingCoder implements Coder {
    readonly accounts: TokenVestingAccountsCoder;
    readonly events: TokenVestingEventsCoder;
    readonly instruction: TokenVestingInstructionCoder;
    readonly state: TokenVestingStateCoder;
    readonly types: TokenVestingTypesCoder;
    constructor(idl: Idl);
}
//# sourceMappingURL=index.d.ts.map