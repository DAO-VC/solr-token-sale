import { Idl, Coder } from "@project-serum/anchor";
import { SolrTokenWhitelistAccountsCoder } from "./accounts";
import { SolrTokenWhitelistEventsCoder } from "./events";
import { SolrTokenWhitelistInstructionCoder } from "./instructions";
import { SolrTokenWhitelistStateCoder } from "./state";
import { SolrTokenWhitelistTypesCoder } from "./types";
/**
 * Coder for SolrTokenWhitelist
 */
export declare class SolrTokenWhitelistCoder implements Coder {
    readonly accounts: SolrTokenWhitelistAccountsCoder;
    readonly events: SolrTokenWhitelistEventsCoder;
    readonly instruction: SolrTokenWhitelistInstructionCoder;
    readonly state: SolrTokenWhitelistStateCoder;
    readonly types: SolrTokenWhitelistTypesCoder;
    constructor(idl: Idl);
}
//# sourceMappingURL=index.d.ts.map