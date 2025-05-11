
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
  additionalImages?: string[]; // Add support for multiple images
  videoUrl?: string;
  videoType?: 'mp4' | 'vk' | 'youtube';
  rating: number;
  inStock: boolean;
  stockQuantity?: number; // Добавляем количество товара в наличии
  colors?: string[];
  sizes?: string[];
  material?: string;
  countryOfOrigin: string;
  specifications?: Record<string, string>;
  isNew?: boolean;
  isBestseller?: boolean;
  articleNumber?: string;
  barcode?: string;
  ozonUrl?: string;
  wildberriesUrl?: string;
  avitoUrl?: string;
  archived?: boolean; // New field to mark archived products
}

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: string;
}
