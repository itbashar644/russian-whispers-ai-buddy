
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  title?: string;
  showAsColorVariants?: boolean;
  limit?: number;
  showExpand?: boolean;
}

const ProductGrid = ({ 
  products, 
  title, 
  showAsColorVariants = false, 
  limit,
  showExpand = false
}: ProductGridProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const displayProducts = useMemo(() => {
    if (!limit || expanded) {
      return products;
    }
    return products.slice(0, limit);
  }, [products, limit, expanded]);
  
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Нет товаров</h2>
        <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isColorVariant={showAsColorVariants && !!product.isColorVariant}
          />
        ))}
      </div>
      
      {showExpand && limit && products.length > limit && (
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1"
          >
            {expanded ? (
              <>
                Показать меньше <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Показать все {products.length} товаров <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
