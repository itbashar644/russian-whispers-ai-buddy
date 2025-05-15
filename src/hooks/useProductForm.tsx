
import { useState, useEffect } from "react";
import { Product, ColorVariant } from "@/types/product";
import { toast } from "sonner";

interface UseProductFormProps {
  product: Partial<Product>;
  onSave: (product: Partial<Product>) => void;
}

export const useProductForm = ({ product, onSave }: UseProductFormProps) => {
  const [formData, setFormData] = useState<Partial<Product>>(product);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when product changes
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

  const validateAndSubmitForm = async () => {
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

      console.log("Form submission - data being sent to parent:", finalFormData);
      await onSave(finalFormData);
      
      // Only reset submission state if we're still mounted
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
      
    } catch (error) {
      console.error("Error submitting product form:", error);
      toast.error("Не удалось сохранить товар", {
        description: error instanceof Error ? error.message : "Произошла ошибка при сохранении товара"
      });
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    newCategory,
    showNewCategoryInput,
    activeTab,
    isSubmitting,
    setActiveTab,
    handleInputChange,
    handleCheckboxChange,
    handleSelectChange,
    handleMainImageUploaded,
    handleAdditionalImagesChange,
    handleColorVariantsChange,
    handleRemoveColor,
    validateAndSubmitForm,
    setNewCategory,
    setShowNewCategoryInput
  };
};
