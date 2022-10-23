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
exports.SolrTokenWhitelistInstructionCoder = void 0;
// @ts-nocheck
const B = __importStar(require("@native-to-anchor/buffer-layout"));
class SolrTokenWhitelistInstructionCoder {
    constructor(_idl) { }
    encode(ixName, ix) {
        switch (ixName) {
            case "InitTokenWhitelist": {
                return encodeInitTokenWhitelist(ix);
            }
            case "AddToWhitelist": {
                return encodeAddToWhitelist(ix);
            }
            case "RemoveFromWhitelist": {
                return encodeRemoveFromWhitelist(ix);
            }
            case "SetAllocationToZero": {
                return encodeSetAllocationToZero(ix);
            }
            case "CloseWhitelistAccount": {
                return encodeCloseWhitelistAccount(ix);
            }
            default: {
                throw new Error(`Invalid instruction: ${ixName}`);
            }
        }
    }
    encodeState(_ixName, _ix) {
        throw new Error("SolrTokenWhitelist does not have state");
    }
}
exports.SolrTokenWhitelistInstructionCoder = SolrTokenWhitelistInstructionCoder;
function encodeInitTokenWhitelist({ maxWhitelistSize }) {
    return encodeData({ InitTokenWhitelist: { maxWhitelistSize } }, 1 + 8);
}
function encodeAddToWhitelist({ allocationAmount }) {
    return encodeData({ AddToWhitelist: { allocationAmount } }, 1 + 8);
}
function encodeRemoveFromWhitelist({}) {
    return encodeData({ RemoveFromWhitelist: {} }, 1);
}
function encodeSetAllocationToZero({}) {
    return encodeData({ SetAllocationToZero: {} }, 1);
}
function encodeCloseWhitelistAccount({}) {
    return encodeData({ CloseWhitelistAccount: {} }, 1);
}
const LAYOUT = B.union(B.u8("instruction"));
LAYOUT.addVariant(0, B.struct([B.u64("maxWhitelistSize")]), "InitTokenWhitelist");
LAYOUT.addVariant(1, B.struct([B.u64("allocationAmount")]), "AddToWhitelist");
LAYOUT.addVariant(2, B.struct([]), "RemoveFromWhitelist");
LAYOUT.addVariant(3, B.struct([]), "SetAllocationToZero");
LAYOUT.addVariant(4, B.struct([]), "CloseWhitelistAccount");
function encodeData(ix, span) {
    const b = Buffer.alloc(span);
    LAYOUT.encode(ix, b);
    return b;
}
//# sourceMappingURL=instructions.js.map