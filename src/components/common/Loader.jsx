import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-orange-400 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};
export const MiniLoader = () => {
  return (
    <div className="relative w-20 h-20 mx-auto mb-4">
      <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
  );
};

export default Loader;
