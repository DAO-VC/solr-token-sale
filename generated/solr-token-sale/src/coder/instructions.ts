// @ts-nocheck
import * as B from "@native-to-anchor/buffer-layout";
import { Idl, InstructionCoder } from "@project-serum/anchor";

export class SolrTokenSaleInstructionCoder implements InstructionCoder {
  constructor(_idl: Idl) {}

  encode(ixName: string, ix: any): Buffer {
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

  encodeState(_ixName: string, _ix: any): Buffer {
    throw new Error("SolrTokenSale does not have state");
  }
}

function encodeInitTokenSale({
  tokenSaleAmount,
  usdMinAmount,
  usdMaxAmount,
  tokenSalePrice,
  tokenSaleTime,
  initialFraction,
  releaseSchedule,
}: any): Buffer {
  return encodeData(
    {
      InitTokenSale: {
        tokenSaleAmount,
        usdMinAmount,
        usdMaxAmount,
        tokenSalePrice,
        tokenSaleTime,
        initialFraction,
        releaseSchedule,
      },
    },
    1 + 8 + 8 + 8 + 8 + 8 + 2 + 4 + releaseSchedule.length * 8
  );
}

function encodeFundTokenSale({ tokenSaleAmount }: any): Buffer {
  return encodeData({ FundTokenSale: { tokenSaleAmount } }, 1 + 8);
}

function encodeExecuteTokenSale({ usdAmount }: any): Buffer {
  return encodeData({ ExecuteTokenSale: { usdAmount } }, 1 + 8);
}

function encodePauseTokenSale({}: any): Buffer {
  return encodeData({ PauseTokenSale: {} }, 1);
}

function encodeResumeTokenSale({}: any): Buffer {
  return encodeData({ ResumeTokenSale: {} }, 1);
}

function encodeEndTokenSale({}: any): Buffer {
  return encodeData({ EndTokenSale: {} }, 1);
}

const LAYOUT = B.union(B.u8("instruction"));
LAYOUT.addVariant(
  0,
  B.struct([
    B.u64("tokenSaleAmount"),
    B.u64("usdMinAmount"),
    B.u64("usdMaxAmount"),
    B.u64("tokenSalePrice"),
    B.u64("tokenSaleTime"),
    B.u16("initialFraction"),
    B.vec(B.u64(), "releaseSchedule"),
  ]),
  "InitTokenSale"
);
LAYOUT.addVariant(1, B.struct([B.u64("tokenSaleAmount")]), "FundTokenSale");
LAYOUT.addVariant(2, B.struct([B.u64("usdAmount")]), "ExecuteTokenSale");
LAYOUT.addVariant(3, B.struct([]), "PauseTokenSale");
LAYOUT.addVariant(4, B.struct([]), "ResumeTokenSale");
LAYOUT.addVariant(5, B.struct([]), "EndTokenSale");

function encodeData(ix: any, span: number): Buffer {
  const b = Buffer.alloc(span);
  LAYOUT.encode(ix, b);
  return b;
}
