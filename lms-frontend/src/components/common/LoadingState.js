import React from 'react';

const LoadingState = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm animate-pulse h-36"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm animate-pulse h-24"></div>
        <div className="bg-white rounded-xl shadow-sm animate-pulse h-24"></div>
        <div className="bg-white rounded-xl shadow-sm animate-pulse h-24"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm animate-pulse h-96"></div>
        <div className="bg-white rounded-xl shadow-sm animate-pulse h-96"></div>
      </div>
    </div>
  );
};

export default LoadingState;