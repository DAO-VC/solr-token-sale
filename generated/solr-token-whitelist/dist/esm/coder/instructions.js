// @ts-nocheck
import * as B from "@native-to-anchor/buffer-layout";
export class SolrTokenWhitelistInstructionCoder {
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