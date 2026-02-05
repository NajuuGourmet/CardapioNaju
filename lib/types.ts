export interface Banner {
  id: string
  title: string | null
  image_url: string
  link: string | null
  active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  emoji: string | null
  color: string | null
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string
  image_url: string | null
  available: boolean
  category?: ProductCategory
}

export interface FlavorCategory {
  id: string
  name: string
  slug: string
  max_selections: number
  is_required: boolean
  extra_price: number
  applies_to: string
  sort_order: number
}

export interface Flavor {
  id: string
  name: string
  category_id: string
  extra_price: number
  available: boolean
  sort_order: number
  category?: FlavorCategory
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedFlavors: Flavor[]
  totalPrice: number
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string | null
  total_amount: number
  status: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  flavors: string | null
}

export interface StoreSettings {
  id: string
  is_open: boolean
  open_message: string
  closed_message: string
  whatsapp: string
  updated_at: string
}
