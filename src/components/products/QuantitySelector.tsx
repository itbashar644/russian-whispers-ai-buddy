import React from 'react';
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { ColorVariant } from "@/types/product";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (value: number) => void;
  product: Product;
  selectedColorVariant?: ColorVariant;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  onChange, 
  product, 
  selectedColorVariant 
}) => {
  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      // Check against the selected color variant's stock if applicable
      if (selectedColorVariant?.stockQuantity !== undefined && value > selectedColorVariant.stockQuantity) {
        onChange(selectedColorVariant.stockQuantity);
        return;
      }
      
      // Otherwise check against the main product stock
      if (product.stockQuantity !== undefined && value > product.stockQuantity) {
        onChange(product.stockQuantity);
      } else {
        onChange(value);
      }
    }
  };

  return (
    <div>
      <h3 className="font-medium mb-2">Количество</h3>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          -
        </Button>
        <span className="w-12 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(quantity + 1)}
          // Check against variant stock if applicable
          disabled={
            (selectedColorVariant?.stockQuantity !== undefined && 
             quantity >= selectedColorVariant.stockQuantity) ||
            (product.stockQuantity !== undefined && 
             quantity >= product.stockQuantity)
          }
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
