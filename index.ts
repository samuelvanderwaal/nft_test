import { Connection, PublicKey } from '@solana/web3.js';
import Test from './test';
import BN from 'bn.js';
import * as borsh from 'borsh';

const ownerPubkey = new PublicKey(
    '32Pywheud36PXzVqM6YfPJs9dtYhwn9indSsbZ23ieEA'
);
const METAPLEX_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

async function main() {
    const connection = new Connection('https://api.mainnet-beta.solana.com');

    /* Try to find metadata account for this NFT: https://solanart.io/account/32Pywheud36PXzVqM6YfPJs9dtYhwn9indSsbZ23ieEA 
    mint account: GwkDG5pCjavFkeTbQzXRnEq5FoA4V96FYGopRPUjv11T
    currently owned by: 32Pywheud36PXzVqM6YfPJs9dtYhwn9indSsbZ23ieEA
    */

    // getMints(connection);

    // Test borsch serialization/deserialization
    const test = new Test({
        funder: ownerPubkey.toBytes(),
        amount: new BN(100e9)
    });
    const schema = Test.schema;
    const data = borsh.serialize(schema, test);
    const deserTest = borsh.deserialize(schema, Test, Buffer.from(data));
    console.log(deserTest);
}

main().catch((e) => console.error(e));

async function getMints(connection: Connection) {
    const mintPubkey = new PublicKey(
        'GwkDG5pCjavFkeTbQzXRnEq5FoA4V96FYGopRPUjv11T'
    );
    const metaplexPubkey = new PublicKey(METAPLEX_PROGRAM_ID);

    const seeds = [
        Buffer.from('metadata'),
        metaplexPubkey.toBuffer(),
        mintPubkey.toBuffer()
    ];
    const [pda, nonce] = await PublicKey.findProgramAddress(
        seeds,
        metaplexPubkey
    );
    // console.log(`mint: ${mintPubkey}`);
    console.log(`pda: ${pda}`);

    const accountInfo = await connection.getAccountInfo(pda);
    if (accountInfo) {
        const data = accountInfo.data;
        console.log(data);
    }
}
