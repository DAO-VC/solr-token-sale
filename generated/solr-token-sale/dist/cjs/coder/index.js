"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolrTokenSaleCoder = void 0;
const accounts_1 = require("./accounts");
const events_1 = require("./events");
const instructions_1 = require("./instructions");
const state_1 = require("./state");
const types_1 = require("./types");
/**
 * Coder for SolrTokenSale
 */
class SolrTokenSaleCoder {
    constructor(idl) {
        this.accounts = new accounts_1.SolrTokenSaleAccountsCoder(idl);
        this.events = new events_1.SolrTokenSaleEventsCoder(idl);
        this.instruction = new instructions_1.SolrTokenSaleInstructionCoder(idl);
        this.state = new state_1.SolrTokenSaleStateCoder(idl);
        this.types = new types_1.SolrTokenSaleTypesCoder(idl);
    }
}
exports.SolrTokenSaleCoder = SolrTokenSaleCoder;
//# sourceMappingURL=index.js.map