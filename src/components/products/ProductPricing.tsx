
import React from 'react';
import { Product } from "@/types/product";
import { ColorVariant } from "@/types/product";

interface ProductPricingProps {
  product: Product;
  selectedColorVariant?: ColorVariant | undefined;
}

const ProductPricing: React.FC<ProductPricingProps> = ({ product, selectedColorVariant }) => {
  // Show variant-specific pricing
  if (selectedColorVariant?.discountPrice) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{selectedColorVariant.discountPrice} ₽</span>
        <span className="text-lg text-muted-foreground line-through">
          {selectedColorVariant.price} ₽
        </span>
        <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded">
          Скидка {Math.round(((selectedColorVariant.price - selectedColorVariant.discountPrice) / selectedColorVariant.price) * 100)}%
        </span>
      </div>
    );
  } else if (selectedColorVariant) {
    return <span className="text-2xl font-bold">{selectedColorVariant.price} ₽</span>;
  } else if (product.discountPrice) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{product.discountPrice} ₽</span>
        <span className="text-lg text-muted-foreground line-through">
          {product.price} ₽
        </span>
        <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded">
          Скидка {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
        </span>
      </div>
    );
  } else {
    return <span className="text-2xl font-bold">{product.price} ₽</span>;
  }
};

export default ProductPricing;
