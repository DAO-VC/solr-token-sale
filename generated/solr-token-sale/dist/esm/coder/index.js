import { SolrTokenSaleAccountsCoder } from "./accounts";
import { SolrTokenSaleEventsCoder } from "./events";
import { SolrTokenSaleInstructionCoder } from "./instructions";
import { SolrTokenSaleStateCoder } from "./state";
import { SolrTokenSaleTypesCoder } from "./types";
/**
 * Coder for SolrTokenSale
 */
export class SolrTokenSaleCoder {
    constructor(idl) {
        this.accounts = new SolrTokenSaleAccountsCoder(idl);
        this.events = new SolrTokenSaleEventsCoder(idl);
        this.instruction = new SolrTokenSaleInstructionCoder(idl);
        this.state = new SolrTokenSaleStateCoder(idl);
        this.types = new SolrTokenSaleTypesCoder(idl);
    }
}
//# sourceMappingURL=index.js.map