
import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { sendMessage } from "@/services/chatService";

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
  const { profile } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Ошибка", { description: "Введите текст сообщения" });
      return;
    }
    
    setLoading(true);
    
    try {
      const userInfo = {
        name: name,
        email: email
      };
      
      const success = await sendMessage(message, userInfo);
      
      if (success) {
        toast.success("Сообщение отправлено", { 
          description: "Мы свяжемся с вами в ближайшее время" 
        });
        setMessage("");
      } else {
        toast.error("Ошибка отправки", { 
          description: "Не удалось отправить сообщение. Пожалуйста, попробуйте позже." 
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Ошибка", { 
        description: "Произошла ошибка при отправке сообщения" 
      });
    } finally {
      setLoading(false);
    }
  };

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
                
                <ContactItem icon={MessageCircle} title="Онлайн-чат">
                  <p>Воспользуйтесь онлайн-чатом на сайте</p>
                  <p className="text-sm">Консультанты отвечают в рабочее время</p>
                </ContactItem>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 bg-muted/30">
              <h2 className="text-xl font-medium mb-4">Форма обратной связи</h2>
              <p className="text-muted-foreground mb-4">
                Заполните форму, и мы свяжемся с вами в ближайшее время
              </p>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Ваше имя</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Иван Иванов" 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Электронная почта</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="ivan@example.com" 
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Сообщение</label>
                  <Textarea 
                    id="message" 
                    rows={4} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Напишите ваш вопрос или сообщение..."
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Отправляем..." : "Отправить"}
                </Button>
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
