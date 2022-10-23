"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solrTokenWhitelistProgram = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@project-serum/anchor");
const coder_1 = require("./coder");
const SOLR_TOKEN_WHITELIST_PROGRAM_ID = web3_js_1.PublicKey.default;
function solrTokenWhitelistProgram(params) {
    var _a;
    return new anchor_1.Program(IDL, (_a = params === null || params === void 0 ? void 0 : params.programId) !== null && _a !== void 0 ? _a : SOLR_TOKEN_WHITELIST_PROGRAM_ID, params === null || params === void 0 ? void 0 : params.provider, new coder_1.SolrTokenWhitelistCoder(IDL));
}
exports.solrTokenWhitelistProgram = solrTokenWhitelistProgram;
const IDL = {
    version: "1.0.2",
    name: "solr-token-whitelist",
    instructions: [
        {
            name: "InitTokenWhitelist",
            accounts: [
                {
                    name: "authority",
                    isMut: false,
                    isSigner: true,
                },
                {
                    name: "whitelist",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "rent",
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: "maxWhitelistSize",
                    type: "u64",
                },
            ],
        },
        {
            name: "AddToWhitelist",
            accounts: [
                {
                    name: "authority",
                    isMut: false,
                    isSigner: true,
                },
                {
                    name: "whitelist",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "newAcc",
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: "allocationAmount",
                    type: "u64",
                },
            ],
        },
        {
            name: "RemoveFromWhitelist",
            accounts: [
                {
                    name: "authority",
                    isMut: false,
                    isSigner: true,
                },
                {
                    name: "whitelist",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "remove",
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [],
        },
        {
            name: "SetAllocationToZero",
            accounts: [
                {
                    name: "authority",
                    isMut: false,
                    isSigner: true,
                },
                {
                    name: "whitelist",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "reset",
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [],
        },
        {
            name: "CloseWhitelistAccount",
            accounts: [
                {
                    name: "authority",
                    isMut: false,
                    isSigner: true,
                },
                {
                    name: "whitelist",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "dest",
                    isMut: true,
                    isSigner: false,
                },
            ],
            args: [],
        },
    ],
    errors: [],
};
//# sourceMappingURL=program.js.map