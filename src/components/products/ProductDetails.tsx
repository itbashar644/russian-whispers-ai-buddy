
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import ProductVariantsButton from './ProductVariantsButton';

interface ProductDetailsProps {
  product: Product;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, selectedTab, setSelectedTab }) => {
  return (
    <div className="space-y-4">
      {product.modelName && (
        <div className="mb-4">
          <ProductVariantsButton product={product} />
        </div>
      )}
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
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
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <div className="divide-y">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 py-2 text-sm">
                    <span className="font-medium">{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                Характеристики отсутствуют
              </div>
            )}
            
            {/* Дополнительная информация */}
            <div className="grid grid-cols-2 py-2 text-sm">
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
    </div>
  );
};

export default ProductDetails;
