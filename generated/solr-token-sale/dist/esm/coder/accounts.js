// @ts-nocheck
import * as B from "@native-to-anchor/buffer-layout";
export class SolrTokenSaleAccountsCoder {
    constructor(_idl) { }
    async encode(accountName, account) {
        switch (accountName) {
            case "sale": {
                const buffer = Buffer.alloc(10485760); // Space is variable
                const len = SALE_LAYOUT.encode(account, buffer);
                return buffer.slice(0, len);
            }
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
            case "sale": {
                return decodeSaleAccount(ix);
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    memcmp(accountName, _appendData) {
        switch (accountName) {
            case "sale": {
                return {
                // Space is variable
                };
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    size(idlAccount) {
        switch (idlAccount.name) {
            case "sale": {
                return 0; // Space is variable;
            }
            default: {
                throw new Error(`Invalid account name: ${idlAccount.name}`);
            }
        }
    }
}
function decodeSaleAccount(ix) {
    return SALE_LAYOUT.decode(ix);
}
const SALE_LAYOUT = B.struct([
    B.bool("isInitialized"),
    B.publicKey("authority"),
    B.publicKey("saleToken"),
    B.publicKey("poolToken"),
    B.publicKey("whitelistMap"),
    B.publicKey("whitelistProgram"),
    B.publicKey("vestingProgram"),
    B.u64("saleAmount"),
    B.u64("usdMin"),
    B.u64("usdMax"),
    B.u64("salePrice"),
    B.u64("saleTime"),
    B.u16("initialFraction"),
    B.bool("isPaused"),
    B.bool("isEnded"),
    B.vec(B.u64(), "releaseSchedule"),
]);
//# sourceMappingURL=accounts.js.map