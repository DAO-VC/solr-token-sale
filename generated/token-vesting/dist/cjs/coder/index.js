"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenVestingCoder = void 0;
const accounts_1 = require("./accounts");
const events_1 = require("./events");
const instructions_1 = require("./instructions");
const state_1 = require("./state");
const types_1 = require("./types");
/**
 * Coder for TokenVesting
 */
class TokenVestingCoder {
    constructor(idl) {
        this.accounts = new accounts_1.TokenVestingAccountsCoder(idl);
        this.events = new events_1.TokenVestingEventsCoder(idl);
        this.instruction = new instructions_1.TokenVestingInstructionCoder(idl);
        this.state = new state_1.TokenVestingStateCoder(idl);
        this.types = new types_1.TokenVestingTypesCoder(idl);
    }
}
exports.TokenVestingCoder = TokenVestingCoder;
//# sourceMappingURL=index.js.map