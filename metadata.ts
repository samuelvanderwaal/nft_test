import { PublicKey } from '@solana/web3.js';
import * as borsh from 'borsh';

function intToBool(i: number) {
    if (i == 0) {
        return false;
    } else {
        return true;
    }
}

function boolToInt(t: boolean) {
    if (t) {
        return 1;
    } else {
        return 0;
    }
}

const boolMapper = {
    encode: boolToInt,
    decode: intToBool
};

class Metadata {
    public key: string;
    public updateAuthority: PublicKey;
    public mint: PublicKey;
    public data: Data;
    public primarySaleHappened: boolean;
    public isMutable: boolean;

    static schema: borsh.Schema = new Map([
        [
            // 679 bytes
            Metadata,
            {
                kind: 'struct',
                fields: [
                    ['key', 'u8'],
                    ['updateAuthority', [32]],
                    ['mint', [32]],
                    ['name', [32]],
                    ['symbol', [10]],
                    ['uri', [200]],
                    ['sellerFeeBasisPoints', 'u16'],
                    ['address', [32]],
                    ['verified', 'u8', boolMapper]
                ]
            }
        ]
    ]);

    constructor(params: { key: string });
}

class Data {
    public name: string;
    public symbol: string;
    public uri: string;
    public sellerFeeBasisPoints: number;
    public creators: Creator[] | null;
}

class Creator {
    public address: PublicKey;
    public verified: boolean;
    public share: number;
}
