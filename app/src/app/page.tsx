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
    <main className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Premium Real Estate <br />
          <span className="text-purple-500">Fractional Ownership</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Invest in high-yield properties worldwide starting from $50.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Properties</h2>
          <button
            onClick={fetchProperties}
            className="text-sm text-purple-400 hover:text-white underline"
          >
            Refresh List
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">
              Loading Properties from Solana...
            </p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-xl">
            <p className="text-xl text-gray-400">No properties listed yet.</p>
            <a
              href="/admin"
              className="text-purple-500 hover:underline mt-2 inline-block"
            >
              Go to Admin Panel
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
