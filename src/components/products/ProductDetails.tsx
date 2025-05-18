
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import { formatSpecificationValue, getSpecificationsForCategory } from '@/data/products/categorySpecifications';

interface ProductDetailsProps {
  product: Product;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, selectedTab, setSelectedTab }) => {
  const categorySpecs = getSpecificationsForCategory(product.category);
  
  const renderSpecifications = () => {
    if (!product.specifications || Object.keys(product.specifications).length === 0) {
      return (
        <div className="py-4 text-center text-muted-foreground">
          Характеристики отсутствуют
        </div>
      );
    }

    const specs = Object.entries(product.specifications).filter(([_, value]) => value && value.trim() !== '');
    if (specs.length === 0) {
      return (
        <div className="py-4 text-center text-muted-foreground">
          Характеристики отсутствуют
        </div>
      );
    }

    return (
      <div className="divide-y">
        {specs.map(([key, value]) => {
          // Find spec definition to get label and unit
          const specDefinition = categorySpecs.find(s => s.id === key);
          const label = specDefinition?.label || key;
          const unit = specDefinition?.unit;
          
          const displayValue = formatSpecificationValue(value, unit);
          
          return (
            <div key={key} className="grid grid-cols-2 py-2 text-sm">
              <span className="font-medium">{label}</span>
              <span>{displayValue}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-8">
      <TabsList className="w-full">
        <TabsTrigger value="description" className="flex-1">Описание</TabsTrigger>
        <TabsTrigger value="specifications" className="flex-1">Характеристики</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="mt-4">
        <div className="prose max-w-none">
          {product.description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="specifications" className="mt-4">
        <div className="space-y-2">
          {/* Рендерим спецификации */}
          {renderSpecifications()}
          
          {/* Дополнительная информация */}
          <div className="grid grid-cols-2 py-2 text-sm border-t">
            <span className="font-medium">Страна производства</span>
            <span>{product.countryOfOrigin}</span>
          </div>
          
          {product.material && (
            <div className="grid grid-cols-2 py-2 text-sm">
              <span className="font-medium">Материал</span>
              <span>{product.material}</span>
            </div>
          )}

          {product.variant && (
            <div className="grid grid-cols-2 py-2 text-sm">
              <span className="font-medium">Вариант</span>
              <span>{product.variant}</span>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProductDetails;
