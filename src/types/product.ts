
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
  stockQuantity?: number; // New field to track inventory quantity
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
