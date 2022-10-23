/// <reference types="node" />
import { Idl, InstructionCoder } from "@project-serum/anchor";
export declare class TokenVestingInstructionCoder implements InstructionCoder {
    constructor(_idl: Idl);
    encode(ixName: string, ix: any): Buffer;
    encodeState(_ixName: string, _ix: any): Buffer;
}
//# sourceMappingURL=instructions.d.ts.map