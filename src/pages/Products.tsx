
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Products = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Каталог товаров</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Пример товаров */}
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <div key={id} className="border rounded-lg overflow-hidden">
              <div className="aspect-ratio-16/9 bg-muted h-40"></div>
              <div className="p-4">
                <h3 className="font-medium">Товар {id}</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Краткое описание товара {id}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{1000 + id * 100} ₽</span>
                  <Link
                    to={`/products/${id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
