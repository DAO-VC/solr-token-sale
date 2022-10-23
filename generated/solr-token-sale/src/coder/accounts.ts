// @ts-nocheck
import * as B from "@native-to-anchor/buffer-layout";
import { AccountsCoder, Idl } from "@project-serum/anchor";
import { IdlTypeDef } from "@project-serum/anchor/dist/cjs/idl";

export class SolrTokenSaleAccountsCoder<A extends string = string>
  implements AccountsCoder
{
  constructor(_idl: Idl) {}

  public async encode<T = any>(accountName: A, account: T): Promise<Buffer> {
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

  public decode<T = any>(accountName: A, ix: Buffer): T {
    return this.decodeUnchecked(accountName, ix);
  }

  public decodeUnchecked<T = any>(accountName: A, ix: Buffer): T {
    switch (accountName) {
      case "sale": {
        return decodeSaleAccount(ix);
      }
      default: {
        throw new Error(`Invalid account name: ${accountName}`);
      }
    }
  }

  public memcmp(
    accountName: A,
    _appendData?: Buffer
  ): { dataSize?: number; offset?: number; bytes?: string } {
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

  public size(idlAccount: IdlTypeDef): number {
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

function decodeSaleAccount<T = any>(ix: Buffer): T {
  return SALE_LAYOUT.decode(ix) as T;
}

const SALE_LAYOUT: any = B.struct([
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
