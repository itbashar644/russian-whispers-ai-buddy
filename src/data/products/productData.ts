
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

// Function to remove a product
export const removeProduct = (productId: string): void => {
  products = products.filter(p => p.id !== productId);
  // Save to localStorage immediately after modifying the products array
  saveProductsToStorage();
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
