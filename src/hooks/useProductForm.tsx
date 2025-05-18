
import { useState, useEffect } from "react";
import { Product, ColorVariant } from "@/types/product";
import { toast } from "sonner";

interface UseProductFormProps {
  product: Partial<Product>;
  onSave: (product: Partial<Product>) => void;
}

export const useProductForm = ({ product, onSave }: UseProductFormProps) => {
  const [formData, setFormData] = useState<Partial<Product>>(product);
  const [newCategory, setNewCategory] = useState<string>("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Update form data when product changes
  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Fixed: Make sure the category selection works properly
  const handleSelectChange = (value: string, name: string) => {
    console.log(`handleSelectChange called with name: ${name}, value: ${value}`);
    
    if (name === "category" && value === "new") {
      // Show input for new category
      setShowNewCategoryInput(true);
      return;
    }
    
    // Update the form data with the selected value
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      console.log(`Updated form data for ${name}:`, updated);
      return updated;
    });
  };

  // Helper functions definitions
  function handleRemoveColor(colorToRemove: string) {
    setFormData({
      ...formData,
      colors: formData.colors?.filter(color => color !== colorToRemove),
    });
  }

  function handleMainImageUploaded(url: string) {
    setFormData({
      ...formData,
      imageUrl: url,
    });
  }

  function handleAdditionalImagesChange(urls: string[]) {
    setFormData({
      ...formData,
      additionalImages: urls,
    });
  }

  function handleColorVariantsChange(variants: ColorVariant[]) {
    setFormData({
      ...formData,
      colorVariants: variants
    });
  }

  function validateImageUrl(url: string): boolean {
    if (!url) return true; // Empty URL is considered valid (will use default)
    
    // Basic URL validation
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  function validateAllImageUrls(mainImageUrl: string, additionalImages: string[] = []): boolean {
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
  }

  const validateForm = (): boolean => {
    // Validate required fields
    if (!formData.title) {
      toast.error("Необходимо указать название товара");
      setActiveTab("general");
      return false;
    }
    
    if (!formData.category && !newCategory) {
      toast.error("Необходимо указать категорию товара");
      setActiveTab("general");
      return false;
    }
    
    if (!formData.price || formData.price <= 0) {
      toast.error("Необходимо указать корректную цену товара");
      setActiveTab("general");
      return false;
    }
    
    // Check for duplicate article numbers in color variants
    if (formData.colorVariants && formData.colorVariants.length > 0) {
      const articleNumbers = formData.colorVariants
        .map(v => v.articleNumber)
        .filter(a => a && a.trim() !== "");
      
      const uniqueArticleNumbers = new Set(articleNumbers);
      
      if (articleNumbers.length !== uniqueArticleNumbers.size) {
        toast.error("Найдены дублирующиеся артикулы в цветовых вариантах");
        setActiveTab("colors");
        return false;
      }
    }
    
    return true;
  };

  const validateAndSubmitForm = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If new category was entered, use it
      const finalProduct = {
        ...formData,
        category: showNewCategoryInput && newCategory ? newCategory : formData.category
      };
      
      console.log("Form submission - data being sent to parent:", finalProduct);
      await onSave(finalProduct);
      
      // Only reset submission state if we're still mounted
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
      
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Ошибка при сохранении товара");
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
