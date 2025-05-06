
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface AdminAuthProps {
  children?: React.ReactNode;
  editorAccess?: boolean; // Если true, то редакторы также имеют доступ
}

export const AdminAuth = ({ children, editorAccess = false }: AdminAuthProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Проверяем роль пользователя
      const access = hasRole('admin') || (editorAccess && hasRole('editor'));
      setHasAccess(access);

      if (!isAuthenticated) {
        toast("Требуется авторизация", {
          description: "Пожалуйста, войдите в аккаунт",
        });
      } else if (!access) {
        toast("Недостаточно прав", {
          description: "У вас нет доступа к административной панели",
        });
      }

      setIsChecking(false);
    }
  }, [isLoading, isAuthenticated, hasRole, editorAccess]);

  if (isLoading || isChecking) {
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
    return <Navigate to="/admin/login" replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminAuth;
