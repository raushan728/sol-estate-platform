"use client";

import { useState } from "react";
import { useSolEstate } from "../hooks/useSolEstate";
import { BN } from "@coral-xyz/anchor";
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
        "9zG2kotUAnxGY4WttgGFwkWRMGMjuV1UHwEiDGzLdXSu"
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0f0c29] to-black text-white selection:bg-purple-500 selection:text-white">
      <Navbar />

      <div className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-2xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-70 transition duration-1000"></div>

          <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            <div className="mb-10 text-center">
              <h1 className="text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight drop-shadow-lg">
                Admin Portal
              </h1>
              <p className="text-gray-400 text-lg font-light">
                List a new{" "}
                <span className="text-purple-400 font-semibold">
                  Real World Asset
                </span>{" "}
                on Solana.
              </p>
            </div>

            <div className="space-y-8">
              <div className="group/input">
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide group-focus-within/input:text-purple-400 transition-colors">
                  Property Name
                </label>
                <input
                  placeholder="e.g. Dubai Penthouse"
                  className="w-full bg-black/50 border border-white/20 rounded-xl p-5 text-white placeholder-gray-500 font-medium text-lg outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="group/input">
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide group-focus-within/input:text-purple-400 transition-colors">
                  Location
                </label>
                <input
                  placeholder="e.g. Downtown Dubai"
                  className="w-full bg-black/50 border border-white/20 rounded-xl p-5 text-white placeholder-gray-500 font-medium text-lg outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <div className="group/input">
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide group-focus-within/input:text-purple-400 transition-colors">
                  Image URL
                </label>
                <input
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-black/50 border border-white/20 rounded-xl p-5 text-white placeholder-gray-500 font-medium text-lg outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="group/input">
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide group-focus-within/input:text-purple-400 transition-colors">
                    Total Price (USDC)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="5000"
                      className="w-full bg-black/50 border border-white/20 rounded-xl p-5 pl-8 text-white placeholder-gray-500 font-medium text-lg outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="group/input">
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide group-focus-within/input:text-purple-400 transition-colors">
                    Total Shares
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full bg-black/50 border border-white/20 rounded-xl p-5 text-white placeholder-gray-500 font-medium text-lg outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
                    value={form.shares}
                    onChange={(e) =>
                      setForm({ ...form, shares: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                onClick={handleListProperty}
                disabled={loading}
                className="w-full py-5 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-xl text-white shadow-[0_10px_40px_-10px_rgba(168,85,247,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>🚀 Mint Property on Chain</>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
