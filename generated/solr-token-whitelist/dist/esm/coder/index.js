import { SolrTokenWhitelistAccountsCoder } from "./accounts";
import { SolrTokenWhitelistEventsCoder } from "./events";
import { SolrTokenWhitelistInstructionCoder } from "./instructions";
import { SolrTokenWhitelistStateCoder } from "./state";
import { SolrTokenWhitelistTypesCoder } from "./types";
/**
 * Coder for SolrTokenWhitelist
 */
export class SolrTokenWhitelistCoder {
    constructor(idl) {
        this.accounts = new SolrTokenWhitelistAccountsCoder(idl);
        this.events = new SolrTokenWhitelistEventsCoder(idl);
        this.instruction = new SolrTokenWhitelistInstructionCoder(idl);
        this.state = new SolrTokenWhitelistStateCoder(idl);
        this.types = new SolrTokenWhitelistTypesCoder(idl);
    }
}
//# sourceMappingURL=index.js.map