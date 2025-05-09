
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
  videoUrl?: string; // Добавляем поле для ссылки на видео
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
}
