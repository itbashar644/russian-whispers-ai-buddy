
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface UserAuthProps {
  children?: React.ReactNode;
  requiredRole?: "admin" | "editor" | "user";
}

const UserAuth = ({ children, requiredRole }: UserAuthProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, isLoading, profile, hasRole } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast("Требуется авторизация", {
          description: "Пожалуйста, войдите в аккаунт",
        });
      } else if (requiredRole && !hasRole(requiredRole)) {
        toast("Недостаточно прав", {
          description: "У вас нет доступа к этому разделу",
        });
      }
      setIsChecking(false);
    }
  }, [isLoading, isAuthenticated, profile, requiredRole, hasRole]);

  if (isLoading || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Проверка авторизации...</p>
          <p className="text-xs text-muted-foreground mt-1">The X Shop</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default UserAuth;
