"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenVestingStateCoder = void 0;
class TokenVestingStateCoder {
    constructor(_idl) { }
    encode(_name, _account) {
        throw new Error("TokenVesting does not have state");
    }
    decode(_ix) {
        throw new Error("TokenVesting does not have state");
    }
}
exports.TokenVestingStateCoder = TokenVestingStateCoder;
//# sourceMappingURL=state.js.map