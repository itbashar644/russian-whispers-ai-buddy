
import React, { useState, useEffect } from "react";
import CategoryManager from "@/components/admin/CategoryManager";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AdminCategories = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        // В будущем здесь может быть проверка прав админа
        setIsLoading(false);
      } catch (error) {
        console.error("Ошибка при проверке статуса администратора:", error);
        toast.error("Ошибка доступа", {
          description: "У вас нет прав для доступа к этой странице"
        });
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

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
