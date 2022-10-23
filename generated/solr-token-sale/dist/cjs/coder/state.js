"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolrTokenSaleStateCoder = void 0;
class SolrTokenSaleStateCoder {
    constructor(_idl) { }
    encode(_name, _account) {
        throw new Error("SolrTokenSale does not have state");
    }
    decode(_ix) {
        throw new Error("SolrTokenSale does not have state");
    }
}
exports.SolrTokenSaleStateCoder = SolrTokenSaleStateCoder;
//# sourceMappingURL=state.js.map