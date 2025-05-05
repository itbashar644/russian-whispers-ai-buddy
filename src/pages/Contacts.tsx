
import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ContactItem = ({ 
  icon: Icon, 
  title, 
  children 
}: { 
  icon: React.ElementType; 
  title: string; 
  children: React.ReactNode 
}) => (
  <div className="flex gap-4 items-start">
    <div className="flex items-center justify-center bg-primary/10 p-3 rounded-full">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h3 className="font-medium">{title}</h3>
      <div className="text-muted-foreground">{children}</div>
    </div>
  </div>
);

const Contacts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Контакты</h1>
          
          <div className="grid gap-8 md:grid-cols-2 mb-8">
            <div className="space-y-6">
              <p className="text-lg">
                Если у вас возникли вопросы по товарам, заказам или доставке, вы можете связаться с нами удобным для вас способом:
              </p>
              
              <div className="space-y-6">
                <ContactItem icon={Phone} title="Телефон">
                  <p>+7 (800) 123-45-67</p>
                  <p className="text-sm">Ежедневно с 9:00 до 21:00 по МСК</p>
                </ContactItem>
                
                <ContactItem icon={Mail} title="Электронная почта">
                  <p>info@thexshop.ru</p>
                  <p className="text-sm">Мы отвечаем в течение 24 часов</p>
                </ContactItem>
                
                <ContactItem icon={MapPin} title="Адрес">
                  <p>г. Москва, ул. Технологическая, 10</p>
                  <p className="text-sm">Офис находится в 5 минутах ходьбы от метро "Технопарк"</p>
                </ContactItem>
                
                <ContactItem icon={Clock} title="Режим работы">
                  <p>Пн-Пт: 9:00 - 19:00</p>
                  <p>Сб-Вс: 10:00 - 17:00</p>
                </ContactItem>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 bg-muted/30">
              <h2 className="text-xl font-medium mb-4">Форма обратной связи</h2>
              <p className="text-muted-foreground mb-4">
                Заполните форму, и мы свяжемся с вами в ближайшее время
              </p>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Ваше имя</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Иван Иванов" 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Электронная почта</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="ivan@example.com" 
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Сообщение</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Напишите ваш вопрос или сообщение..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                >
                  Отправить
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contacts;
