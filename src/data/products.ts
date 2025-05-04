
import { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "1",
    title: "Изолят Dymatize ISO 100",
    description: "Изолят сывороточного протеина премиум-класса. Содержит 25 г белка и 5,5 г BCAA в каждой порции. Быстрое усвоение, минимум жиров и углеводов.",
    price: 4990,
    discountPrice: 4490,
    category: "protein",
    imageUrl: "/placeholder.svg",
    rating: 4.8,
    inStock: true,
    flavors: [
      "Шоколад",
      "Ваниль",
      "Клубника",
      "Печенье-крем",
      "Карамель"
    ],
    sizes: ["907 г", "2,27 кг", "3,63 кг"],
    weight: "2,27 кг",
    isBestseller: true
  },
  {
    id: "2",
    title: "Креатин Dymatize Creatine Monohydrate",
    description: "Микронизированный креатина моногидрат для увеличения силы и выносливости. 5 г чистого креатина в каждой порции.",
    price: 1990,
    category: "creatine",
    imageUrl: "/placeholder.svg",
    rating: 4.7,
    inStock: true,
    sizes: ["300 г", "500 г"],
    weight: "300 г"
  },
  {
    id: "3",
    title: "Гейнер Dymatize Super Mass Gainer",
    description: "Высококалорийный гейнер для набора массы. Содержит 1280 калорий, 52 г белка и 252 г углеводов в порции.",
    price: 3490,
    category: "gainer",
    imageUrl: "/placeholder.svg",
    rating: 4.5,
    inStock: true,
    flavors: ["Шоколад", "Ваниль", "Печенье-крем"],
    sizes: ["2,7 кг", "5,4 кг"],
    weight: "2,7 кг"
  },
  {
    id: "4",
    title: "BCAA Dymatize BCAA Complex 5050",
    description: "Комплекс аминокислот с разветвлённой цепью (BCAA) в соотношении 2:1:1 (лейцин, изолейцин, валин).",
    price: 1790,
    category: "bcaa",
    imageUrl: "/placeholder.svg",
    rating: 4.6,
    inStock: true,
    flavors: ["Яблоко", "Апельсин", "Малина"],
    sizes: ["300 г", "500 г"],
    weight: "300 г",
    isNew: true
  },
  {
    id: "5",
    title: "Предтренировочный комплекс Dymatize Pre W.O.",
    description: "Мощная предтренировочная формула для максимальной энергии, концентрации и пампинга во время тренировок.",
    price: 2490,
    discountPrice: 2290,
    category: "pre-workout",
    imageUrl: "/placeholder.svg",
    rating: 4.7,
    inStock: true,
    flavors: ["Арбуз", "Виноград", "Лимонад"],
    sizes: ["300 г", "400 г"],
    weight: "300 г"
  },
  {
    id: "6",
    title: "Витаминный комплекс Dymatize Athletic Multi",
    description: "Полный комплекс витаминов и минералов, разработанный специально для спортсменов.",
    price: 1290,
    category: "vitamins",
    imageUrl: "/placeholder.svg",
    rating: 4.5,
    inStock: true,
    sizes: ["60 таб.", "120 таб."],
    weight: "120 таб."
  }
];

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
