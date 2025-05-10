
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getAllCategories, addCategory, removeCategory, getProductsByCategory, updateProductsCategory } from "@/data/products";

const CategoryManager = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [targetCategory, setTargetCategory] = useState<string>("");
  const [showMoveDialog, setShowMoveDialog] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setCategories(getAllCategories());
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      if (categories.includes(newCategory.trim())) {
        toast("Ошибка", {
          description: "Такая категория уже существует",
        });
      } else {
        addCategory(newCategory.trim());
        setNewCategory("");
        loadCategories();
        toast("Категория добавлена", {
          description: `Категория "${newCategory.trim()}" была успешно добавлена`,
        });
      }
    }
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      // Проверяем, есть ли продукты в этой категории
      const productsInCategory = getProductsByCategory(categoryToDelete);
      
      if (productsInCategory.length > 0) {
        // Если есть продукты, предложим переместить их в другую категорию
        setShowMoveDialog(true);
      } else {
        // Если нет продуктов, удаляем категорию
        const result = removeCategory(categoryToDelete);
        if (result) {
          toast("Категория удалена", {
            description: `Категория "${categoryToDelete}" была успешно удалена`,
          });
        } else {
          toast("Ошибка", {
            description: "Не удалось удалить категорию",
          });
        }
        setCategoryToDelete(null);
        loadCategories();
      }
    }
  };

  const handleMoveProducts = () => {
    if (categoryToDelete && targetCategory) {
      // Перемещаем продукты из удаляемой категории в выбранную
      updateProductsCategory(categoryToDelete, targetCategory);
      
      // Удаляем категорию
      removeCategory(categoryToDelete);
      
      toast("Категория удалена", {
        description: `Продукты перемещены в категорию "${targetCategory}" и категория "${categoryToDelete}" удалена`,
      });
      
      setCategoryToDelete(null);
      setShowMoveDialog(false);
      setTargetCategory("");
      loadCategories();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление категориями</CardTitle>
        <CardDescription>
          Добавляйте, удаляйте и редактируйте категории товаров
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Название новой категории"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" /> Добавить
          </Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Категория</TableHead>
                <TableHead className="w-16 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-6">
                    Нет добавленных категорий
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category}>
                    <TableCell>{category}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCategoryToDelete(category)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Вы уверены?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы собираетесь удалить категорию "{category}". Это действие нельзя отменить.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>
                              Отмена
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteCategory}>
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Диалог перемещения товаров */}
        <AlertDialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Переместить товары
              </AlertDialogTitle>
              <AlertDialogDescription>
                В категории "{categoryToDelete}" есть товары. Выберите категорию, в которую хотите переместить эти товары.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="flex items-center space-x-2 my-4">
              <div className="flex-1 text-center font-medium">{categoryToDelete}</div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Select
                  value={targetCategory}
                  onValueChange={setTargetCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat !== categoryToDelete)
                      .map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowMoveDialog(false);
                setCategoryToDelete(null);
              }}>
                Отмена
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleMoveProducts}
                disabled={!targetCategory}
              >
                Переместить и удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
