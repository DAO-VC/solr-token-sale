"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolrTokenWhitelistStateCoder = void 0;
class SolrTokenWhitelistStateCoder {
    constructor(_idl) { }
    encode(_name, _account) {
        throw new Error("SolrTokenWhitelist does not have state");
    }
    decode(_ix) {
        throw new Error("SolrTokenWhitelist does not have state");
    }
}
exports.SolrTokenWhitelistStateCoder = SolrTokenWhitelistStateCoder;
//# sourceMappingURL=state.js.map