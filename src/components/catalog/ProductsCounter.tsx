
import React from "react";

interface ProductsCounterProps {
  totalCount: number;
  outOfStockCount: number;
}

const ProductsCounter: React.FC<ProductsCounterProps> = ({
  totalCount,
  outOfStockCount
}) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="text-sm">
        <span className="font-medium">Всего товаров:</span> {totalCount}
      </div>
      {outOfStockCount > 0 && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Нет в наличии:</span> {outOfStockCount}
        </div>
      )}
    </div>
  );
};

export default ProductsCounter;
