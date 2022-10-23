"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenVestingTypesCoder = void 0;
class TokenVestingTypesCoder {
    constructor(_idl) { }
    encode(_name, _type) {
        throw new Error("TokenVesting does not have user-defined types");
    }
    decode(_name, _typeData) {
        throw new Error("TokenVesting does not have user-defined types");
    }
}
exports.TokenVestingTypesCoder = TokenVestingTypesCoder;
//# sourceMappingURL=types.js.map