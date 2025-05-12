
import { Product } from "@/types/product";
import { generateRandomRating, getFromStorage, saveToStorage } from "./utils";

// Default products to populate the catalog initially
const defaultProducts: Product[] = [
  {
    id: "1",
    title: "Кожаная сумка через плечо",
    description: "Стильная кожаная сумка через плечо ручной работы из натуральной кожи.",
    price: 5990,
    category: "Сумки и рюкзаки",
    imageUrl: "/placeholder.svg",
    additionalImages: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.8,
    inStock: true,
    countryOfOrigin: "Россия",
    colors: ["Черный", "Коричневый", "Бежевый"],
    material: "Натуральная кожа",
    isBestseller: true,
    stockQuantity: 15,
  },
  {
    id: "2",
    title: "Керамическая ваза ручной работы",
    description: "Уникальная керамическая ваза ручной работы с авторским дизайном.",
    price: 3500,
    discountPrice: 2990,
    category: "Для дома",
    imageUrl: "/placeholder.svg",
    rating: 4.9,
    inStock: true,
    countryOfOrigin: "Россия",
    isNew: true,
    stockQuantity: 8,
  },
  {
    id: "3",
    title: "Серебряное кольцо с малахитом",
    description: "Элегантное серебряное кольцо с натуральным малахитом российского производства.",
    price: 4500,
    category: "Украшения",
    imageUrl: "/placeholder.svg",
    rating: 4.7,
    inStock: true,
    countryOfOrigin: "Россия",
    material: "Серебро 925 пробы, малахит",
    isBestseller: true,
    stockQuantity: 20,
  }
];

// Get products from localStorage or use default ones if not available
const getInitialProducts = (): Product[] => {
  return getFromStorage<Product[]>('catalog_products', [...defaultProducts]);
};

// Export products as a variable that can be modified by the admin panel
export let products: Product[] = getInitialProducts();

// Function to save products to localStorage
const saveProductsToStorage = (): void => {
  saveToStorage('catalog_products', products);
};

// Function to add or update products
export const addOrUpdateProduct = (product: Product): void => {
  // Если рейтинг не указан, генерируем случайный в диапазоне от 4.7 до 4.9
  if (!product.rating) {
    product.rating = generateRandomRating();
  }
  
  // Update inStock status based on stock quantity
  if (product.stockQuantity !== undefined) {
    product.inStock = product.stockQuantity > 0;
  } else {
    // Если stockQuantity не указано, считаем товар как отсутствующий в наличии
    product.inStock = false;
  }
  
  const index = products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    // Update existing product
    products[index] = product;
  } else {
    // Add new product
    products.push(product);
  }
  // Save to localStorage immediately after modifying the products array
  saveProductsToStorage();
};

// Function to decrease stock quantity when products are ordered
export const decreaseProductStock = (productId: string, quantity: number): boolean => {
  const product = products.find(p => p.id === productId);
  
  if (!product || product.stockQuantity === undefined) {
    return false;
  }
  
  if (product.stockQuantity < quantity) {
    return false; // Not enough stock
  }
  
  product.stockQuantity -= quantity;
  product.inStock = product.stockQuantity > 0;
  saveProductsToStorage();
  return true;
};

// Function to archive a product
export const archiveProduct = (productId: string): void => {
  const product = products.find(p => p.id === productId);
  if (product) {
    product.archived = true;
    saveProductsToStorage();
  }
};

// Function to restore an archived product
export const restoreProduct = (productId: string): void => {
  const product = products.find(p => p.id === productId);
  if (product) {
    product.archived = false;
    saveProductsToStorage();
  }
};

// Original remove function (kept for compatibility)
export const removeProduct = (productId: string): void => {
  products = products.filter(p => p.id !== productId);
  // Save to localStorage immediately after modifying the products array
  saveProductsToStorage();
};

// Function to check if a product has enough stock
export const checkProductStock = (productId: string, requestedQuantity: number): boolean => {
  const product = products.find(p => p.id === productId);
  if (!product || product.stockQuantity === undefined) {
    return false; // Если stockQuantity неопределен, считаем что товара нет в наличии
  }
  return product.stockQuantity >= requestedQuantity;
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (!category) return products.filter(p => !p.archived);
  return products.filter((product) => product.category === category && !product.archived);
};

export const getRelatedProducts = (id: string, limit: number = 4): Product[] => {
  const currentProduct = getProductById(id);
  if (!currentProduct) return [];
  
  return products
    .filter((product) => product.id !== id && product.category === currentProduct.category && !product.archived)
    .slice(0, limit);
};

export const getBestsellers = (limit: number = 4): Product[] => {
  return products
    .filter((product) => product.isBestseller && !product.archived)
    .slice(0, limit);
};

export const getNewProducts = (limit: number = 4): Product[] => {
  return products
    .filter((product) => product.isNew && !product.archived)
    .slice(0, limit);
};

// New function to get all archived products
export const getArchivedProducts = (): Product[] => {
  return products.filter(p => p.archived);
};

// New function to get all active (non-archived) products
export const getActiveProducts = (): Product[] => {
  return products.filter(p => !p.archived);
};
