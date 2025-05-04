
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
  flavors?: string[];
  sizes?: string[];
  weight?: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  flavor?: string;
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
