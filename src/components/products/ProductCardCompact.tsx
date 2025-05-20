
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductCardCompactProps {
  product: Product;
  currentProduct: Product;
}

const ProductCardCompact: React.FC<ProductCardCompactProps> = ({ product, currentProduct }) => {
  // Проверяем фактическое наличие на основе stockQuantity
  const isAvailable = currentProduct.stockQuantity !== undefined 
    ? currentProduct.stockQuantity > 0 
    : currentProduct.inStock;
  
  return (
    <Card className={`h-full ${!isAvailable ? 'opacity-75' : ''}`}>
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="relative overflow-hidden">
          <AspectRatio ratio={3/4} className="bg-white">
            <img
              src={currentProduct.imageUrl || "/placeholder.svg"}
              alt={product.title}
              className={`h-full w-full object-contain transition-all hover:scale-105 ${!isAvailable ? 'grayscale-[30%]' : ''}`}
            />
          </AspectRatio>
          {!isAvailable && (
            <Badge variant="outline" className="absolute top-2 left-2 bg-gray-700 text-white">
              Нет в наличии
            </Badge>
          )}
          
          {/* Marketplace badges */}
          <div className="absolute bottom-2 right-2 flex flex-row gap-1">
            {product.wildberriesUrl && (
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 text-xs">
                WB
              </Badge>
            )}
            {product.ozonUrl && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                OZON
              </Badge>
            )}
          </div>
        </div>
        <CardHeader className="p-2">
          <CardTitle className="line-clamp-1 text-sm">
            {product.title}
          </CardTitle>
          <CardDescription className="flex justify-between items-center">
            <span className="font-medium whitespace-nowrap">
              {currentProduct.discountPrice
                ? formatPrice(currentProduct.discountPrice)
                : formatPrice(currentProduct.price)}
            </span>
            {currentProduct.discountPrice && (
              <span className="text-xs line-through text-muted-foreground whitespace-nowrap">
                {formatPrice(currentProduct.price)}
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
};

export default ProductCardCompact;
