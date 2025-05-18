
import { Product } from "@/types/product";

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateProduct = (product: Partial<Product>): ValidationResult => {
  const errors: string[] = [];
  
  if (!product.title || product.title.trim() === "") {
    errors.push("Название товара обязательно");
  }
  
  if (!product.category || product.category.trim() === "") {
    errors.push("Категория товара обязательна");
  }
  
  if (!product.price || product.price <= 0) {
    errors.push("Цена товара должна быть больше нуля");
  }
  
  if (!product.description || product.description.trim() === "") {
    errors.push("Описание товара обязательно");
  }
  
  if (product.discountPrice !== undefined && product.discountPrice >= product.price!) {
    errors.push("Цена со скидкой должна быть меньше обычной цены");
  }
  
  if (!product.countryOfOrigin || product.countryOfOrigin.trim() === "") {
    errors.push("Страна производства обязательна");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
