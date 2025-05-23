
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
        if (variant.stockQuantity <= 3 && variant.stockQuantity > 0) {
          return `Осталось всего ${variant.stockQuantity} шт.`;
        } else if (variant.stockQuantity > 0) {
          return `В наличии: ${variant.stockQuantity} шт.`;
        } else {
          return "Нет в наличии";
        }
      }
    }
    
    // Otherwise show the main product stock
    if (product.stockQuantity !== undefined) {
      if (product.stockQuantity <= 3 && product.stockQuantity > 0) {
        return `Осталось всего ${product.stockQuantity} шт.`;
      } else if (product.stockQuantity > 0) {
        return `В наличии: ${product.stockQuantity} шт.`;
      } else {
        return "Нет в наличии";
      }
    }
    
    // Fallback to inStock flag only if stockQuantity is not defined
    return product.inStock ? "В наличии" : "Нет в наличии";
  };

  const getStockStatusClass = () => {
    if (!product) return "";
    
    if (!hasStock) {
      return "text-red-500";
    }
    
    // If there's a selected color variant, check its stock
    if (selectedColor && product.colorVariants?.length) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.stockQuantity !== undefined && variant.stockQuantity <= 3 && variant.stockQuantity > 0) {
        return "text-orange-500";
      } else if (variant?.stockQuantity !== undefined && variant.stockQuantity <= 0) {
        return "text-red-500";
      }
    } else if (product.stockQuantity !== undefined) {
      if (product.stockQuantity <= 3 && product.stockQuantity > 0) {
        return "text-orange-500";
      } else if (product.stockQuantity <= 0) {
        return "text-red-500";
      }
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
