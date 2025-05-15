
import { useState } from "react";
import { ColorVariant, Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProductColorOptionsProps {
  product: Product;
  selectedColor?: string;
  onColorSelect?: (colorName: string, variant?: ColorVariant) => void;
  className?: string;
}

const ProductColorOptions = ({ 
  product, 
  selectedColor,
  onColorSelect,
  className 
}: ProductColorOptionsProps) => {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  // If no color variants, don't render anything
  if (!product.colorVariants || product.colorVariants.length === 0) {
    return null;
  }
  
  // Get all available colors (including the main product)
  const mainProductColor = product.colors && product.colors.length > 0 ? product.colors[0] : null;
  
  // Create a map of colors to variants
  const colorVariantMap = new Map<string, ColorVariant>();
  product.colorVariants.forEach(variant => {
    colorVariantMap.set(variant.color, variant);
  });
  
  // Add main product as a color option if it has a color
  if (mainProductColor) {
    colorVariantMap.set(mainProductColor, {
      color: mainProductColor,
      price: product.price,
      discountPrice: product.discountPrice,
      imageUrl: product.imageUrl
    });
  }
  
  const allColors = Array.from(colorVariantMap.keys());
  
  const handleColorClick = (color: string) => {
    if (onColorSelect) {
      const variant = colorVariantMap.get(color);
      onColorSelect(color, variant);
    }
  };

  if (allColors.length <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-1 mt-2", className)}>
      <span className="text-sm text-muted-foreground mr-1">Цвет:</span>
      <div className="flex flex-wrap gap-1">
        {allColors.map((color) => (
          <TooltipProvider key={color} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-7 px-2 min-w-0 rounded-md border",
                    selectedColor === color && "border-primary ring-1 ring-primary",
                    !selectedColor && hoveredColor === color && "border-primary/70"
                  )}
                  onMouseEnter={() => setHoveredColor(color)}
                  onMouseLeave={() => setHoveredColor(null)}
                  onClick={() => handleColorClick(color)}
                >
                  <span className="w-4 h-4 rounded-full bg-gray-200" 
                    style={{ backgroundColor: color.toLowerCase().replace('белый', '#ffffff').replace('черный', '#000000') }} 
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{color}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default ProductColorOptions;
