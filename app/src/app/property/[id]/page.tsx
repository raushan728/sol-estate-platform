"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSolEstate } from "../../hooks/useSolEstate";
import Navbar from "../../components/Navbar";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { VAULT_SEED, INVESTMENT_SEED } from "../../utils/constants";

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
      <div className="text-white text-center mt-20">Loading Property...</div>
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-96 object-cover rounded-2xl shadow-2xl border border-gray-700"
          />
          <div className="mt-6 bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Property Highlights</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📍 Location: {property.location}</li>
              <li>🏠 Total Value: ${price.toLocaleString()} USDC</li>
              <li>💰 Share Price: ${sharePrice.toLocaleString()} USDC</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-2">{property.name}</h1>
          <p className="text-purple-400 text-lg mb-6">{property.location}</p>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Sold: {soldShares}</span>
              <span className="text-green-400">
                Available: {availableShares}
              </span>
            </div>
            <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Invest Now</h2>
            <div className="flex gap-4 mb-6">
              <input
                type="number"
                min="1"
                max={availableShares}
                value={shareAmount}
                onChange={(e) => setShareAmount(e.target.value)}
                className="w-1/2 bg-gray-700 p-4 rounded-lg text-white font-bold outline-none focus:ring-2 ring-purple-500"
              />
              <div className="w-1/2 bg-gray-700/50 p-4 rounded-lg text-gray-300 font-bold flex items-center justify-center border border-gray-600">
                ${(parseInt(shareAmount || "0") * sharePrice).toLocaleString()}{" "}
                USDC
              </div>
            </div>
            <button
              onClick={handleBuy}
              disabled={buying || availableShares === 0}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl font-bold text-lg transition"
            >
              {buying
                ? "Processing..."
                : availableShares === 0
                ? "SOLD OUT"
                : "Confirm Investment 🚀"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
