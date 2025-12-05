import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />


      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <h1 className="text-6xl font-extrabold mb-6">
          Invest in <span className="text-purple-500">Real Estate</span> <br />
          on the Blockchain
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl">
          Buy fractional ownership of premium properties starting from just $50 USDC.
          Earn passive income directly to your wallet.
        </p>

        <div className="flex gap-4">
          <button className="px-8 py-4 bg-purple-600 rounded-full font-bold hover:bg-purple-700 transition">
            Explore Properties
          </button>
          <button className="px-8 py-4 border border-gray-600 rounded-full font-bold hover:bg-gray-800 transition">
            How it Works
          </button>
        </div>
      </div>
    </main>
  );
}