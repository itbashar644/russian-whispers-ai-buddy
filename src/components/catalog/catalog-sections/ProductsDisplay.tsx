
import React from "react";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/products/ProductGrid";
import { Product } from "@/types/product";

interface ProductsDisplayProps {
  products: Product[];
  loading: boolean;
  handleClearAllFilters: () => void;
  showAsList: boolean;
}

const ProductsDisplay: React.FC<ProductsDisplayProps> = ({
  products,
  loading,
  handleClearAllFilters,
  showAsList
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="relative border rounded-md overflow-hidden aspect-[3/4]"
          >
            <div className="w-full h-full bg-gray-100 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Товары не найдены</h3>
        <p className="text-muted-foreground mt-2">
          Попробуйте изменить параметры фильтрации или поискать что-то другое
        </p>
        <Button onClick={handleClearAllFilters} className="mt-4">
          Сбросить все фильтры
        </Button>
      </div>
    );
  }
  
  return <ProductGrid products={products} />;
};

export default ProductsDisplay;
