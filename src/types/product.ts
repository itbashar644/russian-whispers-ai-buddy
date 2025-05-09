
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
  rating: number;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
  material?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  countryOfOrigin: string;
  specifications?: {
    name: string;
    value: string;
  }[];
  articleNumber?: string;
  barcode?: string;
  wildberriesUrl?: string;
  ozonUrl?: string;
  avitoUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
}

export type DeliveryMethod = {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: string;
};
