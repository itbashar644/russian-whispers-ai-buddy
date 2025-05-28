
import React from 'react';
import { Product } from "@/types/product";
import ProductMicrodata from "@/components/seo/ProductMicrodata";
import ProductHeader from "@/components/products/ProductHeader";
import ProductDetailsSection from "@/components/products/ProductDetailsSection";
import ProductDetails from "@/components/products/ProductDetails";
import RelatedProducts from "@/components/products/RelatedProducts";

interface ProductDetailContainerProps {
  product: Product;
  relatedProducts: Product[];
  selectedColor?: string;
  displayPrice: number;
  hasStock: boolean;
  displayArticleNumber?: string;
  onColorChange: (color: string) => void;
  onAddToCart: () => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  currentProductId?: string;
}

const ProductDetailContainer: React.FC<ProductDetailContainerProps> = ({
  product,
  relatedProducts,
  selectedColor,
  displayPrice,
  hasStock,
  displayArticleNumber,
  onColorChange,
  onAddToCart,
  quantity,
  onQuantityChange,
  currentProductId
}) => {
  return (
    <>
      {/* Микроразметка товара */}
      <ProductMicrodata
        product={product}
        selectedColor={selectedColor}
        displayPrice={displayPrice}
        hasStock={hasStock}
        displayArticleNumber={displayArticleNumber}
      />
      
      <main className="flex-grow container px-4 py-8 md:px-6" itemScope itemType="https://schema.org/Product">
        <ProductHeader title={product.title} category={product.category} />

        <ProductDetailsSection
          product={product}
          selectedColor={selectedColor}
          displayPrice={displayPrice}
          hasStock={hasStock}
          displayArticleNumber={displayArticleNumber}
          onColorChange={onColorChange}
          onAddToCart={onAddToCart}
          quantity={quantity}
          onQuantityChange={onQuantityChange}
        />

        {/* Product description */}
        <div itemProp="description">
          <ProductDetails product={product} />
        </div>

        {/* Related products */}
        <RelatedProducts products={relatedProducts} currentProductId={currentProductId} />
      </main>
    </>
  );
};

export default ProductDetailContainer;
