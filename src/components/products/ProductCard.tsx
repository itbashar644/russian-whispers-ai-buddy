
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);
  
  const handleAddToCart = () => {
    addItem({
      product,
      quantity: 1,
      color: product.colors ? product.colors[0] : undefined
    });
  };

  // Определяем отображаемую цену для кнопки
  const displayPrice = product.discountPrice || product.price;
  
  // Функция для обработки ошибок загрузки изображения
  const handleImageError = () => {
    console.error("Ошибка загрузки изображения:", product.imageUrl);
    setImageError(true);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md relative">
      {!product.inStock && (
        <div className="absolute top-0 right-0 left-0 bg-red-500 text-white text-center text-xs py-1 px-2 z-10">
          Нет в наличии
        </div>
      )}
      <Link to={`/product/${product.id}`} className="aspect-square overflow-hidden">
        <img 
          src={imageError ? "/placeholder.svg" : product.imageUrl} 
          alt={product.title} 
          className="h-full w-full object-cover transition-transform hover:scale-105" 
          onError={handleImageError}
        />
      </Link>
      <CardContent className="flex-grow p-4">
        <div className="space-y-1">
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-semibold line-clamp-2 hover:underline">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            {product.discountPrice ? (
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
          
          {/* Stock information */}
          {product.stockQuantity !== undefined && product.stockQuantity > 0 && (
            <p className="text-xs text-green-600">
              В наличии: {product.stockQuantity} шт.
            </p>
          )}
          
          {/* Colors display if available */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Цвета:</span>
              <div className="flex gap-1">
                {product.colors.map((color) => (
                  <span key={color} className="text-xs">{color}</span>
                ))}
              </div>
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
          disabled={!product.inStock}
          variant={product.inStock ? "default" : "outline"}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> 
          {product.inStock 
            ? `Купить за ${displayPrice} ₽` 
            : "Нет в наличии"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
