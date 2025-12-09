"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSolEstate } from "../../hooks/useSolEstate";
import Navbar from "../../components/Navbar";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { VAULT_SEED, INVESTMENT_SEED } from "../../utils/constants";
import Link from "next/link";

export default function PropertyDetails() {
  const params = useParams();
  const id = params?.id as string;

  const { getProgram, wallet } = useSolEstate();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [shareAmount, setShareAmount] = useState("1");

  useEffect(() => {
    const fetchDetails = async () => {
      const program = getProgram();
      if (!program || !id) return;

      try {
        const propertyAddress = new PublicKey(id);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const account = await program.account.property.fetch(propertyAddress);
        setProperty(account);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, wallet]);

  const handleBuy = async () => {
    const program = getProgram();
    if (!wallet || !property || !program) return alert("Connect Wallet first!");

    try {
      setBuying(true);
      const propertyPubkey = new PublicKey(id);
      const amountToBuy = new BN(shareAmount);

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(VAULT_SEED), propertyPubkey.toBuffer()],
        program.programId
      );

      const [investmentPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(INVESTMENT_SEED),
          propertyPubkey.toBuffer(),
          wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      const userUsdcAccount = await getAssociatedTokenAddress(
        property.usdcMint,
        wallet.publicKey
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await program.methods
        .buyShare(amountToBuy)
        .accounts({
          property: propertyPubkey,
          userInvestment: investmentPda,
          vaultAccount: vaultPda,
          userUsdcAccount: userUsdcAccount,
          buyer: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      alert("🎉 Shares Bought Successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Buying failed:", error);
      alert("❌ Transaction Failed! Check Console.");
    } finally {
      setBuying(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );

  if (!property)
    return (
      <div className="text-white text-center mt-20">Property Not Found</div>
    );

  const price = parseInt(property.price.toString());
  const totalShares = parseInt(property.totalShares.toString());
  const soldShares = parseInt(property.sharesSold.toString());
  const sharePrice = price / totalShares;
  const availableShares = totalShares - soldShares;
  const progress = (soldShares / totalShares) * 100;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0f0c29] to-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition flex items-center gap-2"
          >
            ← Back to Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={property.imageUrl}
                alt={property.name}
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                  {property.name}
                </h1>
                <p className="text-xl text-gray-300 flex items-center gap-2">
                  📍 {property.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                  Total Valuation
                </p>
                <p className="text-2xl font-bold text-white">
                  ${price.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                  Share Price
                </p>
                <p className="text-2xl font-bold text-purple-400">
                  ${sharePrice.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                  Est. APY
                </p>
                <p className="text-2xl font-bold text-green-400">12-15%</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  Investment Terminal
                  <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                    Live
                  </span>
                </h2>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mb-8">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-300">Market Cap Filled</span>
                    <span className="text-purple-400 font-bold">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-500 h-full shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-gray-500">
                    <span>{soldShares} Sold</span>
                    <span>{availableShares} Available</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2 font-medium">
                      Quantity (Shares)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max={availableShares}
                        value={shareAmount}
                        onChange={(e) => setShareAmount(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 p-4 rounded-xl text-white font-bold text-xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        SHARES
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-gray-400">Total Cost</span>
                    <span className="text-2xl font-bold text-white">
                      $
                      {(
                        parseInt(shareAmount || "0") * sharePrice
                      ).toLocaleString()}{" "}
                      <span className="text-sm text-gray-500 font-normal">
                        USDC
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={handleBuy}
                    disabled={buying || availableShares === 0}
                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-800 rounded-xl font-bold text-lg text-white shadow-lg shadow-purple-900/30 transition-all transform hover:-translate-y-1 active:scale-95 border border-white/10"
                  >
                    {buying ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : availableShares === 0 ? (
                      "🚫 SOLD OUT"
                    ) : (
                      "🚀 Confirm Investment"
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-500">
                    Secure transaction via Solana Blockchain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
