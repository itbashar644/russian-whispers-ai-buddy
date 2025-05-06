
import { Navigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface UserAuthProps {
  children?: React.ReactNode;
  requiredRole?: string;
}

const UserAuth = ({ children, requiredRole }: UserAuthProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated) {
        toast("Требуется авторизация", {
          description: "Пожалуйста, войдите в аккаунт",
        });
      } else if (requiredRole && user?.role !== requiredRole) {
        toast("Недостаточно прав", {
          description: "У вас нет доступа к этому разделу",
        });
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, user, requiredRole]);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default UserAuth;
