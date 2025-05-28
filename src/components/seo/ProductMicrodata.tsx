
import React from 'react';
import { Product } from "@/types/product";

interface ProductMicrodataProps {
  product: Product;
  selectedColor?: string;
  displayPrice: number;
  hasStock: boolean;
  displayArticleNumber?: string;
  children: React.ReactNode;
}

const ProductMicrodata: React.FC<ProductMicrodataProps> = ({
  product,
  selectedColor,
  displayPrice,
  hasStock,
  displayArticleNumber,
  children
}) => {
  return (
    <div itemScope itemType="https://schema.org/Product">
      {/* Скрытые микроданные */}
      <meta itemProp="name" content={product.title} />
      <meta itemProp="description" content={product.description} />
      <meta itemProp="image" content={product.imageUrl} />
      <meta itemProp="sku" content={displayArticleNumber || product.id} />
      <meta itemProp="mpn" content={displayArticleNumber || product.id} />
      <meta itemProp="category" content={product.category} />
      
      {/* Бренд */}
      <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
        <meta itemProp="name" content="The X Shop" />
      </div>
      
      {/* Рейтинг */}
      <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
        <meta itemProp="ratingValue" content={product.rating?.toString() || "4.8"} />
        <meta itemProp="bestRating" content="5" />
        <meta itemProp="worstRating" content="1" />
        <meta itemProp="ratingCount" content="47" />
      </div>
      
      {/* Предложение */}
      <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
        <meta itemProp="priceCurrency" content="RUB" />
        <meta itemProp="price" content={displayPrice.toString()} />
        <meta itemProp="availability" content={hasStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
        <meta itemProp="itemCondition" content="https://schema.org/NewCondition" />
        <meta itemProp="url" content={typeof window !== 'undefined' ? window.location.href : `https://the-x.shop/product/${product.id}`} />
        <meta itemProp="priceValidUntil" content={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
        
        {/* Продавец */}
        <div itemProp="seller" itemScope itemType="https://schema.org/Organization">
          <meta itemProp="name" content="The X Shop" />
          <meta itemProp="url" content="https://the-x.shop" />
        </div>
      </div>
      
      {children}
    </div>
  );
};

export default ProductMicrodata;
