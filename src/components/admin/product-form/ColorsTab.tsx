
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Link as LinkIcon } from "lucide-react";
import { Product, ColorVariant } from "@/types/product";
import ColorVariantManager from "@/components/admin/ColorVariantManager";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getActiveProducts, linkProductsByColor } from "@/data/products/product/productServiceSpecialized";
import { Badge } from "@/components/ui/badge";
import { getProductById } from "@/data/products";
import { toast } from "sonner";

interface ColorsTabProps {
  formData: Partial<Product>;
  handleColorVariantsChange: (variants: ColorVariant[]) => void;
  handleRemoveColor: (colorToRemove: string) => void;
  handleRelatedColorProductsChange?: (productIds: string[]) => void;
}

const ColorsTab = ({
  formData,
  handleColorVariantsChange,
  handleRemoveColor,
  handleRelatedColorProductsChange
}: ColorsTabProps) => {
  const [newColor, setNewColor] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Load available products for color linking
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getActiveProducts();
        // Filter out current product and already linked products
        const filteredProducts = allProducts.filter(p => 
          p.id !== formData.id && 
          !formData.relatedColorProducts?.includes(p.id)
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Ошибка загрузки продуктов:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [formData.id, formData.relatedColorProducts]);

  // Load already related products
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!formData.relatedColorProducts || formData.relatedColorProducts.length === 0) {
        setRelatedProducts([]);
        return;
      }
      
      try {
        const relatedProductsData = await Promise.all(
          formData.relatedColorProducts.map(id => getProductById(id))
        );
        
        setRelatedProducts(relatedProductsData.filter(p => p) as Product[]);
      } catch (error) {
        console.error("Ошибка загрузки связанных продуктов:", error);
      }
    };
    
    loadRelatedProducts();
  }, [formData.relatedColorProducts]);

  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors?.includes(newColor.trim())) {
      const updatedColors = [...(formData.colors || []), newColor.trim()];
      // Here we should update the form data, but we're using handleRemoveColor for now
      // which is a bit confusing. Consider renaming it or adding a proper handler
      handleRemoveColor(newColor.trim());
      setNewColor("");
    }
  };

  const handleAddRelatedProduct = async () => {
    if (!selectedProductId) return;
    
    const newRelatedProducts = [...(formData.relatedColorProducts || []), selectedProductId];
    
    if (handleRelatedColorProductsChange) {
      handleRelatedColorProductsChange(newRelatedProducts);
    } else {
      // If no handler is provided, update formData directly (not ideal)
      formData.relatedColorProducts = newRelatedProducts;
    }
    
    // Reset selection
    setSelectedProductId("");
  };

  const handleRemoveRelatedProduct = (productId: string) => {
    const updatedRelatedProducts = (formData.relatedColorProducts || []).filter(id => id !== productId);
    
    if (handleRelatedColorProductsChange) {
      handleRelatedColorProductsChange(updatedRelatedProducts);
    } else {
      // If no handler is provided, update formData directly (not ideal)
      formData.relatedColorProducts = updatedRelatedProducts;
    }
  };

  const handleLinkProducts = async () => {
    if (!formData.id || !formData.relatedColorProducts || formData.relatedColorProducts.length === 0) {
      return;
    }
    
    try {
      setLoading(true);
      const productIds = [formData.id, ...formData.relatedColorProducts];
      const success = await linkProductsByColor(productIds);
      
      if (success) {
        toast.success("Продукты успешно связаны по цвету");
      } else {
        toast.error("Не удалось связать продукты");
      }
    } catch (error) {
      console.error("Ошибка при связывании продуктов:", error);
      toast.error("Ошибка при связывании продуктов");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Color Variants Management */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Управление цветовыми вариантами</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Здесь вы можете добавить варианты товара с разными цветами. Для каждого цвета можно указать свою цену, артикул и количество на складе.
        </p>
        
        <ColorVariantManager
          colorVariants={formData.colorVariants || []}
          onChange={handleColorVariantsChange}
          basePrice={formData.price || 0}
        />
      </div>
      
      {/* Related Color Products */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Связанные цветовые варианты (отдельные товары)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Здесь вы можете связать этот товар с другими товарами, которые являются его цветовыми вариантами. На странице товара будут показаны все доступные цвета.
        </p>
        
        <div className="space-y-4">
          {/* Select product to link */}
          <div className="flex gap-2">
            <Select 
              value={selectedProductId}
              onValueChange={setSelectedProductId}
              disabled={loading}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Выберите товар для связывания" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Доступные товары</SelectLabel>
                  {products.length === 0 && (
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      Нет доступных товаров для связывания
                    </div>
                  )}
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              onClick={handleAddRelatedProduct}
              variant="secondary"
              disabled={!selectedProductId || loading}
            >
              Добавить
            </Button>
          </div>
          
          {/* Display related products */}
          {relatedProducts.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Связанные товары:</h4>
              <div className="space-y-2">
                {relatedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between bg-background p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 overflow-hidden rounded-md">
                        <img 
                          src={product.imageUrl} 
                          alt={product.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.title}</p>
                        <div className="flex items-center gap-1">
                          {product.colorVariants && product.colorVariants.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {product.colorVariants[0].color}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRelatedProduct(product.id)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {formData.id && (
                <Button 
                  type="button" 
                  onClick={handleLinkProducts}
                  className="mt-4"
                  disabled={loading || relatedProducts.length === 0}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Применить связи
                </Button>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                Для сохранения связей между товарами нажмите кнопку "Применить связи" после добавления всех связанных товаров.
                Эта операция изменит данные в базе данных немедленно.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Legacy Colors - Simple list */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Список доступных цветов (устаревший)</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Простой список доступных цветов для совместимости. Рекомендуем использовать цветовые варианты выше.
        </p>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Название цвета"
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={handleAddColor}
              variant="secondary"
            >
              Добавить
            </Button>
          </div>
          
          {formData.colors && formData.colors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.colors.map((color) => (
                <div 
                  key={color}
                  className="flex items-center bg-muted rounded-md px-3 py-1 text-sm"
                >
                  <span>{color}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 text-muted-foreground hover:text-foreground"
                    onClick={() => handleRemoveColor(color)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorsTab;
