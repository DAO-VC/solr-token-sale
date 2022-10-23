export class SolrTokenWhitelistStateCoder {
    constructor(_idl) { }
    encode(_name, _account) {
        throw new Error("SolrTokenWhitelist does not have state");
    }
    decode(_ix) {
        throw new Error("SolrTokenWhitelist does not have state");
    }
}
//# sourceMappingURL=state.js.map