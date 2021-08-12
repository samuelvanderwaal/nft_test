import { PublicKey } from '@solana/web3.js';
import * as borsh from 'borsh';
import BN from 'bn.js';

export default class Test {
    // public funder: PublicKey;
    public funder: Uint8Array;
    public amount: BN;

    static schema: borsh.Schema = new Map([
        [
            Test,
            {
                kind: 'struct',
                fields: [
                    ['funder', [32]],
                    ['amount', 'u64']
                ]
            }
        ]
    ]);

    constructor(params: { funder: Uint8Array; amount: BN }) {
        // this.funder = new PublicKey(params.funder);
        this.funder = params.funder;
        // this.amount = new BN(params.amount);
        this.amount = params.amount;
    }
}
