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
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash, RefreshCcw, ArchiveX, ArrowUpDown, PlusCircle, MinusCircle } from "lucide-react";
import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { decreaseProductStock } from "@/data/products/product/services/productStockService";
import { updateProductStockApiEndpoint } from "@/api/admin/productStockApi";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  deleteButtonText?: string;
  deleteButtonColor?: "red" | "green" | "orange";
  onPermanentDelete?: (productId: string) => void;
  mode?: "active" | "archived";
  selectedProducts?: string[];
  onSelectProduct?: (productId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
}

type SortField = "id" | "articleNumber" | "title" | "modelName" | "category" | "price" | "stockQuantity";

const ProductList = ({ 
  products, 
  onEdit, 
  onDelete,
  deleteButtonText = "Удалить",
  deleteButtonColor = "red",
  onPermanentDelete,
  mode = "active",
  selectedProducts = [],
  onSelectProduct,
  onSelectAll
}: ProductListProps) => {
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockQuantity, setStockQuantity] = useState<number>(0);

  // Sort products based on the selected field and direction
  const sortedProducts = [...products].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case "id":
        aValue = a.id;
        bValue = b.id;
        break;
      case "articleNumber":
        aValue = a.articleNumber || "";
        bValue = b.articleNumber || "";
        break;
      case "title":
        aValue = a.title;
        bValue = b.title;
        break;
      case "modelName":
        aValue = a.modelName || "";
        bValue = b.modelName || "";
        break;
      case "category":
        aValue = a.category;
        bValue = b.category;
        break;
      case "price":
        aValue = a.discountPrice || a.price;
        bValue = b.discountPrice || b.price;
        break;
      case "stockQuantity":
        aValue = a.stockQuantity || 0;
        bValue = b.stockQuantity || 0;
        break;
      default:
        aValue = a.title;
        bValue = b.title;
    }
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction if clicking on the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field === sortField) {
      return (
        <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
      );
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-300 inline" />;
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

  // Calculate if all products are selected
  const allSelected = products.length > 0 && selectedProducts?.length === products.length;
  const someSelected = selectedProducts && selectedProducts.length > 0 && selectedProducts.length < products.length;

  // Handle select all checkbox change
  const handleSelectAllChange = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  };

  // Handle individual product selection
  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (onSelectProduct) {
      onSelectProduct(productId, checked);
    }
  };

  // Start editing stock
  const startEditStock = (product: Product) => {
    setEditingStockId(product.id);
    setStockQuantity(product.stockQuantity || 0);
  };

  // Save stock updates
  const saveStockUpdate = async (product: Product) => {
    if (stockQuantity < 0) {
      toast.error("Количество товара не может быть отрицательным");
      return;
    }
    
    try {
      // Calculate difference to determine if we need to increase or decrease stock
      const difference = stockQuantity - (product.stockQuantity || 0);
      
      if (difference !== 0) {
        // Update the product's stock by difference
        if (difference < 0) {
          // Need to decrease stock
          const success = await decreaseProductStock(product.id, Math.abs(difference));
          if (!success) {
            throw new Error("Failed to update stock quantity");
          }
        } else {
          // Need to increase stock
          const response = await updateProductStockApiEndpoint(product.id, stockQuantity);
          
          if (!response.success) {
            throw new Error(response.error || "Failed to update stock quantity");
          }
        }
        
        toast.success(`Остаток товара обновлен до ${stockQuantity}`);
        
        // Update product in the list WITHOUT triggering onEdit
        // Just update the local state to reflect the new stock quantity
        product.stockQuantity = stockQuantity;
        product.inStock = stockQuantity > 0;
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Ошибка при обновлении остатка товара");
    } finally {
      setEditingStockId(null);
    }
  };

  // Cancel stock editing
  const cancelEditStock = () => {
    setEditingStockId(null);
  };

  // Handle stock change
  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setStockQuantity(isNaN(value) ? 0 : value);
  };

  // Increment/decrement stock
  const adjustStock = (increment: boolean) => {
    setStockQuantity(prev => increment ? prev + 1 : Math.max(0, prev - 1));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "active" ? "Список товаров" : "Архив товаров"}
        </CardTitle>
        <CardDescription>
          Всего товаров: {products.length}
          {selectedProducts && selectedProducts.length > 0 && (
            <span className="ml-2">| Выбрано: {selectedProducts.length}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {onSelectProduct && (
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={allSelected}
                      indeterminate={someSelected}
                      onCheckedChange={handleSelectAllChange}
                      aria-label="Выбрать все товары"
                    />
                  </TableHead>
                )}
                <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                  ID {getSortIcon("id")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("articleNumber")}>
                  Артикул {getSortIcon("articleNumber")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                  Название {getSortIcon("title")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("modelName")}>
                  Модель {getSortIcon("modelName")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                  Категория {getSortIcon("category")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
                  Цена (₽) {getSortIcon("price")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("stockQuantity")}>
                  Остаток {getSortIcon("stockQuantity")}
                </TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={onSelectProduct ? 10 : 9} className="text-center py-4">
                    {mode === "active" ? "Товары не найдены" : "Архив пуст"}
                  </TableCell>
                </TableRow>
              ) : (
                sortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    {onSelectProduct && (
                      <TableCell>
                        <Checkbox 
                          checked={selectedProducts?.includes(product.id)}
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
                    <TableCell>{product.modelName || "-"}</TableCell>
                    <TableCell>{product.category}</TableCell>
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
                      {editingStockId === product.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => adjustStock(false)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={stockQuantity}
                            onChange={handleStockChange}
                            min="0"
                            className="w-16 h-7 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => adjustStock(true)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-1 h-7"
                            onClick={() => saveStockUpdate(product)}
                          >
                            ОК
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7"
                            onClick={cancelEditStock}
                          >
                            Отмена
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-2 h-7"
                          onClick={() => startEditStock(product)}
                        >
                          {product.stockQuantity !== undefined ? product.stockQuantity : "-"}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
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
