
import React, { useState } from 'react';
import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductFilters from "@/components/admin/ProductFilters";
import ProductList from "@/components/admin/ProductList";
import ProductImportExport from "@/components/admin/ProductImportExport";
import ConfirmDialog from './ConfirmDialog';

interface ProductTabContentProps {
  products: Product[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onPermanentDelete?: (productId: string) => void;
  onImportComplete: () => Promise<void>;
  isLoading: boolean;
  mode: 'active' | 'archived';
  deleteButtonText: string;
  deleteButtonColor: string;
}

const ProductTabContent = ({
  products,
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
  onEdit,
  onDelete,
  onPermanentDelete,
  onImportComplete,
  isLoading,
  mode,
  deleteButtonText,
  deleteButtonColor
}: ProductTabContentProps) => {
  const [confirmDelete, setConfirmDelete] = useState<{isOpen: boolean, productId: string}>({
    isOpen: false,
    productId: ''
  });
  
  const [confirmPermanentDelete, setConfirmPermanentDelete] = useState<{isOpen: boolean, productId: string}>({
    isOpen: false,
    productId: ''
  });
  
  const handleDeleteClick = (productId: string) => {
    setConfirmDelete({
      isOpen: true,
      productId
    });
  };
  
  const handlePermanentDeleteClick = (productId: string) => {
    setConfirmPermanentDelete({
      isOpen: true,
      productId
    });
  };
  
  const handleDeleteConfirm = () => {
    if (confirmDelete.productId) {
      onDelete(confirmDelete.productId);
    }
    setConfirmDelete({isOpen: false, productId: ''});
  };
  
  const handlePermanentDeleteConfirm = () => {
    if (confirmPermanentDelete.productId && onPermanentDelete) {
      onPermanentDelete(confirmPermanentDelete.productId);
    }
    setConfirmPermanentDelete({isOpen: false, productId: ''});
  };

  return (
    <>
      {mode === 'active' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Импорт/Экспорт</span>
            </CardTitle>
            <CardDescription>
              Массовое управление товарами через Excel-файлы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductImportExport 
              products={products} 
              onImportComplete={onImportComplete}
            />
          </CardContent>
        </Card>
      )}

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        categoryFilter={categoryFilter}
        onCategoryChange={onCategoryChange}
        categories={categories}
      />
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ProductList
          products={products}
          onEdit={onEdit}
          onDelete={handleDeleteClick}
          deleteButtonText={deleteButtonText}
          deleteButtonColor={deleteButtonColor}
          mode={mode}
          onPermanentDelete={mode === 'archived' ? handlePermanentDeleteClick : undefined}
        />
      )}
      
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({isOpen: false, productId: ''})}
        onConfirm={handleDeleteConfirm}
        title={mode === 'active' ? "Архивировать товар" : "Восстановить товар"}
        description={
          mode === 'active' 
            ? "Вы действительно хотите переместить этот товар в архив? Товар будет скрыт от покупателей."
            : "Вы действительно хотите восстановить этот товар из архива? Товар будет виден покупателям."
        }
        confirmText={mode === 'active' ? "Архивировать" : "Восстановить"}
      />
      
      <ConfirmDialog
        isOpen={confirmPermanentDelete.isOpen}
        onClose={() => setConfirmPermanentDelete({isOpen: false, productId: ''})}
        onConfirm={handlePermanentDeleteConfirm}
        title="Удалить товар навсегда"
        description="Вы действительно хотите удалить этот товар безвозвратно? Это действие нельзя отменить."
        confirmText="Удалить навсегда"
        variant="destructive"
      />
    </>
  );
};

export default ProductTabContent;
