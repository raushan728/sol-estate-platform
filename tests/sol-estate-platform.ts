import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolEstatePlatform } from "../target/types/sol_estate_platform";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { assert } from "chai";

describe("sol-estate-platform", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .SolEstatePlatform as Program<SolEstatePlatform>;

  let usdcMint: anchor.web3.PublicKey;
  let adminWallet = provider.wallet as anchor.Wallet;
  let buyerWallet = anchor.web3.Keypair.generate();

  let propertyPda: anchor.web3.PublicKey;
  let vaultPda: anchor.web3.PublicKey;
  let investmentPda: anchor.web3.PublicKey;

  const propertyName = "Luxury Villa Mumbai";

  it("Setup: Create Mock USDC and fund Buyer", async () => {
    usdcMint = await createMint(
      provider.connection,
      adminWallet.payer,
      adminWallet.publicKey,
      null,
      6
    );

    const signature = await provider.connection.requestAirdrop(
      buyerWallet.publicKey,
      10000000000
    );
    await provider.connection.confirmTransaction(signature);

    const buyerTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      buyerWallet,
      usdcMint,
      buyerWallet.publicKey
    );

    await mintTo(
      provider.connection,
      adminWallet.payer,
      usdcMint,
      buyerTokenAccount.address,
      adminWallet.publicKey,
      5000 * 1000000
    );

    console.log("✅ Setup Complete: USDC Created & Buyer Funded");
  });

  it("List Property successfully", async () => {
    [propertyPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("property"), Buffer.from(propertyName)],
      program.programId
    );

    [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), propertyPda.toBuffer()],
      program.programId
    );

    await program.methods
      .listProperty(
        propertyName,
        "Mumbai, India",
        "https://example.com/image.jpg",
        new anchor.BN(1000000),
        new anchor.BN(100)
      )
      .accounts({
        property: propertyPda,
        vaultAccount: vaultPda,
        usdcMint: usdcMint,
        owner: adminWallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      } as any)
      .rpc();

    const propertyAccount = await program.account.property.fetch(propertyPda);
    console.log("✅ Property Listed:", propertyAccount.name);
    assert.equal(propertyAccount.name, propertyName);
    assert.equal(propertyAccount.totalShares.toNumber(), 100);
  });

  it("Buy Shares successfully", async () => {
    [investmentPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("investment"),
        propertyPda.toBuffer(),
        buyerWallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    const buyerTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      buyerWallet,
      usdcMint,
      buyerWallet.publicKey
    );

    await program.methods
      .buyShare(new anchor.BN(5))
      .accounts({
        property: propertyPda,
        userInvestment: investmentPda,
        vaultAccount: vaultPda,
        userUsdcAccount: buyerTokenAccount.address,
        buyer: buyerWallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([buyerWallet])
      .rpc();

    const investmentAccount = await program.account.userInvestment.fetch(
      investmentPda
    );
    const propertyAccount = await program.account.property.fetch(propertyPda);

    console.log("✅ Shares Bought:", investmentAccount.sharesOwned.toString());

    assert.equal(investmentAccount.sharesOwned.toNumber(), 5);
    assert.equal(propertyAccount.sharesSold.toNumber(), 5);
  });
});
