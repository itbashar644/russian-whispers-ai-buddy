
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

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
          toast("Успешная авторизация", {
            description: "Вы успешно вошли в систему",
          });
          navigate('/account');
        } else {
          navigate('/login');
        }
      } catch (error: any) {
        console.error("Ошибка при аутентификации:", error);
        toast("Ошибка авторизации", {
          description: error.message || "Произошла ошибка при входе в систему",
        });
        navigate('/login');
      }
    };

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
      </div>
    </div>
  );
};

export default AuthCallback;
