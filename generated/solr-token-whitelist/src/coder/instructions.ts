// @ts-nocheck
import * as B from "@native-to-anchor/buffer-layout";
import { Idl, InstructionCoder } from "@project-serum/anchor";

export class SolrTokenWhitelistInstructionCoder implements InstructionCoder {
  constructor(_idl: Idl) {}

  encode(ixName: string, ix: any): Buffer {
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

  encodeState(_ixName: string, _ix: any): Buffer {
    throw new Error("SolrTokenWhitelist does not have state");
  }
}

function encodeInitTokenWhitelist({ maxWhitelistSize }: any): Buffer {
  return encodeData({ InitTokenWhitelist: { maxWhitelistSize } }, 1 + 8);
}

function encodeAddToWhitelist({ allocationAmount }: any): Buffer {
  return encodeData({ AddToWhitelist: { allocationAmount } }, 1 + 8);
}

function encodeRemoveFromWhitelist({}: any): Buffer {
  return encodeData({ RemoveFromWhitelist: {} }, 1);
}

function encodeSetAllocationToZero({}: any): Buffer {
  return encodeData({ SetAllocationToZero: {} }, 1);
}

function encodeCloseWhitelistAccount({}: any): Buffer {
  return encodeData({ CloseWhitelistAccount: {} }, 1);
}

const LAYOUT = B.union(B.u8("instruction"));
LAYOUT.addVariant(
  0,
  B.struct([B.u64("maxWhitelistSize")]),
  "InitTokenWhitelist"
);
LAYOUT.addVariant(1, B.struct([B.u64("allocationAmount")]), "AddToWhitelist");
LAYOUT.addVariant(2, B.struct([]), "RemoveFromWhitelist");
LAYOUT.addVariant(3, B.struct([]), "SetAllocationToZero");
LAYOUT.addVariant(4, B.struct([]), "CloseWhitelistAccount");

function encodeData(ix: any, span: number): Buffer {
  const b = Buffer.alloc(span);
  LAYOUT.encode(ix, b);
  return b;
}
