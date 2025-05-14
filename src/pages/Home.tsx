
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Добро пожаловать в The X Shop!</h1>
          <p className="text-lg mb-6">
            Мы рады приветствовать вас в нашем интернет-магазине товаров из Китая.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Наши товары</h2>
              <p className="mb-4">
                У нас представлен широкий ассортимент электроники, товаров для дома 
                и многое другое по доступным ценам.
              </p>
              <Link 
                to="/products" 
                className="text-primary hover:underline font-medium"
              >
                Перейти в каталог
              </Link>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">О нас</h2>
              <p className="mb-4">
                Узнайте больше о нашей компании, истории и преимуществах 
                сотрудничества с нами.
              </p>
              <Link 
                to="/about" 
                className="text-primary hover:underline font-medium"
              >
                Подробнее
              </Link>
            </div>
          </div>
          <div className="bg-primary/5 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Доставка</h2>
            <p className="mb-4">
              Мы предлагаем различные способы доставки по всей России.
            </p>
            <Link 
              to="/delivery" 
              className="text-primary hover:underline font-medium"
            >
              Узнать о способах доставки
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
