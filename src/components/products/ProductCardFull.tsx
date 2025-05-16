
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, ColorVariant } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface ProductCardFullProps {
  product: Product;
  currentProduct: Product;
  selectedColor?: string;
  handleColorSelect: (color: string, variant?: ColorVariant) => void;
  handleAddToCart: () => void;
  handleToggleWishlist: (e: React.MouseEvent) => void;
  isInWishlist: (productId: string) => boolean;  // Changed from (product: Product) => boolean
}

const ProductCardFull = ({
  product,
  currentProduct,
  selectedColor,
  handleColorSelect,
  handleAddToCart,
  handleToggleWishlist,
  isInWishlist
}: ProductCardFullProps) => {
  return (
    <div className="group relative flex flex-col rounded-lg border bg-white p-2">
      {/* Product badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {product.isNew && (
          <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">
            Новинка
          </Badge>
        )}
        {product.isBestseller && (
          <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">
            Хит продаж
          </Badge>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-white"
        aria-label="Добавить в избранное"
      >
        <Heart
          className={`h-4 w-4 ${
            isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
        />
      </button>

      {/* Product image */}
      <Link to={`/product/${product.id}`} className="aspect-square overflow-hidden rounded-md">
        <img
          src={currentProduct.imageUrl || "/placeholder.svg"}
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </Link>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-2">
        <Link to={`/product/${product.id}`} className="line-clamp-2 font-medium leading-tight">
          {product.title}
        </Link>
        
        <div className="mt-2 text-sm text-gray-500">{product.category}</div>

        {/* Color options */}
        {product.colorVariants && product.colorVariants.length > 0 && (
          <div className="mt-2 flex gap-1">
            {product.colorVariants.map((variant) => (
              <button
                key={variant.color}
                onClick={() => handleColorSelect(variant.color, variant)}
                className={`h-4 w-4 rounded-full border ${
                  selectedColor === variant.color ? "ring-2 ring-primary ring-offset-1" : ""
                }`}
                style={{ backgroundColor: variant.color }}
                aria-label={`Цвет ${variant.color}`}
              />
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex flex-col">
            {currentProduct.discountPrice ? (
              <>
                <span className="font-semibold">
                  {formatPrice(currentProduct.discountPrice)} ₽
                </span>
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(currentProduct.price)} ₽
                </span>
              </>
            ) : (
              <span className="font-semibold">{formatPrice(currentProduct.price)} ₽</span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            variant="outline"
            size="sm"
            disabled={!currentProduct.inStock}
          >
            {currentProduct.inStock ? "В корзину" : "Нет в наличии"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardFull;
