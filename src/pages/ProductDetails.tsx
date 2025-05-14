
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const ProductDetails = () => {
  const { id } = useParams();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Товар {id}</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-muted rounded-lg h-[300px] flex items-center justify-center">
              <span className="text-muted-foreground">Изображение товара</span>
            </div>
            
            <div>
              <div className="mb-4">
                <p className="text-xl font-bold mb-2">{1000 + Number(id) * 100} ₽</p>
                <p className="text-green-600 text-sm">В наличии</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <p className="text-muted-foreground">
                  Подробное описание товара {id}. Здесь будет полная информация о товаре, 
                  его характеристики, преимущества и другая полезная информация для покупателя.
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button>Добавить в корзину</Button>
                <Button variant="outline">В избранное</Button>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Характеристики</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Производитель</span>
                <span>Компания X</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Страна</span>
                <span>Китай</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Гарантия</span>
                <span>12 месяцев</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Артикул</span>
                <span>XS-{id}-2023</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
