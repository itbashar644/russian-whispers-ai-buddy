
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Обработка OAuth колбэка
    const timer = setTimeout(() => {
      navigate('/account');
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
