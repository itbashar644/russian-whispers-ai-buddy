
import React from 'react';
import { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
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
