
export interface MenuItemOption {
  nameKey: string;
  price: number; // additional price
}

export interface MenuItem {
  nameKey: string;
  descriptionKey: string;
  price: number; // base price
  options?: {
    titleKey: string;
    items: MenuItemOption[];
    default: string; // default nameKey
  };
}

export interface MenuCategory {
  categoryKey: string;
  items: MenuItem[];
}


export interface CartItem {
  id: string; // e.g., "cappuccino-vegan_milk"
  nameKey: string; 
  optionNameKey?: string; 
  price: number; // final price (base + option)
  quantity: number;
}


export interface Cart {
  [itemId: string]: CartItem;
}

export type OrderType = 'pickup' | 'delivery';

export interface DeliveryDetails {
    name: string;
    location: string;
}

export interface OrderHistoryEntry {
  id: number | string;
  total: number | string;
  payment_method: 'cash' | 'pix';
  created_at: string;
}
