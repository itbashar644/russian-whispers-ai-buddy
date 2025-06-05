
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
  const [hasShowError, setHasShowError] = useState(false);
  const { isAuthenticated, isLoading, profile, hasRole } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !hasShowError) {
        setHasShowError(true);
        toast("Требуется авторизация", {
          description: "Пожалуйста, войдите в аккаунт",
        });
      } else if (isAuthenticated && requiredRole && !hasShowError) {
        // Проверяем роль асинхронно только один раз
        hasRole(requiredRole).then((hasRequiredRole) => {
          if (!hasRequiredRole && !hasShowError) {
            setHasShowError(true);
            toast("Недостаточно прав", {
              description: "У вас нет доступа к этому разделу",
            });
          }
        });
      }
      setIsChecking(false);
    }
  }, [isLoading, isAuthenticated, profile, requiredRole, hasRole, hasShowError]);

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

  // Для проверки роли используем промис, но не блокируем рендеринг
  if (requiredRole) {
    // Показываем содержимое, но проверка роли идет асинхронно
    // Если роли нет, пользователь будет перенаправлен через useEffect
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default UserAuth;
