
import React from 'react';
import { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
  selectedTab?: string;
  setSelectedTab?: React.Dispatch<React.SetStateAction<string>>;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, selectedTab, setSelectedTab }) => {
  // If no selectedTab is provided, we'll just show the description
  // This maintains backward compatibility with existing uses of the component
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-4">Описание</h2>
      <div className="prose max-w-none">
        {product.description.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
