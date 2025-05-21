
import React from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  showAsColorVariants?: boolean;
  compact?: boolean;
  hideBadges?: boolean;
  title?: string;
  showExpand?: boolean;
  limit?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  skeletonCount = 10,
  showAsColorVariants = false,
  compact = false,
  hideBadges = false,
  title,
  showExpand = false,
  limit,
}) => {
  // Apply limit if provided
  const displayProducts = limit && products.length > limit 
    ? products.slice(0, limit) 
    : products;
    
  if (loading) {
    return (
      <div className="w-full">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(skeletonCount)
            .fill(0)
            .map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
        </div>
      </div>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <div className="w-full">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <div className="text-center py-20 text-muted-foreground">
          Товары не найдены.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {showExpand && products.length > limit && (
            <Link to="/catalog" className="flex items-center text-primary hover:underline">
              Смотреть все
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            showAsColorVariant={showAsColorVariants}
            compact={compact}
            hideBadges={hideBadges}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
