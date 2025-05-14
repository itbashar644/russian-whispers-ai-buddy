
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const YandexCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load the token processor script
    const script = document.createElement('script');
    script.src = 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js';
    script.async = true;
    
    script.onload = () => {
      // Check if YaSendSuggestToken is defined after script loads
      if (typeof window.YaSendSuggestToken !== 'function') {
        console.error("YaSendSuggestToken is not defined");
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Send token back to the main window
        window.YaSendSuggestToken(
          window.location.origin, 
          {
            flag: true
          }
        );
      } catch (error) {
        console.error("Ошибка при обработке токена Яндекс:", error);
        navigate('/login', { replace: true });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Выполняется вход через Яндекс...</p>
      </div>
    </div>
  );
};

export default YandexCallback;
