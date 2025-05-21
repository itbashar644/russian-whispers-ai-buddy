
import React from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  showAsColorVariants?: boolean;
  compact?: boolean;
  hideBadges?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  skeletonCount = 10,
  showAsColorVariants = false,
  compact = false,
  hideBadges = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(skeletonCount)
          .fill(0)
          .map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Товары не найдены.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          showAsColorVariant={showAsColorVariants}
          compact={compact}
          hideBadges={hideBadges}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
