
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const YandexCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Since we're now using Supabase's OAuth, we can redirect to the general auth callback
    navigate('/auth/callback', { replace: true });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Перенаправление...</p>
      </div>
    </div>
  );
};

export default YandexCallback;
