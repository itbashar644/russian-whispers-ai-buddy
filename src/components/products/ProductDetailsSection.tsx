
import React from 'react';
import { Product } from "@/types/product";
import ImageGallery from "@/components/products/ImageGallery";
import ProductVideo from "@/components/products/ProductVideo";
import ProductPricing from "@/components/products/ProductPricing";
import MarketplaceLinks from "@/components/products/MarketplaceLinks";
import StockStatus from "@/components/products/StockStatus";
import ColorSelection from "@/components/products/ColorSelection";
import QuantitySelector from "@/components/products/QuantitySelector";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductDetailsSectionProps {
  product: Product;
  selectedColor?: string;
  displayPrice: number;
  hasStock: boolean;
  displayArticleNumber?: string;
  onColorChange: (color: string) => void;
  onAddToCart: () => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  product,
  selectedColor,
  displayPrice,
  hasStock,
  displayArticleNumber,
  onColorChange,
  onAddToCart,
  quantity,
  onQuantityChange
}) => {
  const selectedColorVariant = product?.colorVariants?.find(
    v => v.color === selectedColor
  );

  const getVariantImage = () => {
    if (selectedColor && product?.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.imageUrl) {
        return variant.imageUrl;
      }
    }
    return product?.imageUrl || "";
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left side - images */}
      <div itemProp="image">
        <ImageGallery 
          mainImage={getVariantImage()} 
          additionalImages={product.additionalImages} 
        />
        
        {/* Video if available */}
        {product.videoUrl && (
          <ProductVideo 
            videoUrl={product.videoUrl} 
            videoType={product.videoType} 
            imageUrl={product.imageUrl} 
          />
        )}
      </div>

      {/* Right side - product information */}
      <div className="space-y-6">
        {/* Product title and basic info */}
        <div>
          <h1 className="text-3xl font-bold mb-2" itemProp="name">{product.title}</h1>
          
          {/* Display article number if available */}
          {displayArticleNumber && (
            <div className="text-sm text-muted-foreground mb-2">
              Артикул: <span itemProp="sku">{displayArticleNumber}</span>
            </div>
          )}
        </div>
        
        {/* Add stock status indicator */}
        <StockStatus 
          product={product} 
          selectedColor={selectedColor} 
          hasStock={hasStock} 
        />
        
        {/* Pricing */}
        <ProductPricing 
          product={product} 
          selectedColorVariant={selectedColorVariant} 
        />
        
        {/* Marketplace links */}
        <MarketplaceLinks product={product} />
        
        {/* Color selection */}
        <ColorSelection 
          product={product} 
          selectedColor={selectedColor} 
          onColorChange={onColorChange} 
        />

        {/* Quantity selection */}
        <QuantitySelector 
          quantity={quantity} 
          onChange={onQuantityChange} 
          product={product} 
          selectedColorVariant={selectedColorVariant} 
        />

        {/* Add to cart button */}
        <div className="pt-4">
          <Button 
            size="lg" 
            className="w-full"
            onClick={onAddToCart}
            disabled={!hasStock}
            itemProp="offers"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {hasStock ? `Купить за ${displayPrice} ₽` : "Нет в наличии"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSection;
