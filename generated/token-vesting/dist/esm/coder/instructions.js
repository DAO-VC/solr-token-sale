// @ts-nocheck
import * as B from "@native-to-anchor/buffer-layout";
export class TokenVestingInstructionCoder {
    constructor(_idl) { }
    encode(ixName, ix) {
        switch (ixName) {
            case "Init": {
                return encodeInit(ix);
            }
            case "Create": {
                return encodeCreate(ix);
            }
            case "Unlock": {
                return encodeUnlock(ix);
            }
            case "ChangeDestination": {
                return encodeChangeDestination(ix);
            }
            default: {
                throw new Error(`Invalid instruction: ${ixName}`);
            }
        }
    }
    encodeState(_ixName, _ix) {
        throw new Error("TokenVesting does not have state");
    }
}
function encodeInit({ seeds, numberOfSchedules }) {
    return encodeData({ Init: { seeds, numberOfSchedules } }, 1 + 1 * 32 + 4);
}
function encodeCreate({ mintAddress, seeds, destToken, schedules, }) {
    return encodeData({ Create: { mintAddress, seeds, destToken, schedules } }, 1 + 32 + 1 * 32 + 32 + 4 + schedules.length * 16);
}
function encodeUnlock({ seeds }) {
    return encodeData({ Unlock: { seeds } }, 1 + 1 * 32);
}
function encodeChangeDestination({ seeds }) {
    return encodeData({ ChangeDestination: { seeds } }, 1 + 1 * 32);
}
const LAYOUT = B.union(B.u8("instruction"));
LAYOUT.addVariant(0, B.struct([B.seq(B.u8(), 32, "seeds"), B.u32("numberOfSchedules")]), "Init");
LAYOUT.addVariant(1, B.struct([
    B.publicKey("mintAddress"),
    B.seq(B.u8(), 32, "seeds"),
    B.publicKey("destToken"),
    B.vec(B.struct([B.u64("releaseTime"), B.u64("amount")]), "schedules"),
]), "Create");
LAYOUT.addVariant(2, B.struct([B.seq(B.u8(), 32, "seeds")]), "Unlock");
LAYOUT.addVariant(3, B.struct([B.seq(B.u8(), 32, "seeds")]), "ChangeDestination");
function encodeData(ix, span) {
    const b = Buffer.alloc(span);
    LAYOUT.encode(ix, b);
    return b;
}
//# sourceMappingURL=instructions.js.map