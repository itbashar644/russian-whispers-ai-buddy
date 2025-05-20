
import React from "react";
import { Link } from "react-router-dom";
import { Product, ColorVariant } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import ProductColorOptions from "./ProductColorOptions";
import MarketplaceLinks from "./MarketplaceLinks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
        <div className="relative overflow-hidden">
          <AspectRatio ratio={1/1} className="bg-white">
            <img
              src={currentProduct.imageUrl || "/placeholder.svg"}
              alt={product.title}
              className={`w-full h-full object-contain transition-all hover:scale-105 ${!isAvailable ? 'grayscale-[30%]' : ''}`}
            />
          </AspectRatio>
          <div className="absolute top-1 right-1 flex flex-col gap-1">
            {product.isNew && <Badge className="bg-blue-500 text-xs py-0">Новинка</Badge>}
            {product.isBestseller && (
              <Badge className="bg-amber-500 text-xs py-0">Хит продаж</Badge>
            )}
            {!isAvailable && (
              <Badge variant="secondary" className="bg-gray-500 text-xs py-0">Нет в наличии</Badge>
            )}
          </div>
          
          <button 
            onClick={handleToggleWishlist}
            className="absolute top-1 left-1 bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
            aria-label={isInWishlist(product.id) ? "Удалить из избранного" : "Добавить в избранное"}
          >
            <Heart 
              className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
        </div>
      </Link>
      
      <CardHeader className="p-2 pb-0">
        <Link to={`/product/${product.id}`} className="block">
          <CardTitle className="line-clamp-2 text-sm">
            {product.title}
          </CardTitle>
        </Link>
        <CardDescription className="flex items-center justify-between mt-1">
          <div className="flex flex-col">
            {currentProduct.discountPrice ? (
              <>
                <span className="text-sm font-semibold whitespace-nowrap">
                  {formatPrice(currentProduct.discountPrice)}
                </span>
                <span className="text-xs line-through text-muted-foreground whitespace-nowrap">
                  {formatPrice(currentProduct.price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold whitespace-nowrap">
                {formatPrice(currentProduct.price)}
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground text-right">
            {product.category}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-2 pt-1 flex-grow">
        {/* Display color options if available */}
        <ProductColorOptions 
          product={product}
          selectedColor={selectedColor}
          onColorSelect={handleColorSelect}
        />

        {/* Marketplace links */}
        <MarketplaceLinks product={product} />
      </CardContent>

      <CardFooter className="p-2 pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="w-full text-xs h-8"
                onClick={handleAddToCart}
                disabled={!isAvailable}
                variant={!isAvailable ? "outline" : "default"}
                size="sm"
              >
                <ShoppingCart className="mr-1 h-3 w-3" />
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
