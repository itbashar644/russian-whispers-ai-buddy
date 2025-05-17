
import React from "react";
import { Product, ColorVariant } from "@/types/product";

export interface ProductColorOptionsProps {
  product: Product;
  selectedColor?: string;
  handleColorSelect: (colorName: string, variant?: ColorVariant) => void;
  className?: string;
}

const ProductColorOptions: React.FC<ProductColorOptionsProps> = ({
  product,
  selectedColor,
  handleColorSelect,
  className = ""
}) => {
  if (!product.colorVariants || product.colorVariants.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {product.colorVariants.map((variant) => (
        <button
          key={variant.color}
          className={`w-6 h-6 rounded-full border-2 ${
            selectedColor === variant.color ? "ring-2 ring-primary ring-offset-2" : "border-gray-200"
          }`}
          style={{ backgroundColor: variant.color }}
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation
            handleColorSelect(variant.color, variant);
          }}
          aria-label={`Выбрать цвет ${variant.color}`}
          title={variant.color}
        />
      ))}
    </div>
  );
};

export default ProductColorOptions;
