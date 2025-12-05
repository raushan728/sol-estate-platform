import React from "react";

export default async function PropertyDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Property Details</h1>

      <div className="bg-gray-800 p-8 rounded-xl border border-purple-500 text-center">
        <p className="text-gray-400 mb-2">
          You are viewing property with Address:
        </p>
        <code className="bg-black p-3 rounded text-purple-400 block break-all">
          {id}
        </code>

        <p className="mt-6 text-sm text-gray-500">
        </p>
      </div>
    </div>
  );
}
