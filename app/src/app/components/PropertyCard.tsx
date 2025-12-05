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
    <Link href={`/property/${publicKey.toString()}`}>
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-purple-500 hover:shadow-purple-500/20 transition duration-300 cursor-pointer h-full">
        <div className="h-48 w-full relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={account.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-purple-600 text-xs font-bold px-2 py-1 rounded text-white">
            {parseInt(shares) - parseInt(sold) > 0 ? "LIVE" : "SOLD OUT"}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-1 truncate">
            {account.name}
          </h3>
          <p className="text-gray-400 text-sm mb-4 flex items-center">
            📍 {account.location}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <p className="text-gray-500">Total Price</p>
              <p className="font-semibold text-white">
                ${parseInt(price).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Share Price</p>
              <p className="font-semibold text-purple-400">
                ${sharePrice.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Sold: {sold}</span>
              <span>Total: {shares}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <button className="w-full py-2 bg-gray-700 group-hover:bg-purple-600 text-white font-bold rounded-lg transition">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
