
import React from "react";
import { Product } from "@/types/product";

interface CatalogProductsInfoProps {
  filteredProducts: Product[];
  inStockCount: number;
  outOfStockCount: number;
}

const CatalogProductsInfo: React.FC<CatalogProductsInfoProps> = ({
  filteredProducts,
  inStockCount,
  outOfStockCount
}) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="text-sm">
        <span className="font-medium">Всего товаров:</span> {filteredProducts.length}
      </div>
      {outOfStockCount > 0 && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Нет в наличии:</span> {outOfStockCount}
        </div>
      )}
    </div>
  );
};

export default CatalogProductsInfo;
