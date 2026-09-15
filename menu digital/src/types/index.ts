export type UserRole = 'ADMIN' | 'MANAGER' | 'WAITER';

export type TableStatus = 'LIVRE' | 'OCUPADA' | 'EM_PREPARACAO' | 'PRONTO' | 'FINALIZADA';

export type OrderStatus = 
  | 'NOVO' 
  | 'RECEBIDO' 
  | 'EM PREPARAÇÃO' 
  | 'PRONTO' 
  | 'ENTREGUE' 
  | 'FINALIZADO' 
  | 'CANCELADO';

export type OrderType = 'MESA' | 'ENTREGA' | 'LEVANTAMENTO';

export interface Category {
  id: string;
  name: string;
  description?: string;
  image: string;
  order: number;
  active: boolean;
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  code: string; // e.g. #GRL-01
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  categoryId: string;
  image: string;
  available: boolean;
  featured: boolean;
  order: number;
  isDemo?: boolean;
  extras?: ProductExtra[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedExtras: ProductExtra[];
  notes: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Table {
  id: string;
  number: string; // e.g. "Mesa 01"
  status: TableStatus;
  capacity: number;
  active: boolean;
  currentOrderId?: string;
  currentCustomerName?: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  code: string;
  username: string;
  passwordHash: string; // stored securely or pin
  role: UserRole;
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  lastOrderDate: string;
  orderCount: number;
  totalSpent: number;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  extras: { name: string; price: number }[];
  notes: string;
}

export interface Order {
  id: string; // #COM-000001
  createdAt: string;
  customerName: string;
  customerPhone: string;
  type: OrderType;
  tableNumber?: string;
  peopleCount?: number;
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  notes?: string;
  status: OrderStatus;
  waiterName?: string;
  targetWhatsApp: 'casa' | 'loja' | 'ambos';
}

export interface RestaurantSettings {
  name: string;
  website: string;
  address: string;
  phone: string;
  whatsappCasa: string;
  whatsappCasaActive: boolean;
  whatsappLoja: string;
  whatsappLojaActive: boolean;
  instagram: string;
  facebook: string;
  tiktok: string;
  googleMapsUrl: string;
  openingHours: string;
  currency: string;
  logo: string;
  coverImage: string;
  tagline: string;
  aboutText: string;
  deliveryFee: number;
  minOrderValue: number;
}

export interface FirebaseConfigState {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  enabled: boolean;
}

export type FirebaseConfig = Partial<FirebaseConfigState>;

