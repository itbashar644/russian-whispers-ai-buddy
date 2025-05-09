
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  rating: number;
  inStock: boolean;
  colors?: string[];
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
  reviews?: ProductReview[];
}

export interface ProductReview {
  id: string;
  rating: number;
  text: string;
  author: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: string;
}
