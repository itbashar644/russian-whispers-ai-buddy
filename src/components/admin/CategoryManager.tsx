import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  getAllCategories,
  getCategoryObjects, 
  addCategory, 
  removeCategory,
  getCategoryProducts,
  updateProductsCategory,
  updateCategoryImage,
  Category
} from "@/data/products";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";
import CategoryMoveDialog from "./CategoryMoveDialog";

const CategoryManager = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [targetCategory, setTargetCategory] = useState<string>("");
  const [showMoveDialog, setShowMoveDialog] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setCategories(getAllCategories());
    setCategoryObjects(getCategoryObjects());
  };

  const handleAddCategory = (newCategory: string) => {
    addCategory(newCategory);
    loadCategories();
    toast("Категория добавлена", {
      description: `Категория "${newCategory}" была успешно добавлена`,
    });
  };

  const handleUpdateCategoryImage = (categoryName: string, imageUrl: string) => {
    updateCategoryImage(categoryName, imageUrl);
    loadCategories();
    toast("Изображение обновлено", {
      description: `Изображение для категории "${categoryName}" было успешно обновлено`,
    });
  };

  const handleDeleteAttempt = (category: string) => {
    setCategoryToDelete(category);
    
    // Проверяем, есть ли продукты в этой категории
    const productsInCategory = getCategoryProducts(category);
    
    if (productsInCategory.length > 0) {
      // Если есть продукты, предложим переместить их в другую категорию
      setShowMoveDialog(true);
    } else {
      // Если нет продуктов, удаляем категорию
      const success = removeCategory(category);
      if (success) {
        toast("Категория удалена", {
          description: `Категория "${category}" была успешно удалена`,
        });
      } else {
        toast("Ошибка", {
          description: "Не удалось удалить категорию",
        });
      }
      setCategoryToDelete(null);
      loadCategories();
    }
  };

  const handleMoveProducts = () => {
    if (categoryToDelete && targetCategory) {
      // Перемещаем продукты из удаляемой категории в выбранную
      updateProductsCategory(categoryToDelete, targetCategory);
      
      toast("Категория удалена", {
        description: `Продукты перемещены в категорию "${targetCategory}" и категория "${categoryToDelete}" удалена`,
      });
      
      setCategoryToDelete(null);
      setShowMoveDialog(false);
      setTargetCategory("");
      loadCategories();
    }
  };

  const handleCancelMove = () => {
    setShowMoveDialog(false);
    setCategoryToDelete(null);
    setTargetCategory("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление категориями</CardTitle>
        <CardDescription>
          Добавляйте, удаляйт�� и редактируйте категории товаров
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CategoryForm 
          categories={categories} 
          onAddCategory={handleAddCategory} 
        />

        <CategoryList 
          categories={categoryObjects} 
          onDeleteAttempt={handleDeleteAttempt} 
          onUpdateImage={handleUpdateCategoryImage}
        />

        <CategoryMoveDialog
          open={showMoveDialog}
          onOpenChange={setShowMoveDialog}
          categoryToDelete={categoryToDelete}
          categories={categories}
          targetCategory={targetCategory}
          onTargetCategoryChange={setTargetCategory}
          onMoveProducts={handleMoveProducts}
          onCancel={handleCancelMove}
        />
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
