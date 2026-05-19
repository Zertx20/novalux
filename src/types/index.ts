export interface Product {
  id: string;
  name: string;
  description: string | null;
  new_price: number;
  category: string | null;
  image_url: string | null; // Keep for backward compatibility
  image_urls: string[]; // New field for multiple images
  is_sold: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  delivery_type: string;
  wilaya?: string;
  items: OrderItem[];
  total_price: number;
  status: string;
  created_at: string;
}

export type Language = 'ar' | 'fr' | 'en';
export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';
