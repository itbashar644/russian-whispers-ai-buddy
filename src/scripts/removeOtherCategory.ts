
import { removeOtherCategory } from "@/data/products/supabase/categoryApi";
import { toast } from "sonner";

export const executeRemoveOtherCategory = async () => {
  try {
    const result = await removeOtherCategory();
    if (result) {
      console.log("Категория 'Другое' успешно удалена");
      toast.success("Категория 'Другое' успешно удалена");
    } else {
      console.log("Не удалось удалить категорию 'Другое'. Возможно, она не существует.");
    }
  } catch (error) {
    console.error("Ошибка при удалении категории 'Другое':", error);
    toast.error("Ошибка при удалении категории 'Другое'");
  }
};

// Вызываем функцию при загрузке скрипта
executeRemoveOtherCategory();
