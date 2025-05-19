
import React from 'react';
import { Product } from "@/types/product";
import ProductGrid from "./ProductGrid";

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (products.length === 0) return null;
  
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
      <ProductGrid products={products} />
    </section>
  );
};

export default RelatedProducts;
