
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface YandexAuthButtonProps {
  buttonId?: string;
  className?: string;
  onSuccess?: (token: string) => void;
}

const YandexAuthButton = ({ 
  buttonId = "yandex-auth-container", 
  className = "", 
  onSuccess 
}: YandexAuthButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Yandex authentication
  const handleYandexAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'oauth',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'login:email login:info login:avatar',
          queryParams: {
            client_id: 'ce0d8b75155845439152fe2694d3d330', // Your Yandex ClientID
            response_type: 'code',
          },
          authorizationUrl: 'https://oauth.yandex.ru/authorize'
        },
      });

      if (error) {
        console.error("Ошибка при авторизации через Яндекс:", error);
        toast("Ошибка авторизации через Яндекс", {
          description: error.message,
        });
      }
      
      // Success will be handled by redirect
    } catch (error: any) {
      console.error("Ошибка авторизации через Яндекс:", error);
      toast("Ошибка авторизации через Яндекс", {
        description: error.message,
      });
    }
  };

  // Render Yandex button using their SDK
  useEffect(() => {
    // Load Yandex SDK if not already loaded
    if (!document.getElementById('yandex-auth-sdk')) {
      const script = document.createElement('script');
      script.id = 'yandex-auth-sdk';
      script.src = 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className={className}>
      <button 
        id={buttonId} 
        ref={containerRef}
        onClick={handleYandexAuth}
        className="flex items-center justify-center gap-2 h-10 w-full px-4 py-2 bg-[#fc3f1d] hover:bg-[#e0381a] text-white rounded-md transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.04297 0H21.957C23.0813 0 24 0.918719 24 2.04297V21.957C24 23.0813 23.0813 24 21.957 24H2.04297C0.918719 24 0 23.0813 0 21.957V2.04297C0 0.918719 0.918719 0 2.04297 0Z" fill="#FC3F1D"/>
          <path d="M13.8531 19.7446H16.8752V3.36415H12.8083C9.23093 3.36415 7.12109 5.39344 7.12109 8.37211C7.12109 10.4624 8.12423 11.8415 9.93528 13.1966L6.13867 19.7446H9.3717L12.7373 13.5339L11.6341 12.8003C10.1309 11.7996 9.55869 10.7989 9.55869 8.70948C9.55869 7.10723 10.7284 5.74798 12.8083 5.74798H13.8531V19.7446Z" fill="white"/>
        </svg>
        Войти через Яндекс
      </button>
    </div>
  );
};

export default YandexAuthButton;
