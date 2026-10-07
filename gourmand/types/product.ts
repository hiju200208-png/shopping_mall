export type Unit = 'g' | 'kg' | 'ml' | 'L' | '개';

export interface Product {
  id: number;
  name: string;
  price: number;
  country: string;
  category: string;
  imageUrl: string;
  description: string;
  isNew?: boolean;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isSoldOut: boolean;
  deliveryDays: number;
  volume: number;
  unit: Unit;
  itemCount: number;
  origin: string;
  foodType: string;
  manufacturer: string;
  storageMethod: string;
}
