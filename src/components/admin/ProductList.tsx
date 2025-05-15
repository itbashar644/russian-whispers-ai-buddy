
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash, RefreshCcw, ArchiveX } from "lucide-react";
import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BatchOperations from "./products/BatchOperations";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  deleteButtonText?: string;
  deleteButtonColor?: "red" | "green" | "orange";
  onPermanentDelete?: (productId: string) => void;
  mode?: "active" | "archived";
  onBatchDelete?: (productIds: string[]) => void;
  onBatchMerge?: (productIds: string[]) => void;
}

const ProductList = ({ 
  products, 
  onEdit, 
  onDelete,
  deleteButtonText = "Удалить",
  deleteButtonColor = "red",
  onPermanentDelete,
  mode = "active",
  onBatchDelete,
  onBatchMerge
}: ProductListProps) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const handleSelectProduct = (productId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };
  
  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };
  
  const handleBatchDelete = () => {
    if (onBatchDelete && selectedProducts.length > 0) {
      onBatchDelete(selectedProducts);
      setSelectedProducts([]);
    }
  };
  
  const handleBatchMerge = () => {
    if (onBatchMerge && selectedProducts.length >= 2) {
      onBatchMerge(selectedProducts);
      setSelectedProducts([]);
    }
  };
  
  const getDeleteButtonClasses = () => {
    switch (deleteButtonColor) {
      case "green":
        return "text-green-500 hover:text-green-600 hover:bg-green-50";
      case "orange":
        return "text-orange-500 hover:text-orange-600 hover:bg-orange-50";
      default:
        return "text-red-500 hover:text-red-600 hover:bg-red-50";
    }
  };

  const getDeleteButtonIcon = () => {
    switch (deleteButtonColor) {
      case "green":
        return <RefreshCcw className="h-4 w-4" />;
      case "orange":
        return <ArchiveX className="h-4 w-4" />;
      default:
        return <Trash className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "active" ? "Список товаров" : "Архив товаров"}
        </CardTitle>
        <CardDescription>
          Всего товаров: {products.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === "active" && (
          <BatchOperations
            selectedCount={selectedProducts.length}
            onBatchDelete={handleBatchDelete}
            onBatchMerge={handleBatchMerge}
            disabled={!onBatchDelete || !onBatchMerge}
          />
        )}
        
        <div className="border rounded-md mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                {mode === "active" && (
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Выбрать все"
                    />
                  </TableHead>
                )}
                <TableHead>ID</TableHead>
                <TableHead>Артикул</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Модель</TableHead>
                <TableHead>Цена (₽)</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={mode === "active" ? 9 : 8} className="text-center py-4">
                    {mode === "active" ? "Товары не найдены" : "Архив пуст"}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    {mode === "active" && (
                      <TableCell>
                        <Checkbox 
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                          aria-label={`Выбрать товар ${product.title}`}
                        />
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.articleNumber || "-"}</TableCell>
                    <TableCell>
                      <div className="font-medium">{product.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                        {product.description}
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.modelName || "-"}</TableCell>
                    <TableCell>
                      {product.discountPrice ? (
                        <div>
                          <span className="font-medium">{product.discountPrice.toLocaleString()}</span>{" "}
                          <span className="text-muted-foreground line-through text-sm">
                            {product.price.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        product.price.toLocaleString()
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {product.inStock ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            В наличии
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            Нет в наличии
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            Новинка
                          </span>
                        )}
                        {mode === "archived" && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                            В архиве
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {mode === "active" && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className={getDeleteButtonClasses()}
                            >
                              {getDeleteButtonIcon()}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Вы уверены?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {mode === "active" 
                                  ? "Товар будет перемещен в архив и скрыт с сайта. Вы сможете восстановить его позже."
                                  : "Товар будет восстановлен из архива и станет снова доступен на сайте."
                                }
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(product.id)}>
                                {deleteButtonText}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                        {mode === "archived" && onPermanentDelete && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Удалить навсегда?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Товар будет удален навсегда без возможности восстановления. Это действие нельзя будет отменить.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => onPermanentDelete(product.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Удалить навсегда
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductList;
