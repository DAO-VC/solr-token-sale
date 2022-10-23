import { PublicKey } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { SolrTokenWhitelistCoder } from "./coder";
const SOLR_TOKEN_WHITELIST_PROGRAM_ID = PublicKey.default;
export function solrTokenWhitelistProgram(params) {
    var _a;
    return new Program(IDL, (_a = params === null || params === void 0 ? void 0 : params.programId) !== null && _a !== void 0 ? _a : SOLR_TOKEN_WHITELIST_PROGRAM_ID, params === null || params === void 0 ? void 0 : params.provider, new SolrTokenWhitelistCoder(IDL));
}
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