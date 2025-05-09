
import { Product, ProductReview } from "../types/product";

// Default products to populate the catalog initially
const defaultProducts: Product[] = [
  {
    id: "1",
    title: "Кожаная сумка через плечо",
    description: "Стильная кожаная сумка через плечо ручной работы из натуральной кожи.",
    price: 5990,
    category: "Сумки и рюкзаки",
    imageUrl: "/placeholder.svg",
    rating: 4.8,
    inStock: true,
    countryOfOrigin: "Россия",
    colors: ["Черный", "Коричневый", "Бежевый"],
    material: "Натуральная кожа",
    isBestseller: true,
    reviews: generateProductReviews("Кожаная сумка через плечо", 4.8)
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
    reviews: generateProductReviews("Керамическая ваза ручной работы", 4.9)
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
    reviews: generateProductReviews("Серебряное кольцо с малахитом", 4.7)
  }
];

// Функция генерации случайной оценки 4.7-4.9 если не указана другая
function generateRandomRating(): number {
  return parseFloat((Math.random() * 0.2 + 4.7).toFixed(1));
}

// Функция генерации отзывов для продукта
function generateProductReviews(productTitle: string, rating: number): ProductReview[] {
  // Генерируем от 40 до 150 отзывов
  const reviewCount = Math.floor(Math.random() * 111) + 40;
  const reviews: ProductReview[] = [];
  
  // Список возможных авторов
  const authors = [
    "Александр", "Екатерина", "Михаил", "Анна", "Дмитрий", "Ольга", 
    "Сергей", "Мария", "Андрей", "Елена", "Иван", "Наталья", 
    "Владимир", "Светлана", "Павел", "Татьяна", "Алексей", "Юлия"
  ];
  
  // Положительные прилагательные для отзывов
  const positiveAdjectives = [
    "отличный", "хороший", "качественный", "удобный", "приятный", "стильный", 
    "надежный", "прочный", "красивый", "элегантный", "практичный", "функциональный"
  ];
  
  // Глаголы для отзывов
  const verbs = [
    "рекомендую", "доволен", "понравился", "радует", "впечатляет"
  ];
  
  // Существительные в зависимости от типа товара
  const getNouns = (title: string) => {
    if (title.includes("сумка")) return ["сумка", "покупка", "товар", "дизайн", "качество"];
    if (title.includes("ваза")) return ["ваза", "покупка", "товар", "дизайн", "качество"];
    if (title.includes("кольцо")) return ["кольцо", "украшение", "покупка", "товар", "дизайн"];
    return ["товар", "покупка", "вещь", "дизайн", "качество"];
  };
  
  const nouns = getNouns(productTitle.toLowerCase());
  
  // Даты для отзывов (за последние 3 месяца)
  const generateRandomDate = () => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    const randomTimestamp = threeMonthsAgo.getTime() + Math.random() * (today.getTime() - threeMonthsAgo.getTime());
    return new Date(randomTimestamp).toISOString().split('T')[0];
  };
  
  for (let i = 0; i < reviewCount; i++) {
    // Определяем рейтинг отзыва (4 или 5 с соотношением 1:9)
    const reviewRating = Math.random() < 0.1 ? 4 : 5;
    
    // Выбираем случайные слова для отзыва
    const adjective = positiveAdjectives[Math.floor(Math.random() * positiveAdjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    
    // Генерируем текст отзыва (до 70 символов)
    let reviewText = "";
    if (Math.random() > 0.5) {
      reviewText = `${adjective.charAt(0).toUpperCase() + adjective.slice(1)} ${noun}, ${verb}!`;
    } else {
      reviewText = `${verb.charAt(0).toUpperCase() + verb.slice(1)}. ${adjective.charAt(0).toUpperCase() + adjective.slice(1)} ${noun}.`;
    }
    
    if (reviewText.length > 70) {
      reviewText = reviewText.substring(0, 70);
    }
    
    reviews.push({
      id: `review-${i + 1}`,
      rating: reviewRating,
      text: reviewText,
      author: authors[Math.floor(Math.random() * authors.length)],
      date: generateRandomDate()
    });
  }
  
  return reviews;
}

// Get products from localStorage or use default ones if not available
const getInitialProducts = (): Product[] => {
  const savedProducts = localStorage.getItem('catalog_products');
  
  if (savedProducts) {
    try {
      return JSON.parse(savedProducts);
    } catch (error) {
      console.error('Failed to parse saved products:', error);
      return [...defaultProducts];
    }
  }
  
  return [...defaultProducts];
};

// Export products as a variable that can be modified by the admin panel
export let products: Product[] = getInitialProducts();

// Function to save products to localStorage
const saveProductsToStorage = () => {
  try {
    localStorage.setItem('catalog_products', JSON.stringify(products));
  } catch (error) {
    console.error('Failed to save products to storage:', error);
  }
};

// Function to add or update products
export const addOrUpdateProduct = (product: Product): void => {
  // Если рейтинг не указан, генерируем случайный от 4.7 до 4.9
  if (!product.rating) {
    product.rating = generateRandomRating();
  }
  
  // Генерируем отзывы для нового продукта
  if (!product.reviews || product.reviews.length === 0) {
    product.reviews = generateProductReviews(product.title, product.rating);
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

// Expose these functions for product detail page
export const generateRandomRating = generateRandomRating;
export const generateProductReviews = generateProductReviews;

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

// Load categories from localStorage or default ones if not available
const getInitialCategories = (): string[] => {
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
  const savedCategories = localStorage.getItem('catalog_categories');
  
  if (savedCategories) {
    try {
      const parsedCategories = JSON.parse(savedCategories);
      // Merge with unique categories from products to ensure all products have a category
      return Array.from(new Set([...parsedCategories, ...uniqueCategories]));
    } catch (error) {
      console.error('Failed to parse saved categories:', error);
      return uniqueCategories.length > 0 ? uniqueCategories : defaultCategories;
    }
  }
  
  return uniqueCategories.length > 0 ? uniqueCategories : defaultCategories;
};

// Store current categories
let categories: string[] = getInitialCategories();

// Function to save categories to localStorage
const saveCategoriesToStorage = () => {
  try {
    localStorage.setItem('catalog_categories', JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories to storage:', error);
  }
};

// Function to get all unique categories
export const getAllCategories = (): string[] => {
  // Return stored categories
  return [...categories];
};

// Function to add a new category
export const addCategory = (category: string): void => {
  if (!categories.includes(category)) {
    categories.push(category);
    saveCategoriesToStorage();
  }
};
