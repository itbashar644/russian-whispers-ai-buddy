
import React from "react";

const ProductsLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({length: 8}).map((_, i) => (
        <div key={i} className="h-[300px] bg-gray-200 animate-pulse rounded-lg"></div>
      ))}
    </div>
  );
};

export default ProductsLoading;
