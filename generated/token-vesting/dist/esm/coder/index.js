import { TokenVestingAccountsCoder } from "./accounts";
import { TokenVestingEventsCoder } from "./events";
import { TokenVestingInstructionCoder } from "./instructions";
import { TokenVestingStateCoder } from "./state";
import { TokenVestingTypesCoder } from "./types";
/**
 * Coder for TokenVesting
 */
export class TokenVestingCoder {
    constructor(idl) {
        this.accounts = new TokenVestingAccountsCoder(idl);
        this.events = new TokenVestingEventsCoder(idl);
        this.instruction = new TokenVestingInstructionCoder(idl);
        this.state = new TokenVestingStateCoder(idl);
        this.types = new TokenVestingTypesCoder(idl);
    }
}
//# sourceMappingURL=index.js.map