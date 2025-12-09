"use client";

import { useEffect, useState } from "react";
import { useSolEstate } from "../hooks/useSolEstate";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Dashboard() {
  const { getProgram, wallet } = useSolEstate();

  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalShares: 0,
    propertyCount: 0,
  });

  useEffect(() => {
    fetchPortfolio();
  }, [wallet]);

  const fetchPortfolio = async () => {
    const program = getProgram();
    if (!wallet || !program) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // @ts-ignore
      const allInvestments = await program.account.userInvestment.all();

      const myInvestments = allInvestments.filter(
        (item: any) =>
          item.account.owner.toString() === wallet.publicKey.toString()
      );

      const detailedPortfolio = await Promise.all(
        myInvestments.map(async (inv: any) => {
          const propertyPubkey = inv.account.property;
          // @ts-ignore
          const propertyAccount = await program.account.property.fetch(
            propertyPubkey
          );

          return {
            ...inv.account,
            propertyDetails: propertyAccount,
            propertyPubkey: propertyPubkey.toString(),
          };
        })
      );

      setInvestments(detailedPortfolio);
      calculateStats(detailedPortfolio);
    } catch (error) {
      console.error("Error loading portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: any[]) => {
    let invested = 0;
    let shares = 0;

    data.forEach((item) => {
      const owned = parseInt(item.sharesOwned.toString());
      const totalPropShares = parseInt(
        item.propertyDetails.totalShares.toString()
      );
      const price = parseInt(item.propertyDetails.price.toString());
      const sharePrice = price / totalPropShares;
      invested += owned * sharePrice;
      shares += owned;
    });

    setStats({
      totalInvested: invested,
      totalShares: shares,
      propertyCount: data.length,
    });
  };
  if (!wallet) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0f0c29] to-black text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
          <div className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl">
            <h2 className="text-3xl font-bold mb-4">Wallet Not Connected</h2>
            <p className="text-gray-400 mb-6">
              Connect your wallet to track your real estate empire.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0f0c29] to-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          My Portfolio
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(34,197,94,0.3)] group">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
              Total Value Invested
            </p>
            <p className="text-4xl font-black text-green-400 group-hover:scale-105 transition-transform origin-left">
              ${stats.totalInvested.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.3)] group">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
              Total Properties
            </p>
            <p className="text-4xl font-black text-purple-400 group-hover:scale-105 transition-transform origin-left">
              {stats.propertyCount}
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.3)] group">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
              Total Shares Owned
            </p>
            <p className="text-4xl font-black text-blue-400 group-hover:scale-105 transition-transform origin-left">
              {stats.totalShares}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Your Assets{" "}
          <span className="text-sm font-normal text-gray-500 bg-white/10 px-2 py-1 rounded-full">
            {investments.length}
          </span>
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mb-4"></div>
            <p className="text-gray-400 animate-pulse">
              Loading portfolio data...
            </p>
          </div>
        ) : investments.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center backdrop-blur-sm">
            <p className="text-gray-400 mb-6 text-lg">
              You haven't invested in any properties yet.
            </p>
            <Link
              href="/"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-bold shadow-lg shadow-purple-600/30 transition-all"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {investments.map((item, idx) => (
              <div
                key={idx}
                className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.propertyDetails.imageUrl}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Prop"
                  />
                </div>

                <div className="flex-1 w-full text-center md:text-left">
                  <h3 className="font-bold text-xl text-white mb-1 group-hover:text-purple-400 transition-colors">
                    {item.propertyDetails.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    📍 {item.propertyDetails.location}
                  </p>
                </div>

                <div className="flex gap-8 text-center md:text-right w-full md:w-auto justify-center">
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">
                      Shares
                    </p>
                    <p className="font-bold text-lg text-white">
                      {item.sharesOwned.toString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">
                      Value
                    </p>
                    <p className="font-bold text-lg text-green-400">
                      $
                      {(
                        parseInt(item.sharesOwned.toString()) *
                        (parseInt(item.propertyDetails.price.toString()) /
                          parseInt(item.propertyDetails.totalShares.toString()))
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  <Link href={`/property/${item.propertyPubkey}`}>
                    <button className="w-full px-6 py-2 bg-gray-800 hover:bg-purple-600 border border-white/10 rounded-lg text-sm font-bold transition-all">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
