"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { useSolEstate } from "./hooks/useSolEstate";
import PropertyCard from "./components/PropertyCard";

export default function Home() {
  const { getProgram } = useSolEstate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const program = getProgram();
    if (!program) return;

    try {
      setLoading(true);
      // @ts-ignore
      const data = await program.account.property.all();
      const validProperties = data.filter((item: any) => {
        return (
          item.account.name !== "" && item.account.price.toString() !== "0"
        );
      });

      console.log("Valid Properties:", validProperties);
      setProperties(validProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0f0c29] to-black text-white selection:bg-purple-500 selection:text-white">
      <Navbar />

      <section className="text-center py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight relative z-10 drop-shadow-2xl">
          Invest in <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Future Real Estate
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Own a piece of the world's most premium properties. <br />
          Verified on Solana Blockchain.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Featured Assets</h2>
            <p className="text-gray-500 text-sm mt-1">
              Live properties available for investment
            </p>
          </div>

          <button
            onClick={fetchProperties}
            className="group flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-purple-600 hover:border-purple-500 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            <span className="text-sm font-semibold text-gray-300 group-hover:text-white">
              Refresh List
            </span>
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-white transition-transform group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
            <p className="text-gray-400 animate-pulse">
              Synchronizing with Solana...
            </p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <p className="text-2xl text-gray-400 font-light mb-4">
              No properties listed currently.
            </p>
            <a
              href="/admin"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition"
            >
              Admin: List Property
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
            {properties.map((prop) => (
              <PropertyCard
                key={prop.publicKey.toString()}
                account={prop.account}
                publicKey={prop.publicKey}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
