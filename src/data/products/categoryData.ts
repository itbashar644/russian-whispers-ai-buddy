
import { getFromStorage, saveToStorage } from "./utils";
import { products } from "./productData";

// Store current categories
let categories: string[] = getInitialCategories();

// Function to get all unique categories
export const getAllCategories = (): string[] => {
  // Return stored categories
  return [...categories];
};

// Load categories from localStorage or default ones if not available
function getInitialCategories(): string[] {
  const defaultCategories = [
    "Сумки и рюкзаки",
    "Аксессуары",
    "Украшения",
    "Одежда",
    "Обувь",
    "Для дома"
  ];
  
  // Get unique categories from products
  const uniqueCategories = Array.from(new Set(products.map(product => product.category)));
  
  // Get saved categories from localStorage
  return getFromStorage<string[]>(
    'catalog_categories',
    uniqueCategories.length > 0 ? uniqueCategories : defaultCategories
  );
}

// Function to save categories to localStorage
const saveCategoriesToStorage = (): void => {
  saveToStorage('catalog_categories', categories);
};

// Function to add a new category
export const addCategory = (category: string): void => {
  if (!categories.includes(category)) {
    categories.push(category);
    saveCategoriesToStorage();
  }
};

// Function to remove a category
export const removeCategory = (category: string): boolean => {
  // Проверяем, используется ли категория в продуктах
  const productsInCategory = products.filter(p => p.category === category);
  
  if (productsInCategory.length === 0) {
    // Если категория не используется, удаляем ее
    categories = categories.filter(c => c !== category);
    saveCategoriesToStorage();
    return true;
  }
  
  return false; // Если категория используется, возвращаем false
};

// Function to update products when a category is removed
export const updateProductsCategory = (oldCategory: string, newCategory: string): void => {
  // Обновляем категорию для всех продуктов из старой категории
  products.forEach(product => {
    if (product.category === oldCategory) {
      product.category = newCategory;
    }
  });
  
  // Remove the old category
  removeCategory(oldCategory);
  
  // Save updated products to localStorage
  saveToStorage('catalog_products', products);
};
