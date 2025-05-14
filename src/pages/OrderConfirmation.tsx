
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const OrderConfirmation = () => {
  const orderNumber = "XS-" + Math.floor(100000 + Math.random() * 900000);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Заказ успешно оформлен!</h1>
          <p className="text-xl mb-2">Спасибо за ваш заказ!</p>
          <p className="text-muted-foreground mb-6">
            Номер вашего заказа: <strong>{orderNumber}</strong>
          </p>
          
          <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Детали заказа</h2>
            
            <div className="space-y-2 mb-6 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Статус заказа:</span>
                <span className="font-medium">Оплачен, в обработке</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата заказа:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Способ доставки:</span>
                <span className="font-medium">СДЭК - Курьерская доставка</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Адрес доставки:</span>
                <span className="font-medium">г. Москва, ул. Примерная, д. 123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Сумма заказа:</span>
                <span className="font-bold">3300 ₽</span>
              </div>
            </div>
            
            <div className="text-muted-foreground text-sm">
              <p>
                Информация о заказе отправлена на указанный вами email.
                Вы также можете отслеживать статус заказа в личном кабинете.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link to="/account">Перейти в личный кабинет</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Вернуться на главную</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
