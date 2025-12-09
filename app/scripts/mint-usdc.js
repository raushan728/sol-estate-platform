import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import fs from "fs";
import os from "os";

// --- CONFIGURATION ---
const USER_WALLET_ADDRESS = "AbEmcNkU9c1BeeXqjCipx9CQdFD1K987gWu6usdKQKkX";
// ---------------------

async function main() {
  console.log("🔌 Connecting to Solana Devnet...");

  // Connection with custom timeout
  const connection = new Connection("https://api.devnet.solana.com", {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000, //  wait for 60 seconds
  });

  // Load Local Wallet
  const homeDir = os.homedir();
  const keypairPath = `${homeDir}/.config/solana/id.json`;
  const secretKey = Uint8Array.from(
    JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
  );
  const payer = Keypair.fromSecretKey(secretKey);

  console.log("🛠️  Mint Authority:", payer.publicKey.toString());
  console.log("👤 User Wallet:", USER_WALLET_ADDRESS);

  // Create New USDC Mint
  console.log("⏳ Creating new Fake USDC Mint (Please wait)...");
  const mint = await createMint(connection, payer, payer.publicKey, null, 6);
  console.log("✅ New USDC Mint Address:", mint.toString());

  // Create Token Account
  console.log("⚙️  Creating Token Account...");
  const userPubkey = new PublicKey(USER_WALLET_ADDRESS);
  const userTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    userPubkey
  );

  // Mint Tokens
  console.log("💸 Minting 1,000,000 USDC to user...");
  await mintTo(
    connection,
    payer,
    mint,
    userTokenAccount.address,
    payer,
    1000000 * 1000000
  );

  console.log("\n🎉 SUCCESS! Fake USDC sent.");
  console.log("---------------------------------------------------");
  console.log("COPY THIS ADDRESS FOR ADMIN PAGE:");
  console.log(mint.toString());
  console.log("---------------------------------------------------");
}

main().catch((err) => console.error("❌ ERROR:", err));
