
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, CornerRightDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, ColorVariant } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import ProductColorOptions from "./ProductColorOptions";

interface ProductCardFullProps {
  product: Product;
  currentProduct: Product;
  selectedColor?: string;
  handleColorSelect: (colorName: string, variant?: ColorVariant) => void;
  handleAddToCart: () => void;
  handleToggleWishlist: (e: React.MouseEvent) => void;
  isInWishlist: (product: Product) => boolean;
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
  const [imageError, setImageError] = useState(false);
  
  // Check if the product has model variants
  const hasVariants = product.modelName && !product.isColorVariant;

  return (
    <div className="group relative flex flex-col border rounded-lg overflow-hidden h-full transition-all hover:border-primary">
      {/* Product Image with Link */}
      <Link 
        to={`/product/${product.id}`} 
        className="aspect-[3/4] bg-background overflow-hidden relative"
      >
        {/* Product Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.isNew && (
            <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-500">Новинка</Badge>
          )}
          {product.isBestseller && (
            <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-500">Хит продаж</Badge>
          )}
        </div>
        
        {/* Wishlist Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleToggleWishlist}
        >
          <Heart 
            className={cn("h-4 w-4", isInWishlist(product) ? "fill-red-500 text-red-500" : "")} 
          />
          <span className="sr-only">Add to wishlist</span>
        </Button>
        
        {/* Product Image */}
        <img
          src={imageError ? "/placeholder.svg" : currentProduct.imageUrl}
          alt={currentProduct.title}
          className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        
        {/* Out of Stock Overlay */}
        {!currentProduct.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-medium px-3 py-1 bg-red-500 rounded-md">Нет в наличии</span>
          </div>
        )}

        {/* Variants Indicator */}
        {hasVariants && (
          <Badge 
            variant="outline" 
            className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm border-primary text-primary px-3"
          >
            <CornerRightDown className="mr-1 h-3 w-3" />
            Варианты
          </Badge>
        )}
      </Link>
      
      {/* Product Info */}
      <div className="flex flex-col space-y-3 p-3 flex-grow">
        <Link to={`/product/${product.id}`} className="flex-grow">
          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          {/* Color Options */}
          {product.colorVariants && product.colorVariants.length > 0 && (
            <ProductColorOptions
              product={product}
              selectedColor={selectedColor}
              onSelectColor={handleColorSelect}
              className="mt-2"
            />
          )}
        </Link>
        
        {/* Price */}
        <div className="flex items-baseline">
          {currentProduct.discountPrice ? (
            <>
              <span className="font-bold">{formatPrice(currentProduct.discountPrice)} ₽</span>
              <span className="text-muted-foreground line-through text-sm ml-2">
                {formatPrice(currentProduct.price)} ₽
              </span>
            </>
          ) : (
            <span className="font-bold">{formatPrice(currentProduct.price)} ₽</span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <Button 
          onClick={handleAddToCart}
          disabled={!currentProduct.inStock}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {currentProduct.inStock ? "В корзину" : "Нет в наличии"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCardFull;
