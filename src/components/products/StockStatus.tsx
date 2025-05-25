
import React from 'react';
import { Product } from "@/types/product";

interface StockStatusProps {
  product: Product;
  selectedColor?: string;
  hasStock: boolean;
}

const StockStatus: React.FC<StockStatusProps> = ({ product, selectedColor, hasStock }) => {
  const getStockStatusText = () => {
    if (!product) return "";
    
    // If there's a selected color variant, check its stock first
    if (selectedColor && product.colorVariants?.length) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant) {
        const variantStock = variant.stockQuantity || 0;
        return variantStock > 0 ? "В наличии" : "Нет в наличии";
      }
    }
    
    // Check main product stock quantity
    if (product.stockQuantity !== undefined) {
      return product.stockQuantity > 0 ? "В наличии" : "Нет в наличии";
    }
    
    // Fallback to hasStock prop or inStock flag
    return hasStock || product.inStock ? "В наличии" : "Нет в наличии";
  };

  const getStockStatusClass = () => {
    if (!product) return "";
    
    // If there's a selected color variant, check its stock first
    if (selectedColor && product.colorVariants?.length) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant) {
        const variantStock = variant.stockQuantity || 0;
        return variantStock > 0 ? "text-green-600" : "text-red-500";
      }
    }
    
    // Check main product stock quantity
    if (product.stockQuantity !== undefined) {
      return product.stockQuantity > 0 ? "text-green-600" : "text-red-500";
    }
    
    // Fallback to hasStock prop or inStock flag
    return hasStock || product.inStock ? "text-green-600" : "text-red-500";
  };

  return (
    <div className={`${getStockStatusClass()} font-medium text-sm mb-4`}>
      {getStockStatusText()}
    </div>
  );
};

export default StockStatus;
