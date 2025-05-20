
import React from 'react';
import { Product } from "@/types/product";
import ProductGrid from "./ProductGrid";
import { trackGoal } from '@/utils/metrika';

interface RelatedProductsProps {
  products: Product[];
  currentProductId?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, currentProductId }) => {
  // Фильтруем, чтобы не показывать текущий товар в "Похожих товарах"
  const filteredProducts = currentProductId 
    ? products.filter(product => product.id !== currentProductId)
    : products;
    
  if (filteredProducts.length === 0) return null;
  
  // Отслеживаем показ раздела "Похожие товары"
  React.useEffect(() => {
    if (filteredProducts.length > 0) {
      trackGoal('show_related_products', {
        product_ids: filteredProducts.map(p => p.id).join(','),
        count: filteredProducts.length
      });
    }
  }, [filteredProducts]);
  
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
      <ProductGrid products={filteredProducts} />
    </section>
  );
};

export default RelatedProducts;
