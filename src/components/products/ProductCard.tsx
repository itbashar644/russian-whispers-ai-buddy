
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Product, ColorVariant } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCardCompact from "./ProductCardCompact";
import ProductCardFull from "./ProductCardFull";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
  isColorVariant?: boolean;
}

const ProductCard = ({ product, variant = "default", isColorVariant }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | undefined>();

  // Use current variant or main product for display
  const currentProduct = selectedVariant 
    ? { 
        ...product, 
        imageUrl: selectedVariant.imageUrl || product.imageUrl,
        price: selectedVariant.price,
        discountPrice: selectedVariant.discountPrice,
        inStock: selectedVariant.stockQuantity !== undefined ? selectedVariant.stockQuantity > 0 : product.inStock
      } 
    : product;

  const handleColorSelect = (colorName: string, variant?: ColorVariant) => {
    setSelectedColor(colorName);
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem({
        product, 
        quantity: 1, 
        color: selectedColor,
        selectedColorVariant: selectedVariant
      });
    } else {
      addItem({ product, quantity: 1, color: selectedColor });
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    toggleWishlistItem(product);
  };

  // Compact variant for smaller cards
  if (variant === "compact") {
    return (
      <ProductCardCompact 
        product={product} 
        currentProduct={currentProduct} 
      />
    );
  }

  // Default variant for regular sized cards
  return (
    <ProductCardFull
      product={product}
      currentProduct={currentProduct}
      selectedColor={selectedColor}
      handleColorSelect={handleColorSelect}
      handleAddToCart={handleAddToCart}
      handleToggleWishlist={handleToggleWishlist}
      isInWishlist={isInWishlist(product)}
    />
  );
};

export default ProductCard;
