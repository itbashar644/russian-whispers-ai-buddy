
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Message = {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
};

const Chat = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Здравствуйте! Чем могу помочь?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    
    // Simulate support response after delay
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Спасибо за ваше сообщение! Мы скоро вам ответим.",
        sender: "support",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, supportMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Чат с поддержкой</h1>
          
          <div className="border rounded-lg overflow-hidden bg-card">
            <div className="p-4 border-b bg-muted">
              <h2 className="font-medium">
                Поддержка The X Shop
              </h2>
              <p className="text-xs text-muted-foreground">
                Время работы: 09:00 - 18:00 (МСК), Пн-Пт
              </p>
            </div>
            
            <ScrollArea className="h-[400px] p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div 
                        className={`text-xs mt-1 ${
                          msg.sender === "user" 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="flex-grow"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Если у вас срочный вопрос, вы также можете связаться с нами по телефону:
              <br />
              <a href="tel:+78001234567" className="text-primary hover:underline">
                8 (800) 123-45-67
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
