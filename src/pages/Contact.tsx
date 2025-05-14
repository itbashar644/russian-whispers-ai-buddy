
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const ContactInfo = ({ 
  icon: Icon, 
  title, 
  content 
}: { 
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}) => (
  <div className="flex gap-4">
    <div className="flex items-center justify-center bg-primary/10 p-3 rounded-full h-12 w-12">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h3 className="font-medium">{title}</h3>
      <div className="text-muted-foreground">{content}</div>
    </div>
  </div>
);

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Контакты</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <ContactInfo 
                icon={MapPin} 
                title="Адрес"
                content={
                  <address className="not-italic">
                    123456, Россия, г. Москва<br />
                    ул. Примерная, д. 123
                  </address>
                }
              />
              
              <ContactInfo 
                icon={Phone} 
                title="Телефон"
                content={
                  <a href="tel:+78001234567" className="hover:text-primary">
                    8 (800) 123-45-67
                  </a>
                }
              />
              
              <ContactInfo 
                icon={Mail} 
                title="Email"
                content={
                  <a href="mailto:info@xshop.ru" className="hover:text-primary">
                    info@xshop.ru
                  </a>
                }
              />
              
              <ContactInfo 
                icon={MessageCircle} 
                title="Мессенджеры"
                content={
                  <div className="flex gap-2 items-center">
                    <a href="#" className="hover:text-primary">Telegram</a>
                    <span>•</span>
                    <a href="#" className="hover:text-primary">WhatsApp</a>
                  </div>
                }
              />
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Напишите нам</h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Ваше имя</Label>
                  <Input id="name" placeholder="Введите ваше имя" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Введите ваш email" />
                </div>
                <div>
                  <Label htmlFor="message">Сообщение</Label>
                  <Textarea id="message" placeholder="Введите ваше сообщение" rows={4} />
                </div>
                <Button type="submit" className="w-full">Отправить</Button>
              </form>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden h-[400px] bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">
              Здесь будет карта с расположением магазина
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
