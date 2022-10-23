/// <reference types="node" />
import { AccountsCoder, Idl } from "@project-serum/anchor";
import { IdlTypeDef } from "@project-serum/anchor/dist/cjs/idl";
export declare class TokenVestingAccountsCoder<A extends string = string> implements AccountsCoder {
    constructor(_idl: Idl);
    encode<T = any>(accountName: A, account: T): Promise<Buffer>;
    decode<T = any>(accountName: A, ix: Buffer): T;
    decodeUnchecked<T = any>(accountName: A, ix: Buffer): T;
    memcmp(accountName: A, _appendData?: Buffer): {
        dataSize?: number;
        offset?: number;
        bytes?: string;
    };
    size(idlAccount: IdlTypeDef): number;
}
//# sourceMappingURL=accounts.d.ts.map