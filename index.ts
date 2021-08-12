import {
    Connection,
    PublicKey,
    sendAndConfirmRawTransaction,
    Transaction
} from '@solana/web3.js';
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    Token
} from '@solana/spl-token';
import Test from './test';
import BN from 'bn.js';
import * as borsh from 'borsh';

// const ownerPubkey = new PublicKey("DQAz5PUg74W3Xb1yxJbRCvp1XF4pvK9up3H4rg7dwaTH");
const ownerPubkey = new PublicKey(
    '32Pywheud36PXzVqM6YfPJs9dtYhwn9indSsbZ23ieEA'
);
const METAPLEX_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

async function main() {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    // const config = {
    //     encoding: "base64",
    //     filters: [
    //         {
    //             dataSize: 165,
    //         },
    //         {
    //             memcmp: {
    //                 offset: 32,
    //                 bytes: ownerPubkey,
    //             },
    //         },
    //     ],
    // };
    // const tokenAccounts = await connection.getProgramAccounts(
    //     TOKEN_PROGRAM_ID,
    //     config
    // );

    // const firstAccount = tokenAccounts[0];

    // const accountInfo = await connection.getAccountInfo(firstAccount.pubkey);
    // console.log(accountInfo);
    // console.log(firstAccount.pubkey.toBase58());

    let firstMint = '';

    // const accounts = await connection.getParsedTokenAccountsByOwner(ownerPubkey, { programId: TOKEN_PROGRAM_ID});
    // // for (const item of accounts.value) {
    // //     console.log(`account: ${item.pubkey.toString()}`);
    // //     console.log(`mint: ${item.account.data.parsed.info.mint}`);
    // // }
    // const mint = accounts.value[0].account.data.parsed.info.mint;

    /* Try to find metadata account for this NFT: https://solanart.io/account/32Pywheud36PXzVqM6YfPJs9dtYhwn9indSsbZ23ieEA 
    mint account: GwkDG5pCjavFkeTbQzXRnEq5FoA4V96FYGopRPUjv11T
    currently owned by: 32Pywheud36PXzVqM6YfPJs9dtYhwn9indSsbZ23ieEA
    */
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
