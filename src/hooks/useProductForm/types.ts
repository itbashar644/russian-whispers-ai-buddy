
import { Product } from "@/types/product";
import React from "react";

export interface UseProductFormProps {
  product: Partial<Product>;
  onSave: (product: Partial<Product>) => void;
}

export interface UseProductFormResult {
  formData: Partial<Product>;
  newCategory: string;
  showNewCategoryInput: boolean;
  activeTab: string;
  isSubmitting: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSpecificationChange: (id: string, value: string) => void;
  handleMainImageUploaded: (url: string) => void;
  handleAdditionalImagesChange: (urls: string[]) => void;
  handleColorVariantsChange: (variants: any[]) => void;
  handleRemoveColor: (color: string) => void;
  handleRelatedColorProductsChange: (productIds: string[]) => void;
  validateAndSubmitForm: () => Promise<void>;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
  setShowNewCategoryInput: React.Dispatch<React.SetStateAction<boolean>>;
}
