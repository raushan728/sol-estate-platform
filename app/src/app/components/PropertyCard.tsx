import React from "react";
import Link from "next/link";

interface PropertyProps {
  account: {
    name: string;
    location: string;
    imageUrl: string;
    price: any;
    totalShares: any;
    sharesSold: any;
  };
  publicKey: any;
}

const PropertyCard = ({ account, publicKey }: PropertyProps) => {
  const price = account.price ? account.price.toString() : "0";
  const shares = account.totalShares ? account.totalShares.toString() : "1";
  const sold = account.sharesSold ? account.sharesSold.toString() : "0";

  const sharePrice =
    parseInt(shares) > 0 ? parseInt(price) / parseInt(shares) : 0;
  const progress =
    parseInt(shares) > 0 ? (parseInt(sold) / parseInt(shares)) * 100 : 0;

  const imageSrc =
    account.imageUrl && account.imageUrl.length > 0
      ? account.imageUrl
      : "https://via.placeholder.com/400";

  return (
    // 3D Card Container (No Link Here)
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(147,51,234,0.5)]">
      {/* Image Section with Zoom Effect */}
      <div className="h-56 w-full relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={account.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>

        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {parseInt(shares) - parseInt(sold) > 0 ? "🟢 LIVE" : "🔴 SOLD OUT"}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 relative">
        <h3 className="text-2xl font-bold text-white mb-1 tracking-tight group-hover:text-purple-400 transition-colors">
          {account.name}
        </h3>
        <p className="text-gray-400 text-sm mb-5 flex items-center gap-1">
          📍 {account.location}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/20 rounded-xl border border-white/5">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider">
              Total Price
            </p>
            <p className="font-bold text-white text-lg">
              ${parseInt(price).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider">
              Share Price
            </p>
            <p className="font-bold text-purple-400 text-lg">
              ${sharePrice.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-300 mb-2 font-medium">
            <span>{progress.toFixed(0)}% Sold</span>
            <span>{parseInt(shares) - parseInt(sold)} Left</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.6)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <Link href={`/property/${publicKey.toString()}`} className="block">
          <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/40 transition-all active:scale-95 border border-white/10">
            View Details ➜
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
