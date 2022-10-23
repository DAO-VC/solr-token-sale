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
exports.SolrTokenSaleInstructionCoder = void 0;
// @ts-nocheck
const B = __importStar(require("@native-to-anchor/buffer-layout"));
class SolrTokenSaleInstructionCoder {
    constructor(_idl) { }
    encode(ixName, ix) {
        switch (ixName) {
            case "InitTokenSale": {
                return encodeInitTokenSale(ix);
            }
            case "FundTokenSale": {
                return encodeFundTokenSale(ix);
            }
            case "ExecuteTokenSale": {
                return encodeExecuteTokenSale(ix);
            }
            case "PauseTokenSale": {
                return encodePauseTokenSale(ix);
            }
            case "ResumeTokenSale": {
                return encodeResumeTokenSale(ix);
            }
            case "EndTokenSale": {
                return encodeEndTokenSale(ix);
            }
            default: {
                throw new Error(`Invalid instruction: ${ixName}`);
            }
        }
    }
    encodeState(_ixName, _ix) {
        throw new Error("SolrTokenSale does not have state");
    }
}
exports.SolrTokenSaleInstructionCoder = SolrTokenSaleInstructionCoder;
function encodeInitTokenSale({ tokenSaleAmount, usdMinAmount, usdMaxAmount, tokenSalePrice, tokenSaleTime, initialFraction, releaseSchedule, }) {
    return encodeData({
        InitTokenSale: {
            tokenSaleAmount,
            usdMinAmount,
            usdMaxAmount,
            tokenSalePrice,
            tokenSaleTime,
            initialFraction,
            releaseSchedule,
        },
    }, 1 + 8 + 8 + 8 + 8 + 8 + 2 + 4 + releaseSchedule.length * 8);
}
function encodeFundTokenSale({ tokenSaleAmount }) {
    return encodeData({ FundTokenSale: { tokenSaleAmount } }, 1 + 8);
}
function encodeExecuteTokenSale({ usdAmount }) {
    return encodeData({ ExecuteTokenSale: { usdAmount } }, 1 + 8);
}
function encodePauseTokenSale({}) {
    return encodeData({ PauseTokenSale: {} }, 1);
}
function encodeResumeTokenSale({}) {
    return encodeData({ ResumeTokenSale: {} }, 1);
}
function encodeEndTokenSale({}) {
    return encodeData({ EndTokenSale: {} }, 1);
}
const LAYOUT = B.union(B.u8("instruction"));
LAYOUT.addVariant(0, B.struct([
    B.u64("tokenSaleAmount"),
    B.u64("usdMinAmount"),
    B.u64("usdMaxAmount"),
    B.u64("tokenSalePrice"),
    B.u64("tokenSaleTime"),
    B.u16("initialFraction"),
    B.vec(B.u64(), "releaseSchedule"),
]), "InitTokenSale");
LAYOUT.addVariant(1, B.struct([B.u64("tokenSaleAmount")]), "FundTokenSale");
LAYOUT.addVariant(2, B.struct([B.u64("usdAmount")]), "ExecuteTokenSale");
LAYOUT.addVariant(3, B.struct([]), "PauseTokenSale");
LAYOUT.addVariant(4, B.struct([]), "ResumeTokenSale");
LAYOUT.addVariant(5, B.struct([]), "EndTokenSale");
function encodeData(ix, span) {
    const b = Buffer.alloc(span);
    LAYOUT.encode(ix, b);
    return b;
}
//# sourceMappingURL=instructions.js.map