
import React, { useState, useEffect } from "react";
import CategoryManager from "@/components/admin/CategoryManager";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AdminCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        
        // Проверка текущей сессии пользователя
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("Требуется авторизация", {
            description: "Необходимо войти в систему для доступа к панели администратора"
          });
          navigate("/login");
          return;
        }
        
        // Проверка роли администратора (в будущем можно добавить)
        // const { data: roleData } = await supabase.from("user_roles").select("*").eq("user_id", session.user.id);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Ошибка при проверке статуса администратора:", error);
        toast.error("Ошибка доступа", {
          description: "У вас нет прав для доступа к этой странице"
        });
        setIsLoading(false);
        navigate("/");
      }
    };

    checkAdminStatus();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление категориями</h2>
      </div>

      <CategoryManager />
    </div>
  );
};

export default AdminCategories;
