
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem("cookiesAccepted");
    if (!hasAcceptedCookies) {
      // Show cookie consent after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto max-w-md px-4">
      <Card>
        <CardHeader>
          <CardTitle>Использование cookies</CardTitle>
          <CardDescription>
            Мы используем файлы cookies для улучшения работы сайта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Продолжая пользоваться сайтом, вы соглашаетесь с использованием файлов cookies. Они помогают нам улучшать 
            качество обслуживания и предоставлять персонализированный контент.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsVisible(false)}>
            Отклонить
          </Button>
          <Button onClick={acceptCookies}>
            Принять
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
