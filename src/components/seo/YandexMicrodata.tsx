
import React from 'react';
import { Product } from "@/types/product";

interface YandexMicrodataProps {
  product: Product;
  selectedColor?: string;
  displayPrice: number;
  hasStock: boolean;
  displayArticleNumber?: string;
}

const YandexMicrodata: React.FC<YandexMicrodataProps> = ({
  product,
  selectedColor,
  displayPrice,
  hasStock,
  displayArticleNumber
}) => {
  // Создаем структурированные данные для Яндекса
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": [
      product.imageUrl,
      ...(product.additionalImages || [])
    ].filter(Boolean),
    "sku": displayArticleNumber || product.id,
    "mpn": displayArticleNumber || product.id,
    "brand": {
      "@type": "Brand",
      "name": "The X Shop"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "The X Shop"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : `https://the-x.shop/product/${product.id}`,
      "priceCurrency": "RUB",
      "price": displayPrice.toString(),
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": hasStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "The X Shop",
        "url": "https://the-x.shop"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating?.toString() || "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "47"
    }
  };

  // Хлебные крошки
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://the-x.shop"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Каталог",
        "item": "https://the-x.shop/catalog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category,
        "item": `https://the-x.shop/catalog?category=${encodeURIComponent(product.category)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.title,
        "item": typeof window !== 'undefined' ? window.location.href : `https://the-x.shop/product/${product.id}`
      }
    ]
  };

  return (
    <>
      {/* Основная микроразметка товара */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2)
        }}
      />
      
      {/* Хлебные крошки */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData, null, 2)
        }}
      />
      
      {/* Дополнительные мета-теги для Яндекса */}
      <meta name="yandex-verification" content="товар" />
      <meta property="product:price:amount" content={displayPrice.toString()} />
      <meta property="product:price:currency" content="RUB" />
      <meta property="product:availability" content={hasStock ? "in stock" : "out of stock"} />
      <meta property="product:condition" content="new" />
      <meta property="product:brand" content="The X Shop" />
      <meta property="product:retailer_item_id" content={displayArticleNumber || product.id} />
      
      {/* Open Graph для соцсетей */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={`${product.title} - The X Shop`} />
      <meta property="og:description" content={product.description} />
      <meta property="og:image" content={product.imageUrl} />
      <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : `https://the-x.shop/product/${product.id}`} />
      <meta property="product:price:amount" content={displayPrice.toString()} />
      <meta property="product:price:currency" content="RUB" />
    </>
  );
};

export default YandexMicrodata;
