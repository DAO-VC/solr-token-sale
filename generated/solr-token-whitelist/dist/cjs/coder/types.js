"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolrTokenWhitelistTypesCoder = void 0;
class SolrTokenWhitelistTypesCoder {
    constructor(_idl) { }
    encode(_name, _type) {
        throw new Error("SolrTokenWhitelist does not have user-defined types");
    }
    decode(_name, _typeData) {
        throw new Error("SolrTokenWhitelist does not have user-defined types");
    }
}
exports.SolrTokenWhitelistTypesCoder = SolrTokenWhitelistTypesCoder;
//# sourceMappingURL=types.js.map