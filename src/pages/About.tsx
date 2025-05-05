
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">О нас</h1>
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              Компания The X Shop уже более 5 лет занимается поставкой и реализацией товаров из Китая.
            </p>
            <p className="mb-4">
              Мы напрямую сотрудничаем с производителями, что позволяет предлагать нашим клиентам 
              качественные товары по доступным ценам без лишних наценок.
            </p>
            <p className="mb-4">
              За годы работы мы зарекомендовали себя как надёжный партнёр, поставляющий 
              широкий ассортимент электроники и товаров для дома.
            </p>
            <p className="mb-4">
              Наши преимущества:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Прямые поставки из Китая</li>
              <li>Оригинальная продукция с гарантией</li>
              <li>Доставка по всей России различными способами</li>
              <li>Более 5 лет успешной работы на рынке</li>
              <li>Тщательный отбор только надёжных поставщиков</li>
            </ul>
            <p>
              Если у вас остались вопросы, вы можете ознакомиться с разделом{" "}
              <Link to="/delivery" className="text-primary hover:underline">
                Доставка
              </Link>{" "}
              или посетить страницу{" "}
              <Link to="/contacts" className="text-primary hover:underline">
                Контакты
              </Link>
              , чтобы связаться с нами напрямую.
            </p>
            
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Для администраторов магазина</h3>
              <p className="mb-4">
                Если вы являетесь администратором магазина, вы можете перейти в админ-панель для управления товарами и заказами.
              </p>
              <Button asChild>
                <Link to="/admin">Перейти в админ-панель</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
