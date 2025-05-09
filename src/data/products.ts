import { Product } from "../types/product";

// Export products as a variable that can be modified by the admin panel
export let products: Product[] = [];

// Function to add or update products
export const addOrUpdateProduct = (product: Product): void => {
  const index = products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    // Update existing product
    products[index] = product;
  } else {
    // Add new product
    products.push(product);
  }
};

// Function to remove a product
export const removeProduct = (productId: string): void => {
  products = products.filter(p => p.id !== productId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (!category) return products;
  return products.filter((product) => product.category === category);
};

export const getRelatedProducts = (id: string, limit: number = 4): Product[] => {
  const currentProduct = getProductById(id);
  if (!currentProduct) return [];
  
  return products
    .filter((product) => product.id !== id && product.category === currentProduct.category)
    .slice(0, limit);
};

export const getBestsellers = (limit: number = 4): Product[] => {
  return products
    .filter((product) => product.isBestseller)
    .slice(0, limit);
};

export const getNewProducts = (limit: number = 4): Product[] => {
  return products
    .filter((product) => product.isNew)
    .slice(0, limit);
};

// Function to get all unique categories
export const getAllCategories = (): string[] => {
  // If there are no products yet, return default catalog categories
  if (products.length === 0) {
    return [
      "Сумки и рюкзаки",
      "Аксессуары",
      "Украшения",
      "Одежда",
      "Обувь",
      "Для ��ома"
    ];
  }
  
  // Otherwise return all unique categories from products
  return Array.from(new Set(products.map(product => product.category)));
};
