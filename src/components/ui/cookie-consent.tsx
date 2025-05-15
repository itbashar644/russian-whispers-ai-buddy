
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

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
    <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto max-w-xs px-4">
      <Card className="shadow-lg">
        <CardContent className="pt-3 pb-1">
          <p className="text-xs">
            Мы используем cookies для улучшения работы сайта. <Link to="/privacy" className="text-primary underline text-xs">Подробнее</Link>
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pb-2 pt-0">
          <Button variant="outline" size="sm" onClick={() => setIsVisible(false)} className="h-7 text-xs">
            Отклонить
          </Button>
          <Button size="sm" onClick={acceptCookies} className="h-7 text-xs">
            Принять
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
