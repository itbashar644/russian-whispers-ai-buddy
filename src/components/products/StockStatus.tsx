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
    
    if (!hasStock) {
      return "Нет в наличии";
    }
    
    // If there's a selected color variant, show its stock
    if (selectedColor && product.colorVariants?.length) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.stockQuantity !== undefined) {
        if (variant.stockQuantity <= 3) {
          return `Осталось всего ${variant.stockQuantity} шт.`;
        } else {
          return `В наличии: ${variant.stockQuantity} шт.`;
        }
      }
    }
    
    // Otherwise show the main product stock
    if (product.stockQuantity !== undefined) {
      if (product.stockQuantity <= 3) {
        return `Осталось всего ${product.stockQuantity} шт.`;
      } else {
        return `В наличии: ${product.stockQuantity} шт.`;
      }
    }
    
    return "В наличии";
  };

  const getStockStatusClass = () => {
    if (!product) return "";
    
    if (!hasStock) {
      return "text-red-500";
    }
    
    // If there's a selected color variant, check its stock
    if (selectedColor && product.colorVariants?.length) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.stockQuantity !== undefined && variant.stockQuantity <= 3) {
        return "text-orange-500";
      }
    } else if (product.stockQuantity !== undefined && product.stockQuantity <= 3) {
      return "text-orange-500";
    }
    
    return "text-green-600";
  };

  return (
    <div className={`${getStockStatusClass()} font-medium text-sm mb-4`}>
      {getStockStatusText()}
    </div>
  );
};

export default StockStatus;
