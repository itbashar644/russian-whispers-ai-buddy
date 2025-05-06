
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

interface AdminAuthProps {
  children?: React.ReactNode;
}

interface AdminAuthState {
  isAdmin: boolean;
  username: string;
}

export const AdminAuth = ({ children }: AdminAuthProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth");
      if (adminAuth) {
        try {
          const auth = JSON.parse(adminAuth) as AdminAuthState;
          if (auth.isAdmin) {
            setIsAuthenticated(true);
          } else {
            toast({
              title: "Требуется авторизация",
              description: "У вас нет доступа к админ-панели",
              variant: "destructive",
            });
            setIsAuthenticated(false);
          }
        } catch (e) {
          console.error("Ошибка при проверке авторизации:", e);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsChecking(false);
    };

    checkAuth();
  }, []);

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
    return <Navigate to="/admin/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminAuth;
