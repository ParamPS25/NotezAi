import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;