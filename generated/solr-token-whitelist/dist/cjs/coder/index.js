"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolrTokenWhitelistCoder = void 0;
const accounts_1 = require("./accounts");
const events_1 = require("./events");
const instructions_1 = require("./instructions");
const state_1 = require("./state");
const types_1 = require("./types");
/**
 * Coder for SolrTokenWhitelist
 */
class SolrTokenWhitelistCoder {
    constructor(idl) {
        this.accounts = new accounts_1.SolrTokenWhitelistAccountsCoder(idl);
        this.events = new events_1.SolrTokenWhitelistEventsCoder(idl);
        this.instruction = new instructions_1.SolrTokenWhitelistInstructionCoder(idl);
        this.state = new state_1.SolrTokenWhitelistStateCoder(idl);
        this.types = new types_1.SolrTokenWhitelistTypesCoder(idl);
    }
}
exports.SolrTokenWhitelistCoder = SolrTokenWhitelistCoder;
//# sourceMappingURL=index.js.map