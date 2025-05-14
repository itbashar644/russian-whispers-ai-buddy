
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Checkout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Оформление заказа</h1>
          
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div>
              <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4">Контактная информация</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Имя</Label>
                    <Input id="name" placeholder="Введите ваше имя" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Введите ваш email" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" placeholder="+7 (___) ___-__-__" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Адрес доставки</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Адрес</Label>
                    <Input id="address" placeholder="Введите адрес доставки" />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Город</Label>
                      <Input id="city" placeholder="Город" />
                    </div>
                    <div>
                      <Label htmlFor="state">Регион</Label>
                      <Input id="state" placeholder="Регион" />
                    </div>
                    <div>
                      <Label htmlFor="postal">Индекс</Label>
                      <Input id="postal" placeholder="Индекс" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comments">Комментарий к заказу</Label>
                    <Textarea id="comments" placeholder="Комментарий к заказу (необязательно)" />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-card p-6 rounded-lg shadow-sm sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Ваш заказ</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between pb-2 border-b">
                    <span>Товары (3)</span>
                    <span>3000 ₽</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span>Доставка</span>
                    <span>300 ₽</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Итого</span>
                    <span>3300 ₽</span>
                  </div>
                </div>
                
                <Button className="w-full">Оплатить 3300 ₽</Button>
                <div className="mt-4 text-center">
                  <Link to="/cart" className="text-sm text-primary hover:underline">
                    Вернуться в корзину
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
