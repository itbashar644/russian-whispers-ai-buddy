
import { useState } from "react";
import { Apple } from "lucide-react";
import { type Provider } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import YandexAuthButton from "@/components/auth/YandexAuthButton";

interface SocialLoginProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SocialLogin = ({ isLoading, setIsLoading }: SocialLoginProps) => {
  const handleSocialLogin = async (provider: Provider) => {
    setIsLoading(true);
    try {
      let { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error(`Ошибка авторизации через ${provider}:`, error);
      setIsLoading(false);
    }
  };

  const handleYandexAuth = (token: string) => {
    console.log("Получен токен от Яндекса:", token);
    // Здесь должна быть логика для обмена токена на сессию через ваш бэкенд
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <Button 
        variant="outline" 
        onClick={() => handleSocialLogin('google')}
        disabled={isLoading}
        className="flex items-center justify-center gap-2"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
          <path d="M3.15302 7.3455L6.43851 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z" fill="#FF3D00"/>
          <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3037 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z" fill="#4CAF50"/>
          <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
        </svg>
        Войти через Google
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => handleSocialLogin('apple')}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2"
      >
        <Apple className="h-4 w-4" />
        Войти через Apple
      </Button>
      
      <YandexAuthButton 
        buttonId="yandex-login-button"
        onAuthSuccess={handleYandexAuth}
        className="w-full h-10 cursor-pointer hover:bg-gray-50 transition-colors"
      />
    </div>
  );
};

export default SocialLogin;
