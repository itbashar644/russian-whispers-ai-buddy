
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/product";

interface ColorSelectionProps {
  product: Product;
  selectedColor?: string;
  onColorChange: (color: string) => void;
}

const ColorSelection: React.FC<ColorSelectionProps> = ({ product, selectedColor, onColorChange }) => {
  if (!product.colorVariants?.length && !product.colors?.length) {
    return null;
  }

  return (
    <div>
      <h3 className="font-medium mb-2">Цвет</h3>
      {product.colorVariants && product.colorVariants.length > 0 ? (
        <RadioGroup 
          value={selectedColor || ''} 
          onValueChange={onColorChange}
          className="flex flex-wrap gap-2"
        >
          {product.colorVariants.map((variant) => (
            <div key={variant.color} className="flex items-center">
              <RadioGroupItem 
                value={variant.color} 
                id={`color-${variant.color}`} 
                className="peer sr-only"
                disabled={variant.stockQuantity === 0}
              />
              <Label 
                htmlFor={`color-${variant.color}`}
                className={`px-3 py-1.5 border rounded-md text-sm cursor-pointer 
                  peer-data-[state=checked]:bg-primary 
                  peer-data-[state=checked]:text-primary-foreground 
                  peer-data-[state=checked]:border-primary
                  ${variant.stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {variant.color}
                {variant.price !== product.price && (
                  <span className="ml-1 text-xs">
                    ({variant.price} ₽)
                  </span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : product.colors && product.colors.length > 0 ? (
        <RadioGroup 
          value={selectedColor || ''} 
          onValueChange={onColorChange}
          className="flex flex-wrap gap-2"
        >
          {product.colors.map((color) => (
            <div key={color} className="flex items-center">
              <RadioGroupItem 
                value={color} 
                id={`color-${color}`} 
                className="peer sr-only" 
              />
              <Label 
                htmlFor={`color-${color}`}
                className="px-3 py-1.5 border rounded-md text-sm cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary"
              >
                {color}
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : null}
    </div>
  );
};

export default ColorSelection;
