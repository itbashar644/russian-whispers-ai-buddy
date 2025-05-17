
import React from 'react';
import { cn } from '@/lib/utils';
import { Product, ColorVariant } from '@/types/product';

export interface ProductColorOptionsProps {
  product: Product;
  selectedColor?: string;
  onSelectColor?: (colorName: string, variant?: ColorVariant) => void;
  className?: string;
}

const ProductColorOptions: React.FC<ProductColorOptionsProps> = ({
  product,
  selectedColor,
  onSelectColor,
  className
}) => {
  if (!product.colorVariants || product.colorVariants.length === 0) {
    return null;
  }

  const handleColorClick = (colorName: string, variant: ColorVariant) => {
    if (onSelectColor) {
      onSelectColor(colorName, variant);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-1 mt-2", className)}>
      {product.colorVariants.map((variant, index) => (
        <button
          key={`${variant.color}-${index}`}
          className={cn(
            "w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center",
            selectedColor === variant.color && "ring-2 ring-primary ring-offset-2"
          )}
          title={variant.color}
          type="button"
          onClick={() => handleColorClick(variant.color, variant)}
          aria-label={`Select color ${variant.color}`}
        >
          <span 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: variant.color.toLowerCase() }}
          />
        </button>
      ))}
    </div>
  );
};

export default ProductColorOptions;
