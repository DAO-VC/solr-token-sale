import { Idl, TypesCoder } from "@project-serum/anchor";

export class SolrTokenSaleTypesCoder implements TypesCoder {
  constructor(_idl: Idl) {}

  encode<T = any>(_name: string, _type: T): Buffer {
    throw new Error("SolrTokenSale does not have user-defined types");
  }
  decode<T = any>(_name: string, _typeData: Buffer): T {
    throw new Error("SolrTokenSale does not have user-defined types");
  }
}
