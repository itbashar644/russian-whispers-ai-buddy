
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import ChatButton from "./ChatButton";
import ChatBubble from "./ChatBubble";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import { useAuth } from "@/context/AuthContext";
import { getMessages, sendMessage, pollForNewMessages } from "@/services/chatService";
import { toast } from "sonner";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, profile } = useAuth();

  // Периодический опрос новых сообщений
  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await getMessages();
      setMessages(msgs);
      
      // Подсчитываем непрочитанные сообщения от админа
      const newUnreadCount = msgs.filter(m => m.is_from_admin && !m.is_read).length;
      setUnreadCount(newUnreadCount);
    };

    fetchMessages();

    // Устанавливаем интервал для проверки новых сообщений
    const interval = setInterval(() => {
      if (messages.length > 0) {
        const lastMessageId = Math.max(...messages.map(m => m.id));
        pollForNewMessages(lastMessageId, (newMessages) => {
          setMessages(newMessages);
          
          // Подсчитываем новые непрочитанные сообщения
          const newUnreadCount = newMessages.filter(m => m.is_from_admin && !m.is_read).length;
          
          // Если есть новые сообщения от администратора и чат не открыт
          if (newUnreadCount > 0 && !isOpen) {
            setUnreadCount(newUnreadCount);
            toast("Новое сообщение", {
              description: "У вас новое сообщение от консультанта",
              action: {
                label: "Открыть",
                onClick: () => setIsOpen(true),
              },
            });
          } else if (isOpen) {
            // Если чат открыт, считаем что сообщения прочитаны
            setUnreadCount(0);
          }
        });
      } else {
        fetchMessages();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [messages, isOpen]);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Сброс счетчика непрочитанных сообщений при открытии чата
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    const name = profile?.name || "Гость";
    const email = profile?.email;
    
    const success = await sendMessage(message, name, email);
    
    if (success) {
      setMessage("");
      // Обновляем сообщения после отправки
      const newMessages = await getMessages();
      setMessages(newMessages);
    } else {
      toast.error("Ошибка отправки", {
        description: "Не удалось отправить сообщение. Пожалуйста, попробуйте позже."
      });
    }
    
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <ChatButton 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)} 
        unreadCount={unreadCount}
      />
      
      <div
        className={cn(
          "fixed bottom-20 right-4 z-50 w-[350px] transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        <Card className="shadow-xl">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-md pb-3 pt-3">
            <CardTitle className="text-lg">Чат с консультантом</CardTitle>
          </CardHeader>
          
          <CardContent className="p-3 max-h-[400px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-center">
                <div className="max-w-[70%] text-muted-foreground">
                  <p>Напишите нам, если у вас возникли вопросы или нужна помощь с выбором товара.</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex gap-2 p-3 pt-2 border-t">
            <Input
              placeholder="Введите сообщение..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default ChatWidget;
