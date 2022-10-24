import * as anchor from "@project-serum/anchor";
import {Keypair, PublicKey} from "@solana/web3.js";
import {
  creatMintIfRequired,
  getATA,
  getCurrentBlockTime,
  mintToATA,
  waitUntilBlockTime,
  waitUntilblockTime
} from "./utils";
import {BN, web3} from "@project-serum/anchor";

import {solrTokenWhitelistProgram} from "@native-to-anchor/solr-token-whitelist";
import {tokenVestingProgram} from "@native-to-anchor/token-vesting";
import {solrTokenSaleProgram} from "@native-to-anchor/solr-token-sale";

describe("token-sale", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const splProgram = anchor.Spl.token();

  let whitelistProgram = solrTokenWhitelistProgram(
    {
      programId: new PublicKey("4ikowHMssMavQeDUaDVGPwsBcNMnU1nkzAJikMFG5mfv"),
    }
  );

  let vestingProgram = tokenVestingProgram(
    {
      programId: new PublicKey("CChTq6PthWU82YZkbveA3WDf7s97BWhBK4Vx9bmsT743"),
    }
  )

  let saleProgram = solrTokenSaleProgram({
    programId: new PublicKey("FGsPzi6df2SL1ycYaiXB5bP8WguC9iWVhdoChn3TVjLN"),
  })

  let whitelist1 = Keypair.generate();
  let theSale = Keypair.generate();

  let poolToken = Keypair.generate();
  let saleToken = Keypair.generate();

  let usdtMint = Keypair.generate();
  let saleMint = Keypair.generate();

  let funder = Keypair.generate();

  before(async() => {
    await creatMintIfRequired(splProgram, usdtMint, provider.wallet.publicKey);
    await creatMintIfRequired(splProgram, saleMint, provider.wallet.publicKey);

    await mintToATA(splProgram, funder.publicKey, new BN(1_000_000_000), saleMint.publicKey, provider.wallet.publicKey);
    await mintToATA(splProgram, provider.wallet.publicKey, new BN(1_000_000_000), usdtMint.publicKey, provider.wallet.publicKey);
  });

  it("Init and create token whitelist", async () => {
    const ACCOUNT_STATE_SPACE = 500000; // sufficient to hold at least 50 pubkeys in a map
    const MAX_WHITELIST_ACCOUNTS = 5; // number of whitelist accounts that can be added to the whitelist map

    await whitelistProgram.methods.initTokenWhitelist(new BN(MAX_WHITELIST_ACCOUNTS))
      .accounts({
        authority: funder.publicKey,
        whitelist: whitelist1.publicKey,
      })
      .preInstructions([
        anchor.web3.SystemProgram.createAccount({
          space: ACCOUNT_STATE_SPACE,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(ACCOUNT_STATE_SPACE),
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: whitelist1.publicKey,
          programId: whitelistProgram.programId,
        })
      ]).signers([whitelist1, funder])
      .rpc();

    await whitelistProgram.methods.addToWhitelist(new BN(1))
      .accounts({
        authority: funder.publicKey,
        whitelist: whitelist1.publicKey,
        newAcc: provider.wallet.publicKey,
      })
      .signers([funder])
      .rpc();
  });

  it("Init and create sale", async () => {
    const RELEASE_SCHEDULE_SIZE = 3;
    const TOKEN_SALE_SPACE = 237 + 4 + RELEASE_SCHEDULE_SIZE * 8;

    let createIxn = anchor.web3.SystemProgram.createAccount({
      space: TOKEN_SALE_SPACE,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(TOKEN_SALE_SPACE),
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: theSale.publicKey,
      programId: saleProgram.programId,
    });

    const currentTime = await getCurrentBlockTime(provider.connection);
    let schedule = [new BN(currentTime + 5), new BN(currentTime + 10), new BN(currentTime + 15)];

    await saleProgram.methods.initTokenSale(
        new BN(1_000_000_000), // tokenSaleAmount
        new BN(1_000_000), // usdMinAmount
        new BN(10_000_000), // usdMaxAmount
        new BN(10), // tokenSalePrice
        new BN(currentTime), // tokenSaleTime
        250, // initialFraction
        schedule // releaseSchedule
    ).accounts({
      authority: funder.publicKey,
      sale: theSale.publicKey,
      poolToken: poolToken.publicKey,
      saleToken: saleToken.publicKey,
      whitelist: whitelist1.publicKey,
      whitelistProgram: whitelistProgram.programId,
      vestingProgram: vestingProgram.programId,
    }).preInstructions(
      [
        anchor.web3.SystemProgram.createAccount({
          space: TOKEN_SALE_SPACE,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(TOKEN_SALE_SPACE),
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: theSale.publicKey,
          programId: saleProgram.programId,
        }),
        await splProgram.account.token.createInstruction(poolToken),
        await splProgram.methods.initializeAccount()
          .accounts({
            account: poolToken.publicKey,
            mint: usdtMint.publicKey,
            authority: funder.publicKey,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          }).instruction(),
        await splProgram.account.token.createInstruction(saleToken),
        await splProgram.methods.initializeAccount()
          .accounts({
            account: saleToken.publicKey,
            mint: saleMint.publicKey,
            authority: funder.publicKey,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          }).instruction(),
      ]
    )
      .postInstructions([
        // fund sale with sale tokens
        await saleProgram.methods.fundTokenSale(new BN(1_000_000_000))
          .accounts({
            funder: funder.publicKey,
            sale: theSale.publicKey,
            srcToken: await getATA(funder.publicKey, saleMint.publicKey),
            saleToken: saleToken.publicKey,
          })
          .instruction()
      ])
      .signers([funder, theSale, poolToken, saleToken])
      .rpc();

    // waiting until the sale is active
    // await waitUntilBlockTime(provider.connection, currentTime + 2);

    // execute the sale
  });
});
