
// This component doesn't exist in the provided code snippets, so I'll create it properly
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductCardCompactProps {
  product: Product;
  currentProduct: Product;
}

const ProductCardCompact = ({ product, currentProduct }: ProductCardCompactProps) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex items-center gap-3 rounded-lg border bg-white p-2 no-underline transition-colors hover:bg-gray-50"
    >
      {/* Product badges */}
      <div className="absolute left-0 top-0 z-10">
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

      {/* Product image */}
      <div className="h-16 w-16 overflow-hidden rounded-md">
        <img
          src={currentProduct.imageUrl || "/placeholder.svg"}
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col">
        <h3 className="line-clamp-1 text-sm font-medium">{product.title}</h3>
        <div className="text-xs text-gray-500">{product.category}</div>
        
        <div className="mt-1 flex items-center justify-between">
          {currentProduct.discountPrice ? (
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold">
                {formatPrice(currentProduct.discountPrice)} ₽
              </span>
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(currentProduct.price)} ₽
              </span>
            </div>
          ) : (
            <span className="text-sm font-semibold">
              {formatPrice(currentProduct.price)} ₽
            </span>
          )}
          
          {!currentProduct.inStock && (
            <span className="text-xs text-red-500">Нет в наличии</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCardCompact;
