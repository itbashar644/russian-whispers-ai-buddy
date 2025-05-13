
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
  colorVariants?: ColorVariant[]; // New field to store color variants
  material?: string; // Added back the material field
}

export interface ColorVariant {
  color: string;
  price: number;
  discountPrice?: number;
  articleNumber?: string;
  barcode?: string;
  stockQuantity?: number;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
  selectedColorVariant?: ColorVariant;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: string;
}
