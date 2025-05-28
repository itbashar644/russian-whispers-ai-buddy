
import React from 'react';
import { Product } from "@/types/product";

interface YandexMicrodataProps {
  product: Product;
  selectedColor?: string;
  displayPrice: number;
  hasStock: boolean;
  displayArticleNumber?: string;
}

export const getYandexMetaTags = (
  product: Product,
  selectedColor?: string,
  displayPrice?: number,
  hasStock?: boolean,
  displayArticleNumber?: string
) => {
  return [
    { name: "yandex-verification", content: "товар" },
    { property: "product:price:amount", content: displayPrice?.toString() || product.price.toString() },
    { property: "product:price:currency", content: "RUB" },
    { property: "product:availability", content: hasStock ? "in stock" : "out of stock" },
    { property: "product:condition", content: "new" },
    { property: "product:brand", content: "The X Shop" },
    { property: "product:retailer_item_id", content: displayArticleNumber || product.id },
    { property: "og:type", content: "product" },
    { property: "og:title", content: `${product.title} - The X Shop` },
    { property: "og:description", content: product.description },
    { property: "og:image", content: product.imageUrl },
    { property: "og:url", content: typeof window !== 'undefined' ? window.location.href : `https://the-x.shop/product/${product.id}` },
  ];
};

const YandexMicrodata: React.FC<YandexMicrodataProps> = ({
  product,
  selectedColor,
  displayPrice,
  hasStock,
  displayArticleNumber
}) => {
  return null; // This component now only exports utility functions
};

export default YandexMicrodata;
