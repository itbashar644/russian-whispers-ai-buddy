
import React from "react";
import { Link } from "react-router-dom";
import { Product, ColorVariant } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import ProductColorOptions from "./ProductColorOptions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProductCardFullProps {
  product: Product;
  currentProduct: Product;
  selectedColor: string | undefined;
  handleColorSelect: (colorName: string, variant?: ColorVariant) => void;
  handleAddToCart: () => void;
  handleToggleWishlist: (e: React.MouseEvent) => void;
  isInWishlist: (id: string) => boolean;
}

const ProductCardFull: React.FC<ProductCardFullProps> = ({
  product,
  currentProduct,
  selectedColor,
  handleColorSelect,
  handleAddToCart,
  handleToggleWishlist,
  isInWishlist
}) => {
  // Определяем доступность товара на основе stockQuantity
  const isAvailable = currentProduct.stockQuantity !== undefined 
    ? currentProduct.stockQuantity > 0 
    : currentProduct.inStock;
  
  return (
    <Card className={`h-full flex flex-col ${!isAvailable ? 'opacity-75' : ''}`}>
      <Link
        to={`/product/${product.id}`}
        className="block flex-grow overflow-hidden"
      >
        <div className="relative h-56 overflow-hidden">
          <img
            src={currentProduct.imageUrl || "/placeholder.svg"}
            alt={product.title}
            className={`h-full w-full object-cover transition-all hover:scale-105 ${!isAvailable ? 'grayscale-[30%]' : ''}`}
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.isNew && <Badge className="bg-blue-500">Новинка</Badge>}
            {product.isBestseller && (
              <Badge className="bg-amber-500">Хит продаж</Badge>
            )}
            {!isAvailable && (
              <Badge variant="secondary" className="bg-gray-500">Нет в наличии</Badge>
            )}
          </div>
          
          <button 
            onClick={handleToggleWishlist}
            className="absolute top-2 left-2 bg-white/80 p-1.5 rounded-full hover:bg-white transition-colors"
            aria-label={isInWishlist(product.id) ? "Удалить из избранного" : "Добавить в избранное"}
          >
            <Heart 
              className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
        </div>
      </Link>
      <CardHeader className="p-4 pb-0">
        <Link to={`/product/${product.id}`} className="block">
          <CardTitle className="line-clamp-2 text-lg">{product.title}</CardTitle>
        </Link>
        <CardDescription className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            {currentProduct.discountPrice ? (
              <>
                <span className="text-lg font-semibold whitespace-nowrap">
                  {formatPrice(currentProduct.discountPrice)}
                </span>
                <span className="text-sm line-through text-muted-foreground whitespace-nowrap">
                  {formatPrice(currentProduct.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold whitespace-nowrap">
                {formatPrice(currentProduct.price)}
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground truncate max-w-[40%] text-right">
            {product.category}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        {/* Display color options if available */}
        <ProductColorOptions 
          product={product}
          selectedColor={selectedColor}
          onColorSelect={handleColorSelect}
        />
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="w-full"
                onClick={handleAddToCart}
                disabled={!isAvailable}
                variant={!isAvailable ? "outline" : "default"}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isAvailable ? "В корзину" : "Нет в наличии"}
              </Button>
            </TooltipTrigger>
            {!isAvailable && (
              <TooltipContent>
                <p>Товара нет в наличии. Добавьте его в избранное, чтобы следить за наличием.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default ProductCardFull;
