
import React from 'react';
import { ColorVariant } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductColorOptionsProps {
  product: any;
  selectedColor: string;
  handleColorSelect?: (colorName: string, variant?: ColorVariant) => void;
  className?: string;
}

const ProductColorOptions: React.FC<ProductColorOptionsProps> = ({
  product,
  selectedColor,
  handleColorSelect,
  className = ''
}) => {
  // Если нет цветов или обработчика, не показываем опции выбора цвета
  if ((!product.colors || product.colors.length === 0) && 
      (!product.colorVariants || product.colorVariants.length === 0) || 
      !handleColorSelect) {
    return null;
  }

  // Объединяем обычные цвета и цвета из вариантов
  const allColors = new Set<string>();
  
  if (product.colors && Array.isArray(product.colors)) {
    product.colors.forEach((color: string) => allColors.add(color));
  }
  
  if (product.colorVariants && Array.isArray(product.colorVariants)) {
    product.colorVariants.forEach((variant: ColorVariant) => {
      if (variant.color) allColors.add(variant.color);
    });
  }

  const uniqueColors = Array.from(allColors);

  // Если нет цветов после объединения, не показываем опции
  if (uniqueColors.length === 0) {
    return null;
  }

  const getVariantForColor = (colorName: string): ColorVariant | undefined => {
    if (!product.colorVariants) return undefined;
    return product.colorVariants.find((v: ColorVariant) => v.color === colorName);
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {uniqueColors.map((color) => (
        <button
          key={color}
          className={cn(
            "h-6 min-w-[1.5rem] px-2 border text-xs rounded", 
            selectedColor === color 
              ? "bg-primary text-primary-foreground border-primary" 
              : "bg-background border-input hover:bg-muted/50"
          )}
          onClick={() => handleColorSelect(color, getVariantForColor(color))}
          title={color}
        >
          {color}
        </button>
      ))}
    </div>
  );
};

export default ProductColorOptions;
