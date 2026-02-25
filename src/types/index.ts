export interface Product {
  id: string;
  name: string;
  description: string | null;
  old_price: number | null;
  new_price: number;
  category: string | null;
  image_url: string | null;
  is_sold: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  delivery_type: string;
  items: CartItem[];
  total_price: number;
  status: string;
  created_at: string;
}

export type Language = 'ar' | 'fr' | 'en';
export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';
