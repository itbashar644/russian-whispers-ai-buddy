
import React from "react";
import { Product } from "@/types/product";

interface ProductDebugInfoProps {
  products: Product[];
  showDebug?: boolean;
}

const ProductDebugInfo: React.FC<ProductDebugInfoProps> = ({ products, showDebug = false }) => {
  if (!showDebug) return null;

  const categories = [...new Set(products.map(p => p.category))];
  const categoryCount = categories.map(category => ({
    category,
    count: products.filter(p => p.category === category).length
  }));
  
  return (
    <div className="bg-gray-100 p-4 mb-4 rounded border border-gray-200">
      <h2 className="text-sm font-bold mb-2">Debug Information</h2>
      <p className="text-xs mb-2">Total products: {products.length}</p>
      
      <h3 className="text-xs font-semibold mb-1">Products per category:</h3>
      <ul className="text-xs">
        {categoryCount.map(({ category, count }) => (
          <li key={category}>{category}: {count}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDebugInfo;
