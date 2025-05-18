
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { sendMessage } from "@/services/chatService";

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
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Обратная связь</h1>
          
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
      </main>
      <Footer />
    </div>
  );
};

export default Contacts;
