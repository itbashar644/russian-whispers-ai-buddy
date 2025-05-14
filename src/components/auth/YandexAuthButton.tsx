
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface YandexAuthButtonProps {
  buttonId?: string;
  className?: string;
  onSuccess?: (token: string) => void;
}

declare global {
  interface Window {
    YaAuthSuggest?: any;
    handleYandexToken?: (token: string) => void;
  }
}

const YandexAuthButton = ({ 
  buttonId = "yandex-auth-container", 
  className = "", 
  onSuccess 
}: YandexAuthButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Load Yandex SDK if not already loaded
    if (!document.getElementById('yandex-auth-sdk')) {
      const script = document.createElement('script');
      script.id = 'yandex-auth-sdk';
      script.src = 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js';
      script.async = true;
      script.onload = initYandexAuth;
      document.head.appendChild(script);
    } else if (window.YaAuthSuggest && !initialized.current) {
      initYandexAuth();
    }

    // Define global handler for the token
    window.handleYandexToken = async (token) => {
      try {
        if (token) {
          // Exchange Yandex token for Supabase session
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'yandex',
            token,
          });

          if (error) throw error;

          toast("Успешная авторизация через Яндекс");
          
          if (onSuccess) {
            onSuccess(token);
          }
          
          // Redirect to account page
          window.location.href = '/account';
        }
      } catch (error: any) {
        console.error("Ошибка авторизации через Яндекс:", error);
        toast("Ошибка при авторизации через Яндекс", {
          description: error.message,
        });
      }
    };

    return () => {
      // Cleanup
      window.handleYandexToken = undefined;
    };
  }, [onSuccess]);

  const initYandexAuth = () => {
    if (!window.YaAuthSuggest || !containerRef.current || initialized.current) return;

    initialized.current = true;

    // Используем window.location.origin для создания правильного redirect_uri
    const redirectUri = `${window.location.origin}/auth/yandex-callback`;
    const originUri = window.location.origin;
    
    console.log("Yandex redirect URI:", redirectUri);

    window.YaAuthSuggest.init(
      {
        client_id: 'ce0d8b75155845439152fe2694d3d330', // Ваш client_id
        response_type: 'token',
        redirect_uri: redirectUri
      },
      originUri,
      {
        view: 'button',
        parentId: buttonId,
        buttonView: 'main',
        buttonTheme: 'light',
        buttonSize: 'm',
        buttonBorderRadius: 4
      }
    )
    .then((result: any) => {
      return result.handler();
    })
    .catch((error: any) => {
      console.error("Ошибка инициализации Яндекс авторизации:", error);
      toast("Ошибка инициализации авторизации через Яндекс", {
        description: error.message,
      });
    });
  };

  return (
    <div className={className}>
      <div id={buttonId} ref={containerRef}></div>
    </div>
  );
};

export default YandexAuthButton;
