'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface OrderItem {
  id: string
  quantity: number
  products: {
    name: string
    price: number
  }
}

interface Order {
  id: string
  customer_id: string
  pickup_location: string
  delivery_location: string
  dropoff_zone: string
  items: string
  total_amount: number
  total_price: number
  delivery_fee: number
  status: string
  created_at: string
  order_items: OrderItem[]
}

export default function MyOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    initializePage()
  }, [])

  const initializePage = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    setUser(currentUser)
    await fetchOrders(currentUser.id)
  }

  const fetchOrders = async (userId: string) => {
    setLoading(true)
    try {
      // Fetch orders with order_items and products joined
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            products (
              name,
              price
            )
          )
        `)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        return
      }

      console.log('📦 Fetched orders with items:', data)
      setOrders(data as Order[] || [])
    } catch (error) {
      console.error('Error in fetchOrders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-blue-100 text-blue-800'
      case 'picked_up':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'pending':
        return '🔍'
      case 'accepted':
        return '🚶'
      case 'picked_up':
        return '📦'
      case 'delivered':
        return '✅'
      default:
        return '❓'
    }
  }

  const formatOrderItems = (orderItems: OrderItem[]) => {
    if (!orderItems || orderItems.length === 0) {
      return 'No items'
    }
    
    return orderItems
      .map(item => `${item.products.name} x${item.quantity}`)
      .join(', ')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          <p className="text-xl mb-2">No orders yet</p>
          <p className="text-sm">Your order history will appear here</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/order/${order.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()} at{' '}
                    {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusEmoji(order.status)} {order.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-gray-600">📍 From:</span>
                  <span className="font-medium">{order.pickup_location || 'Not specified'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-600">📍 To:</span>
                  <span className="font-medium">{order.dropoff_zone || order.delivery_location || 'Not specified'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-600">☕ Items:</span>
                  <span className="font-medium">{formatOrderItems(order.order_items)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold">
                    HK${order.total_amount || order.total_price || 0}
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/order/${order.id}`)
                  }}
                >
                  Track Order →
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}