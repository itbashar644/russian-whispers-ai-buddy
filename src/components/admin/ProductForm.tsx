
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Product, ColorVariant } from "@/types/product";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the refactored tab components
import GeneralInfoTab from "./product-form/GeneralInfoTab";
import ColorsTab from "./product-form/ColorsTab";
import AdditionalInfoTab from "./product-form/AdditionalInfoTab";

interface ProductFormProps {
  product: Partial<Product>;
  categories: string[];
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, categories, onSave, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<Partial<Product>>(product);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "discountPrice" || name === "rating" || name === "stockQuantity"
        ? parseFloat(value)
        : value,
    });
  };

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    if (name === "category" && value === "new") {
      // Show input for new category
      setShowNewCategoryInput(true);
      setNewCategory("");
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setFormData({
      ...formData,
      colors: formData.colors?.filter(color => color !== colorToRemove),
    });
  };

  const handleMainImageUploaded = (url: string) => {
    setFormData({
      ...formData,
      imageUrl: url,
    });
  };

  const handleAdditionalImagesChange = (urls: string[]) => {
    setFormData({
      ...formData,
      additionalImages: urls,
    });
  };

  const handleColorVariantsChange = (variants: ColorVariant[]) => {
    setFormData({
      ...formData,
      colorVariants: variants
    });
  };

  const validateImageUrl = (url: string): boolean => {
    if (!url) return true; // Empty URL is considered valid (will use default)
    
    // Basic URL validation
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateAllImageUrls = (mainImageUrl: string, additionalImages: string[] = []): boolean => {
    if (mainImageUrl && mainImageUrl !== "/placeholder.svg" && !validateImageUrl(mainImageUrl)) {
      return false;
    }
    
    if (additionalImages && additionalImages.length > 0) {
      for (const url of additionalImages) {
        if (!validateImageUrl(url)) {
          return false;
        }
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      let finalFormData = { ...formData };
      
      // Use the new category if provided
      if (showNewCategoryInput && newCategory.trim()) {
        finalFormData.category = newCategory.trim();
      }
      
      if (!finalFormData.title || !finalFormData.description || !finalFormData.category) {
        toast.error("Ошибка", {
          description: "Пожалуйста, заполните все обязательные поля",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate image URLs
      if (!validateAllImageUrls(finalFormData.imageUrl || "", finalFormData.additionalImages)) {
        toast.error("Ошибка URL изображений", {
          description: "Пожалуйста, укажите корректные URL изображений",
        });
        setIsSubmitting(false);
        return;
      }

      await onSave(finalFormData);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting product form:", error);
      toast.error("Не удалось сохранить товар", {
        description: "Произошла ошибка при сохранении товара"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1">Основная информация</TabsTrigger>
          <TabsTrigger value="colors" className="flex-1">Цветовые варианты</TabsTrigger>
          <TabsTrigger value="additional" className="flex-1">Дополнительно</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-4">
          <GeneralInfoTab
            formData={formData}
            categories={categories}
            showNewCategoryInput={showNewCategoryInput}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            setShowNewCategoryInput={setShowNewCategoryInput}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleCheckboxChange={handleCheckboxChange}
            handleMainImageUploaded={handleMainImageUploaded}
            handleAdditionalImagesChange={handleAdditionalImagesChange}
          />
        </TabsContent>

        <TabsContent value="colors" className="pt-4">
          <ColorsTab
            formData={formData}
            handleColorVariantsChange={handleColorVariantsChange}
            handleRemoveColor={handleRemoveColor}
          />
        </TabsContent>

        <TabsContent value="additional" className="pt-4">
          <AdditionalInfoTab
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Сохранение..." : (product.id ? "Сохранить изменения" : "Добавить товар")}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
