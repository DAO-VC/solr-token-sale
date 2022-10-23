"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolrTokenWhitelistAccountsCoder = void 0;
class SolrTokenWhitelistAccountsCoder {
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
exports.SolrTokenWhitelistAccountsCoder = SolrTokenWhitelistAccountsCoder;
//# sourceMappingURL=accounts.js.map