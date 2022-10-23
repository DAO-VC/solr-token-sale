"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolrTokenSaleAccountsCoder = void 0;
// @ts-nocheck
const B = __importStar(require("@native-to-anchor/buffer-layout"));
class SolrTokenSaleAccountsCoder {
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
exports.SolrTokenSaleAccountsCoder = SolrTokenSaleAccountsCoder;
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