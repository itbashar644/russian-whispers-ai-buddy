
import { useState } from "react";
import { Product } from "@/types/product";
import { UseProductFormProps, UseProductFormResult } from "./types";
import { useFormHandlers } from "./handlers";
import { validateProduct } from "./validation";

export const useProductForm = ({ product, onSave }: UseProductFormProps): UseProductFormResult => {
  const [formData, setFormData] = useState<Partial<Product>>(product || {});
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleInputChange,
    handleCheckboxChange,
    handleSelectChange,
    handleSpecificationChange,
    handleMainImageUploaded,
    handleAdditionalImagesChange,
    handleColorVariantsChange,
    handleRemoveColor,
    handleRelatedColorProductsChange,
  } = useFormHandlers(setFormData, formData, setShowNewCategoryInput, setNewCategory);

  const validateAndSubmitForm = async () => {
    setIsSubmitting(true);
    
    try {
      // If new category is specified, use it
      if (showNewCategoryInput && newCategory.trim()) {
        formData.category = newCategory.trim();
      }
      
      // Validate product data
      const validationResult = validateProduct(formData);
      
      if (!validationResult.valid) {
        alert(validationResult.errors.join("\n"));
        setIsSubmitting(false);
        return;
      }
      
      // Call onSave callback with the form data
      await onSave(formData);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Ошибка при сохранении товара");
    } finally {
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
    handleSpecificationChange,
    handleMainImageUploaded,
    handleAdditionalImagesChange,
    handleColorVariantsChange,
    handleRemoveColor,
    handleRelatedColorProductsChange,
    validateAndSubmitForm,
    setNewCategory,
    setShowNewCategoryInput,
  };
};
