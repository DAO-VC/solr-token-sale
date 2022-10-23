import { Idl, Coder } from "@project-serum/anchor";

import { SolrTokenSaleAccountsCoder } from "./accounts";
import { SolrTokenSaleEventsCoder } from "./events";
import { SolrTokenSaleInstructionCoder } from "./instructions";
import { SolrTokenSaleStateCoder } from "./state";
import { SolrTokenSaleTypesCoder } from "./types";

/**
 * Coder for SolrTokenSale
 */
export class SolrTokenSaleCoder implements Coder {
  readonly accounts: SolrTokenSaleAccountsCoder;
  readonly events: SolrTokenSaleEventsCoder;
  readonly instruction: SolrTokenSaleInstructionCoder;
  readonly state: SolrTokenSaleStateCoder;
  readonly types: SolrTokenSaleTypesCoder;

  constructor(idl: Idl) {
    this.accounts = new SolrTokenSaleAccountsCoder(idl);
    this.events = new SolrTokenSaleEventsCoder(idl);
    this.instruction = new SolrTokenSaleInstructionCoder(idl);
    this.state = new SolrTokenSaleStateCoder(idl);
    this.types = new SolrTokenSaleTypesCoder(idl);
  }
}
