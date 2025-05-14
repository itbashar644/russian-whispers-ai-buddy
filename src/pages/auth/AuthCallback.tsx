
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем хэш URL для обработки OAuth колбэка
    const handleOAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          throw error;
        }
        
        if (data.user) {
          toast({
            title: "Успешная авторизация",
            description: "Вы успешно вошли в систему",
          });
          navigate('/account');
        } else {
          navigate('/login');
        }
      } catch (error: any) {
        console.error("Ошибка при аутентификации:", error);
        toast({
          title: "Ошибка авторизации",
          description: error.message || "Произошла ошибка при входе в систему",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    // Обрабатываем OAuth колбэк после небольшой задержки
    // для полной загрузки состояния аутентификации
    const timer = setTimeout(() => {
      handleOAuthCallback();
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Авторизация...</p>
        <p className="text-sm text-muted-foreground mt-2">The X Shop</p>
      </div>
    </div>
  );
};

export default AuthCallback;
