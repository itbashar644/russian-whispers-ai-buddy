
import { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "1",
    title: "Минималистичная настольная лампа",
    description: "Элегантная настольная лампа в минималистичном стиле с регулируемой яркостью. Идеально подходит для рабочего стола или прикроватной тумбочки.",
    price: 2990,
    discountPrice: 2490,
    category: "lighting",
    imageUrl: "/placeholder.svg",
    rating: 4.8,
    inStock: true,
    colors: [
      "Белый",
      "Чёрный",
      "Бежевый"
    ],
    material: "Металл, пластик",
    isBestseller: true,
    countryOfOrigin: "Китай",
    specifications: [
      { name: "Мощность", value: "8 Вт" },
      { name: "Регулировка яркости", value: "Да" },
      { name: "Высота", value: "38 см" }
    ]
  },
  {
    id: "2",
    title: "Органайзер для косметики",
    description: "Прозрачный акриловый органайзер с несколькими отделениями для хранения косметики и аксессуаров.",
    price: 1490,
    category: "organization",
    imageUrl: "/placeholder.svg",
    rating: 4.7,
    inStock: true,
    colors: ["Прозрачный"],
    material: "Акрил",
    countryOfOrigin: "Китай",
    specifications: [
      { name: "Размеры", value: "25×15×10 см" },
      { name: "Количество отделений", value: "8" }
    ]
  },
  {
    id: "3",
    title: "Декоративная ваза в скандинавском стиле",
    description: "Керамическая ваза нейтральных тонов для цветов или как самостоятельный элемент декора.",
    price: 1990,
    discountPrice: 1690,
    category: "decor",
    imageUrl: "/placeholder.svg",
    rating: 4.5,
    inStock: true,
    colors: ["Белый", "Бежевый", "Серый"],
    material: "Керамика",
    countryOfOrigin: "Китай"
  },
  {
    id: "4",
    title: "Хлопковое постельное белье",
    description: "Комплект постельного белья из 100% хлопка с геометрическим принтом. В комплекте: пододеяльник, простыня и две наволочки.",
    price: 3490,
    category: "textiles",
    imageUrl: "/placeholder.svg",
    rating: 4.6,
    inStock: true,
    colors: ["Светло-серый", "Голубой", "Розовый"],
    sizes: ["Односпальный", "Полуторный", "Двуспальный"],
    material: "100% хлопок",
    isNew: true,
    countryOfOrigin: "Китай",
    specifications: [
      { name: "Плотность", value: "120 г/м²" },
      { name: "Тип ткани", value: "Сатин" }
    ]
  },
  {
    id: "5",
    title: "Умный ночник с датчиком движения",
    description: "Беспроводной ночник с датчиком движения и регулировкой яркости. Работает от аккумулятора, который можно заряжать через USB.",
    price: 1290,
    category: "lighting",
    imageUrl: "/placeholder.svg",
    rating: 4.4,
    inStock: true,
    colors: ["Белый"],
    material: "ABS пластик",
    countryOfOrigin: "Китай",
    specifications: [
      { name: "Время работы", value: "До 8 часов" },
      { name: "Способ крепления", value: "Магнитная основа, клейкая лента" }
    ]
  },
  {
    id: "6",
    title: "Настенное зеркало в металлической раме",
    description: "Круглое зеркало в тонкой металлической раме. Подходит для ванной комнаты или прихожей.",
    price: 2790,
    category: "decor",
    imageUrl: "/placeholder.svg",
    rating: 4.7,
    inStock: true,
    colors: ["Чёрный", "Золотой"],
    material: "Металл, стекло",
    countryOfOrigin: "Китай",
    specifications: [
      { name: "Диаметр", value: "60 см" },
      { name: "Толщина рамы", value: "1,5 см" }
    ]
  },
  {
    id: "7",
    title: "Деревянная разделочная доска",
    description: "Разделочная доска из массива акации с ручкой и бороздками для стока жидкости.",
    price: 1890,
    category: "kitchen",
    imageUrl: "/placeholder.svg",
    rating: 4.5,
    inStock: true,
    material: "Массив акации",
    countryOfOrigin: "Китай",
    specifications: [
      { name: "Размеры", value: "40×25×2 см" },
      { name: "Уход", value: "Ручная мойка, обработка маслом" }
    ]
  },
  {
    id: "8",
    title: "Набор керамических горшков для растений",
    description: "Комплект из 3 керамических горшков разных размеров с подставками. Минималистичный дизайн подойдет для любого интерьера.",
    price: 1990,
    discountPrice: 1790,
    category: "decor",
    imageUrl: "/placeholder.svg",
    rating: 4.8,
    inStock: true,
    colors: ["Белый", "Терракотовый"],
    material: "Керамика",
    isBestseller: true,
    countryOfOrigin: "Китай",
    specifications: [
      { name: "Размеры", value: "10 см, 12 см, 15 см (диаметр)" },
      { name: "Дренажные отверстия", value: "Есть" }
    ]
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
