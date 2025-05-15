
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Palette } from "lucide-react";
import { Product, ColorVariant } from "@/types/product";
import { useCart } from "@/context/CartContext";
import ColorVariantsGrid from "@/components/products/ColorVariantsGrid";

interface ProductInfoProps {
  product: Product;
  relatedColorProducts: Product[];
  selectedColorVariant: ColorVariant | null;
  onColorVariantSelect: (variant: ColorVariant) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  product, 
  relatedColorProducts,
  selectedColorVariant, 
  onColorVariantSelect 
}) => {
  const { addItem } = useCart();

  // Обработчик добавления товара в корзину
  const handleAddToCart = () => {
    addItem({
      product,
      quantity: 1,
      color: selectedColorVariant?.color,
      selectedColorVariant
    });
  };

  // Получаем текущую цену с учетом выбранного варианта и скидки
  const getCurrentPrice = () => {
    if (selectedColorVariant) {
      return selectedColorVariant.discountPrice || selectedColorVariant.price;
    }
    return product.discountPrice || product.price || 0;
  };

  // Получаем исходную цену с учетом выбранного варианта
  const getOriginalPrice = () => {
    if (selectedColorVariant) {
      return selectedColorVariant.price;
    }
    return product.price || 0;
  };

  // Проверяем наличие товара с учетом выбранного варианта
  const isInStock = () => {
    if (!product) return false;
    
    if (selectedColorVariant) {
      return selectedColorVariant.stockQuantity !== undefined && selectedColorVariant.stockQuantity > 0;
    }
    
    return product.inStock && (product.stockQuantity === undefined ? false : product.stockQuantity > 0);
  };

  // Формируем заголовок товара
  const getTitle = () => {
    if (selectedColorVariant && selectedColorVariant.color) {
      return `${product.title} (${selectedColorVariant.color})`;
    }
    
    return product.title;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{getTitle()}</h1>
      
      {/* Цена */}
      <div className="flex items-center">
        <span className="text-2xl font-bold mr-3">{getCurrentPrice()} ₽</span>
        {getCurrentPrice() !== getOriginalPrice() && (
          <span className="text-muted-foreground line-through">{getOriginalPrice()} ₽</span>
        )}
      </div>
      
      {/* Артикул */}
      {(selectedColorVariant?.articleNumber || product.articleNumber) && (
        <p className="text-sm text-muted-foreground">
          Артикул: {selectedColorVariant?.articleNumber || product.articleNumber}
        </p>
      )}
      
      {/* Статус наличия */}
      <div className={`text-sm font-medium ${isInStock() ? "text-green-600" : "text-red-500"}`}>
        {isInStock() ? "В наличии" : "Нет в наличии"}
      </div>
      
      {/* Related color variants */}
      {relatedColorProducts.length > 0 && (
        <ColorVariantsGrid 
          currentProduct={product}
          relatedProducts={relatedColorProducts}
        />
      )}
      
      {/* Цветовые варианты */}
      {product.colorVariants && product.colorVariants.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <span className="font-medium">Цвет: {selectedColorVariant?.color || product.colorVariants[0].color}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colorVariants.map((variant, index) => (
              <button
                key={index}
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                  selectedColorVariant?.color === variant.color
                    ? "bg-primary text-primary-foreground font-medium"
                    : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => onColorVariantSelect(variant)}
              >
                <span className="w-3 h-3 rounded-full" style={{ 
                  backgroundColor: variant.color.toLowerCase() !== 'белый' ? variant.color.toLowerCase() : '#ffffff',
                  border: variant.color.toLowerCase() === 'белый' ? '1px solid #ccc' : 'none' 
                }}></span>
                {variant.color}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Кнопка добавления в корзину */}
      <Button 
        size="lg" 
        className="w-full mt-6" 
        onClick={handleAddToCart}
        disabled={!isInStock()}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Добавить в корзину
      </Button>
      
      {/* Кнопки маркетплейсов */}
      {((selectedColorVariant && (selectedColorVariant.ozonUrl || selectedColorVariant.wildberriesUrl || selectedColorVariant.avitoUrl)) || 
        (!selectedColorVariant && (product.ozonUrl || product.wildberriesUrl || product.avitoUrl))) && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Купить на маркетплейсах:</p>
          <div className="flex flex-wrap gap-2">
            {(selectedColorVariant?.ozonUrl || product.ozonUrl) && (
              <a 
                href={selectedColorVariant?.ozonUrl || product.ozonUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-2 rounded-md"
              >
                <img 
                  src="/lovable-uploads/df8ec6c9-6d3f-4ec5-b65f-72e13df2ea76.png" 
                  alt="Ozon" 
                  className="w-5 h-5 object-contain" 
                />
                <span className="text-sm font-medium">Ozon</span>
              </a>
            )}
            
            {(selectedColorVariant?.wildberriesUrl || product.wildberriesUrl) && (
              <a 
                href={selectedColorVariant?.wildberriesUrl || product.wildberriesUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-2 rounded-md"
              >
                <img 
                  src="/lovable-uploads/0b04b72a-65f0-4115-9cea-5a0f215b83d4.png" 
                  alt="Wildberries" 
                  className="w-5 h-5 object-contain" 
                />
                <span className="text-sm font-medium">Wildberries</span>
              </a>
            )}
            
            {(selectedColorVariant?.avitoUrl || product.avitoUrl) && (
              <a 
                href={selectedColorVariant?.avitoUrl || product.avitoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-2 rounded-md"
              >
                <img 
                  src="/lovable-uploads/b1cb4ce9-8bc4-48a9-83c3-f578212965a7.png" 
                  alt="Avito" 
                  className="w-5 h-5 object-contain" 
                />
                <span className="text-sm font-medium">Avito</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
