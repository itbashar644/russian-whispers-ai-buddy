
import { useEffect, useRef } from "react";

interface YandexAuthButtonProps {
  onAuthSuccess?: (token: string) => void;
  buttonSize?: "l" | "m" | "s";
  buttonTheme?: "light" | "dark";
  buttonView?: "main" | "icon";
  className?: string;
  buttonId?: string;
}

const YandexAuthButton = ({
  onAuthSuccess,
  buttonSize = "l",
  buttonTheme = "light",
  buttonView = "main",
  className = "",
  buttonId
}: YandexAuthButtonProps) => {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  
  // Обработчик для токена Яндекс
  useEffect(() => {
    // Определяем глобальный обработчик, который будет вызван из окна обратного вызова
    window.handleYandexToken = (token: string) => {
      if (onAuthSuccess && token) {
        onAuthSuccess(token);
      }
    };
    
    // Очищаем обработчик при размонтировании
    return () => {
      // @ts-ignore
      window.handleYandexToken = undefined;
    };
  }, [onAuthSuccess]);
  
  // Инициализация кнопки входа через Яндекс
  useEffect(() => {
    // Проверяем, доступен ли Яндекс API и есть ли контейнер для кнопки
    if (
      typeof window.YaAuthSuggest === "undefined" || 
      !buttonContainerRef.current || 
      initialized.current
    ) {
      return;
    }
    
    // Загружаем скрипт Яндекс SDK
    const loadYandexScript = async () => {
      const script = document.createElement('script');
      script.src = 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js';
      script.id = 'yandex-auth-script';
      script.async = true;
      
      // Ждем загрузки скрипта
      const scriptPromise = new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
      });
      
      document.head.appendChild(script);
      
      try {
        await scriptPromise;
        initYandexButton();
      } catch (error) {
        console.error('Ошибка при загрузке скрипта Яндекс Авторизации:', error);
        if (document.getElementById('yandex-auth-script')) {
          document.getElementById('yandex-auth-script')!.remove();
          console.info('Яндекс скрипт найден и удален');
        }
      }
    };
    
    if (!document.getElementById('yandex-auth-script')) {
      loadYandexScript();
    } else {
      initYandexButton();
    }
    
    return () => {
      initialized.current = false;
    };
  }, [buttonContainerRef.current]);
  
  // Инициализация кнопки после загрузки скрипта
  const initYandexButton = () => {
    if (!window.YaAuthSuggest || !buttonContainerRef.current) {
      console.error('Не удалось инициализировать кнопку Яндекс Авторизации');
      return;
    }
    
    initialized.current = true;

    // Используем фиксированный redirect URI как указано в требованиях
    const redirectUri = "https://www.the-x.shop/auth/v1/yandex-callback";
    const originUri = window.location.origin;
    
    console.log("Yandex redirect URI:", redirectUri);
    console.log("Yandex container ID:", buttonContainerRef.current.id);
    console.log("Yandex init attempt with container:", buttonContainerRef.current);

    try {
      window.YaAuthSuggest.init(
        {
          client_id: '9bea57e906e74923bbec407783eb51b5',
          response_type: 'token',
          redirect_uri: redirectUri
        },
        originUri,
        {
          view: buttonView,
          parentId: buttonContainerRef.current.id,
          buttonView: buttonView,
          buttonTheme: buttonTheme,
          buttonSize: buttonSize,
          buttonBorderRadius: 8
        }
      )
        .then(({ handler }) => {
          console.log("Yandex auth handler created successfully");
          handler();
        })
        .catch(error => {
          console.error('Ошибка инициализации YaAuthSuggest:', error);
        });
    } catch (error) {
      console.error('Exception during YaAuthSuggest init:', error);
    }
  };
  
  return (
    <div 
      id={buttonId || "yandex-auth-container"} 
      ref={buttonContainerRef} 
      className={`min-h-10 flex items-center justify-center ${className}`}
      style={{ minHeight: '40px' }}
    ></div>
  );
};

export default YandexAuthButton;
