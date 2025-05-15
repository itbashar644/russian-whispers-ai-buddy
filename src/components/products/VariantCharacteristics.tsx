
import React from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariantCharacteristicsProps {
  product: Product;
  modelProducts: Product[];
  activeVariant?: string;
  onSelectVariant: (productId: string) => void;
  characteristicType: 'color' | 'variable';
}

const VariantCharacteristics: React.FC<VariantCharacteristicsProps> = ({
  product,
  modelProducts,
  activeVariant,
  onSelectVariant,
  characteristicType
}) => {
  // Skip rendering if no model products or if there's only one product
  if (!modelProducts.length || modelProducts.length <= 1) {
    return null;
  }
  
  if (characteristicType === 'color') {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Доступные цвета:</h3>
        <div className="flex flex-wrap gap-2">
          {modelProducts.map((variantProduct) => {
            const isActive = variantProduct.id === (activeVariant || product.id);
            return (
              <Button
                key={variantProduct.id}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "rounded-full min-w-[36px] h-[36px] p-1 relative",
                  isActive && "ring-2 ring-offset-2 ring-primary"
                )}
                title={variantProduct.title}
                onClick={() => onSelectVariant(variantProduct.id)}
              >
                <div 
                  className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
                  style={{ 
                    backgroundColor: variantProduct.title.toLowerCase()
                  }}
                >
                  {!isColorName(variantProduct.title) && (
                    <Palette className="h-4 w-4" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    );
  } else if (characteristicType === 'variable') {
    // Get unique characteristic name
    const characteristicName = getUniqueCharacteristicName(modelProducts);
    if (!characteristicName) return null;
    
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">{characteristicName}:</h3>
        <div className="flex flex-wrap gap-2">
          {modelProducts.map((variantProduct) => {
            const isActive = variantProduct.id === (activeVariant || product.id);
            return (
              <Button
                key={variantProduct.id}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                className={cn(
                  isActive && "ring-2 ring-offset-2 ring-primary"
                )}
                onClick={() => onSelectVariant(variantProduct.id)}
              >
                {variantProduct.variableCharacteristicValue || 'Вариант'}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }
  
  return null;
};

// Helper to check if a string is a valid CSS color or common color name
function isColorName(str: string): boolean {
  const commonColors = [
    'black', 'silver', 'gray', 'white', 'maroon', 'red', 'purple', 
    'fuchsia', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 
    'teal', 'aqua', 'orange', 'brown', 'pink', 'magenta', 'cyan'
  ];
  
  // Check if it's a common color name
  return commonColors.includes(str.toLowerCase());
}

// Helper to get characteristic name (assuming all products in model have same name)
function getUniqueCharacteristicName(products: Product[]): string | null {
  const characteristicNames = products
    .filter(p => p.variableCharacteristicName)
    .map(p => p.variableCharacteristicName);
  
  if (characteristicNames.length > 0) {
    return characteristicNames[0] || null;
  }
  
  return null;
}

export default VariantCharacteristics;
