// lib/types.ts
export interface User {
  id: string
  email: string
  student_id: string
  full_name: string
  phone: string | null
  college: string | null
  role: 'customer' | 'delivery' | 'admin'
  rating: number
  total_deliveries: number
  is_online: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: 'coffee' | 'tea' | 'food' | 'other'
  image_url: string | null
  is_available: boolean
  created_at: string
}

export interface CampusZone {
  code: string
  name: string
  walk_time_minutes: number
  delivery_fee: number
  latitude?: number
  longitude?: number
}

export interface Order {
  id: string
  customer_id: string
  delivery_partner_id: string | null
  pickup_location: string
  dropoff_zone: string
  dropoff_details: string | null
  subtotal: number
  delivery_fee: number
  total_amount: number
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled'
  payment_method: 'cash' | 'fps' | 'payme'
  payment_status: 'pending' | 'paid' | 'refunded'
  payment_proof_url: string | null
  created_at: string
  accepted_at: string | null
  delivered_at: string | null
  customer_rating: number | null
  delivery_rating: number | null
  customer_feedback: string | null
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface CartItem {
  product: Product
  quantity: number
}