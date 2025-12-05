"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center font-bold text-xl">
          S
        </div>
        <Link href="/" className="text-2xl font-bold text-white tracking-wide">
          Sol-Estate
        </Link>
      </div>

      <div className="hidden md:flex gap-8 text-gray-400 font-medium">
        <Link href="/" className="hover:text-purple-400 transition">
          Marketplace
        </Link>
        <Link href="/dashboard" className="hover:text-purple-400 transition">
          Dashboard
        </Link>
        <Link href="/admin" className="hover:text-purple-400 transition">
          Admin
        </Link>
      </div>

      <div>
        <WalletMultiButton style={{ backgroundColor: "#9333ea" }} />
      </div>
    </nav>
  );
}
