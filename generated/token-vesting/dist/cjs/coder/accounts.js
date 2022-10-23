"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenVestingAccountsCoder = void 0;
class TokenVestingAccountsCoder {
    constructor(_idl) { }
    async encode(accountName, account) {
        switch (accountName) {
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    decode(accountName, ix) {
        return this.decodeUnchecked(accountName, ix);
    }
    decodeUnchecked(accountName, ix) {
        switch (accountName) {
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    memcmp(accountName, _appendData) {
        switch (accountName) {
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    size(idlAccount) {
        switch (idlAccount.name) {
            default: {
                throw new Error(`Invalid account name: ${idlAccount.name}`);
            }
        }
    }
}
exports.TokenVestingAccountsCoder = TokenVestingAccountsCoder;
//# sourceMappingURL=accounts.js.map