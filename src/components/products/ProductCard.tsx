
import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductCardProps {
  product: Product;
  showAsColorVariant?: boolean;
  className?: string;
  parentId?: string;
  compact?: boolean;
  hideBadges?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAsColorVariant = false,
  className,
  parentId,
  compact = false,
  hideBadges = false,
}) => {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  // Use correct property names from the Product type
  const imageUrl = product.imageUrl || "/placeholder.svg";
  const additionalImages = product.additionalImages || [];
  const firstImage = additionalImages.length > 0 ? additionalImages[0] : imageUrl;
  
  const productUrl = parentId
    ? `/product/${parentId}?color=${product.id}`
    : `/product/${product.id}`;
  
  const productName = showAsColorVariant
    ? `${product.title} - ${product.colors && product.colors.length > 0 ? product.colors[0] : "Стандартный"}`
    : product.title;

  // Calculate discount percentage if both price and discountPrice are available
  const discountPercent = product.discountPrice && product.price 
    ? Math.round(100 - (product.discountPrice / product.price * 100))
    : 0;

  // Настроим размер карточки, чтобы их было 5 в ряду
  const cardClasses = cn(
    "group h-full transition-transform hover:shadow-md overflow-hidden",
    compact ? "w-full md:w-48 lg:w-52" : "w-full",
    className
  );

  return (
    <Link to={productUrl}>
      <Card className={cardClasses}>
        <CardContent className="p-0">
          <div className="relative">
            <AspectRatio ratio={1 / 1}>
              <img
                src={firstImage}
                alt={product.title}
                className="object-cover h-full w-full transition-transform group-hover:scale-105"
                loading="lazy"
              />
            </AspectRatio>
            {!hideBadges && (
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <Badge className="bg-green-500 hover:bg-green-600">Новинка</Badge>
                )}
                {product.isBestseller && (
                  <Badge className="bg-amber-500 hover:bg-amber-600">Хит продаж</Badge>
                )}
                {product.discountPrice && discountPercent > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-600">
                    -{discountPercent}%
                  </Badge>
                )}
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
                onClick={handleWishlist}
              >
                <Heart
                  size={16}
                  fill={inWishlist ? "currentColor" : "none"}
                  className={cn(inWishlist ? "text-red-500" : "text-gray-600")}
                />
                <span className="sr-only">
                  {inWishlist ? "Удалить из избранного" : "Добавить в избранное"}
                </span>
              </Button>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm line-clamp-2 mb-1">
              {productName}
            </h3>
            <div className="flex justify-between items-baseline">
              {product.discountPrice ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <span className="font-bold text-primary text-sm">
                    {product.discountPrice} ₽
                  </span>
                  <span className="text-muted-foreground line-through text-xs">
                    {product.price} ₽
                  </span>
                </div>
              ) : (
                <span className="font-bold text-primary text-sm">{product.price} ₽</span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0">
          <Button
            size="sm"
            className="w-full text-xs h-8"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            {product.inStock ? "В корзину" : "Нет в наличии"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
