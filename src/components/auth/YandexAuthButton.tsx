
import { useEffect, useRef, useState } from "react";

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
  buttonId = "yandex-auth-container"
}: YandexAuthButtonProps) => {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [initFailed, setInitFailed] = useState(false);
  
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
    if (!buttonContainerRef.current || initialized.current) {
      return;
    }
    
    // Загружаем скрипт Яндекс SDK если не загружен
    const loadYandexScript = async () => {
      if (typeof window.YaAuthSuggest === "undefined") {
        console.log("Loading Yandex Auth script...");
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
          console.log("Yandex Auth script loaded successfully");
          initYandexButton();
        } catch (error) {
          console.error('Ошибка при загрузке скрипта Яндекс Авторизации:', error);
          setInitFailed(true);
          if (document.getElementById('yandex-auth-script')) {
            document.getElementById('yandex-auth-script')!.remove();
            console.info('Яндекс скрипт найден и удален');
          }
        }
      } else {
        console.log("Yandex Auth script already loaded");
        initYandexButton();
      }
    };
    
    loadYandexScript();
    
    return () => {
      initialized.current = false;
    };
  }, [buttonContainerRef.current]);
  
  // Инициализация кнопки после загрузки скрипта
  const initYandexButton = () => {
    if (!window.YaAuthSuggest || !buttonContainerRef.current) {
      console.error('Не удалось инициализировать кнопку Яндекс Авторизации');
      setInitFailed(true);
      return;
    }
    
    console.log("Initializing Yandex Auth button...");
    initialized.current = true;

    try {
      // Используем переданный client_id
      window.YaAuthSuggest.init(
        {
          client_id: 'ce0d8b75155845439152fe2694d3d330', // Обновленный client_id
          response_type: 'token',
          redirect_uri: `${window.location.origin}/auth/yandex-callback`
        },
        window.location.origin,
        {
          view: buttonView,
          parentId: buttonId,
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
          setInitFailed(true);
        });
    } catch (error) {
      console.error('Exception during YaAuthSuggest init:', error);
      setInitFailed(true);
    }
  };

  // Обработчик нажатия на кнопку для случаев, когда автоматическая инициализация не удалась
  const handleManualAuth = () => {
    // Предоставляем резервный URL для авторизации через Яндекс с обновленным client_id
    window.open(`https://oauth.yandex.ru/authorize?response_type=token&client_id=ce0d8b75155845439152fe2694d3d330&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/yandex-callback")}`, "_blank");
  };
  
  return (
    <div 
      id={buttonId} 
      ref={buttonContainerRef} 
      className={`min-h-10 flex items-center justify-center cursor-pointer rounded-md ${className}`}
      style={{ 
        minHeight: '40px', 
        border: '1px solid #e2e8f0', 
        borderRadius: '0.375rem',
        background: initFailed ? '#FFFFFF' : 'transparent' 
      }}
      onClick={initFailed ? handleManualAuth : undefined}
    >
      {initFailed && (
        <div className="flex items-center justify-center gap-2 w-full h-full px-4 py-2">
          <img 
            src="https://yastatic.net/s3/autofill/v2/_/icon.svg" 
            alt="Яндекс" 
            className="h-5 w-5"
          />
          <span className="text-sm font-medium">Войти через Яндекс</span>
        </div>
      )}
    </div>
  );
};

export default YandexAuthButton;
