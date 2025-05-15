import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Palette } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { getProductPrice } from "@/data/products";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardProps {
  product: Product;
  isColorVariant?: boolean;
}

const ProductCard = ({ product, isColorVariant = false }: ProductCardProps) => {
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);
  
  // If the product has color variants, use the first one by default
  const defaultColorVariant = product.colorVariants && product.colorVariants.length > 0
    ? product.colorVariants[0]
    : undefined;
  
  const handleAddToCart = () => {
    addItem({
      product,
      quantity: 1,
      color: defaultColorVariant ? defaultColorVariant.color : product.colors?.[0],
      selectedColorVariant: defaultColorVariant
    });
  };

  // Get the price range text if applicable
  const getPriceRangeText = () => {
    if (!product.colorVariants || product.colorVariants.length <= 1) {
      return null;
    }
    
    const prices = product.colorVariants.map(v => v.discountPrice || v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return `${minPrice} ₽`;
    }
    
    return `${minPrice} - ${maxPrice} ₽`;
  };

  // Определяем отображаемую цену для кнопки
  const displayPrice = product.colorVariants && product.colorVariants.length > 0
    ? (defaultColorVariant?.discountPrice || defaultColorVariant?.price)
    : (product.discountPrice || product.price);
  
  // Функция для обработки ошибок загрузки изображения
  const handleImageError = () => {
    console.error("Ошибка загрузки изображения:", product.imageUrl);
    setImageError(true);
  };

  // Проверка наличия товара - checks color variants too
  const hasStock = () => {
    if (product.colorVariants && product.colorVariants.length > 0) {
      // If we have color variants, the product is in stock if at least one variant has stock
      return product.colorVariants.some(v => v.stockQuantity !== undefined && v.stockQuantity > 0);
    }
    
    return product.inStock && (product.stockQuantity === undefined ? false : product.stockQuantity > 0);
  };

  // Get the image to display - first variant image or main product image
  const displayImage = defaultColorVariant?.imageUrl || product.imageUrl;

  const hasPriceRange = () => {
    if (!product.colorVariants || product.colorVariants.length <= 1) return false;
    
    // Find min and max prices across variants
    const prices = product.colorVariants.map(v => v.discountPrice || v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    return minPrice !== maxPrice;
  };

  // Show a color tag if this is a color variant
  const colorTag = isColorVariant && product.colorVariants && product.colorVariants.length > 0
    ? product.colorVariants[0].color
    : null;

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md relative">
      {colorTag && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs shadow-sm border">
          <Palette className="h-3 w-3" />
          <span>{colorTag}</span>
        </div>
      )}
      
      <Link to={`/product/${product.id}`} className="relative block">
        <AspectRatio ratio={1/1} className="overflow-hidden">
          {imageError ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
          ) : (
            <img 
              src={displayImage} 
              alt={product.title} 
              className="h-full w-full object-cover transition-transform hover:scale-105" 
              onError={handleImageError}
            />
          )}
        </AspectRatio>
      </Link>
      
      <CardContent className="flex-grow p-4">
        <div className="space-y-1">
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-semibold line-clamp-2 hover:underline">
              {product.title}
            </h3>
          </Link>
          
          {/* Display price or price range */}
          <div className="flex items-center gap-2">
            {hasPriceRange() ? (
              <p className="font-semibold">{getPriceRangeText()}</p>
            ) : product.discountPrice ? (
              <>
                <p className="font-semibold">{product.discountPrice} ₽</p>
                <p className="text-sm text-muted-foreground line-through">{product.price} ₽</p>
              </>
            ) : (
              <p className="font-semibold">{product.price} ₽</p>
            )}
          </div>
          
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`w-4 h-4 ${
                    i < Math.round(product.rating) ? "text-yellow-500" : "text-gray-300"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              {product.rating}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Страна: {product.countryOfOrigin}</p>
          
          {/* Add stock status indicator */}
          <div className={`text-xs font-medium ${hasStock() ? "text-green-600" : "text-red-500"}`}>
            {hasStock() ? "В наличии" : "Нет в наличии"}
          </div>
          
          {/* Display color variants count if not a color variant itself */}
          {!isColorVariant && product.colorVariants && product.colorVariants.length > 1 && (
            <div className="flex items-center gap-1 mt-1">
              <Palette className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {product.colorVariants.length} {product.colorVariants.length > 1 ? 'цвета' : 'цвет'}
              </span>
            </div>
          )}
          
          {/* Marketplace icons */}
          {(product.ozonUrl || product.wildberriesUrl || product.avitoUrl) && (
            <div className="flex items-center gap-2 mt-2">
              {product.wildberriesUrl && (
                <a 
                  href={product.wildberriesUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-6 h-6 overflow-hidden rounded-md hover:opacity-80 transition-opacity"
                  title="Открыть на Wildberries"
                >
                  <img 
                    src="/lovable-uploads/0b04b72a-65f0-4115-9cea-5a0f215b83d4.png" 
                    alt="Wildberries" 
                    className="w-full h-full object-contain" 
                  />
                </a>
              )}
              
              {product.ozonUrl && (
                <a 
                  href={product.ozonUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-6 h-6 overflow-hidden rounded-md hover:opacity-80 transition-opacity"
                  title="Открыть на Ozon"
                >
                  <img 
                    src="/lovable-uploads/df8ec6c9-6d3f-4ec5-b65f-72e13df2ea76.png" 
                    alt="Ozon" 
                    className="w-full h-full object-contain" 
                  />
                </a>
              )}
              
              {product.avitoUrl && (
                <a 
                  href={product.avitoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-6 h-6 overflow-hidden rounded-md hover:opacity-80 transition-opacity"
                  title="Открыть на Авито"
                >
                  <img 
                    src="/lovable-uploads/b1cb4ce9-8bc4-48a9-83c3-f578212965a7.png" 
                    alt="Avito" 
                    className="w-full h-full object-contain" 
                  />
                </a>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Button 
          onClick={handleAddToCart} 
          className="flex-1"
          disabled={!hasStock()}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> 
          {hasPriceRange() 
            ? `Выбрать от ${Math.min(...product.colorVariants!.map(v => v.discountPrice || v.price))} ₽` 
            : `Купить за ${displayPrice} ₽`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
