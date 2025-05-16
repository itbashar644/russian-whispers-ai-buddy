
import React from "react";
import { SearchForm } from "../SearchForm";

interface CatalogHeaderProps {
  products: any[];
  inStockCount: number;
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  products,
  inStockCount,
  searchTerm,
  handleSearchChange,
  handleSearchSubmit,
  loading
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
      <div>
        <h2 className="text-2xl font-bold">Наши товары</h2>
        <p className="text-muted-foreground">
          Всего товаров: {products.length}
          {inStockCount > 0 && products.length > 0 && (
            <span>, В наличии: {inStockCount}</span>
          )}
        </p>
      </div>
      
      <SearchForm
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
        loading={loading}
      />
    </div>
  );
};

export default CatalogHeader;
