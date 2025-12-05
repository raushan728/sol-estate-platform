"use client";
import { useState } from "react";
import { useSolEstate } from "../hooks/useSolEstate";
import { web3, BN } from "@coral-xyz/anchor";
import { PROPERTY_SEED, VAULT_SEED } from "../utils/constants";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import Navbar from "../components/Navbar";

export default function AdminPage() {
  const { getProgram, wallet } = useSolEstate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    imageUrl: "",
    price: "",
    shares: "",
  });

  const handleListProperty = async () => {
    if (!wallet) return alert("Please connect wallet first!");
    const program = getProgram();
    if (!program) return;

    try {
      setLoading(true);

      const price = new BN(form.price);
      const totalShares = new BN(form.shares);

      const [propertyPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(PROPERTY_SEED), Buffer.from(form.name)],
        program.programId
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(VAULT_SEED), propertyPda.toBuffer()],
        program.programId
      );

      const usdcMint = new PublicKey(
        "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
      );

      await program.methods
        .listProperty(
          form.name,
          form.location,
          form.imageUrl,
          price,
          totalShares
        )
        .accounts({
          property: propertyPda,
          vaultAccount: vaultPda,
          usdcMint: usdcMint,
          owner: wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      alert("✅ Property Listed Successfully!");
      setForm({ name: "", location: "", imageUrl: "", price: "", shares: "" });
    } catch (error) {
      console.error(error);
      alert("❌ Error listing property (Check console)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-10 p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">
          List New Property
        </h1>

        <div className="space-y-4">
          <input
            placeholder="Property Name (e.g. Dubai Villa)"
            className="w-full p-3 bg-gray-700 rounded text-white outline-none focus:ring-2 ring-purple-500"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Location"
            className="w-full p-3 bg-gray-700 rounded text-white outline-none focus:ring-2 ring-purple-500"
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <input
            placeholder="Image URL"
            className="w-full p-3 bg-gray-700 rounded text-white outline-none focus:ring-2 ring-purple-500"
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Total Price (USDC)"
              className="w-1/2 p-3 bg-gray-700 rounded text-white outline-none focus:ring-2 ring-purple-500"
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Total Shares"
              className="w-1/2 p-3 bg-gray-700 rounded text-white outline-none focus:ring-2 ring-purple-500"
              onChange={(e) => setForm({ ...form, shares: e.target.value })}
            />
          </div>

          <button
            onClick={handleListProperty}
            disabled={loading}
            className="w-full py-4 mt-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "List Property on Blockchain 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}
