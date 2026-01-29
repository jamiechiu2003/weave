'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const DeliveryMap = dynamic(() => import('@/components/DeliveryMap'), { ssr: false })

interface OrderItem {
  id: string
  quantity: number
  unit_price: number
  products: {
    name: string
    price: number
  }
}

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  pickup_location: string
  delivery_location: string
  dropoff_zone: string
  items: string
  total_price: number
  total_amount: number
  status: string
  created_at: string
  delivery_partner_lat?: number
  delivery_partner_lng?: number
  order_items: OrderItem[]
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [order, setOrder] = useState<Order | null>(null)

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          products (
            name,
            price
          )
        )
      `)
      .eq('id', resolvedParams.id)
      .single()

    if (error) {
      console.error('❌ Error fetching order:', error)
      return
    }

    if (data) {
      console.log('📦 Full order data with items:', data)
      setOrder(data as Order)
    }
  }

  useEffect(() => {
    fetchOrder()
    
    const channel = supabase
      .channel(`order-${resolvedParams.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${resolvedParams.id}`
        },
        (payload) => {
          console.log('🔔 Real-time update:', payload.new)
          setOrder(prev => prev ? { ...prev, ...payload.new } : null)
        }
      )
      .subscribe()

    // 🧪 TESTING MODE: Refresh every 1 SECOND for fast testing
    const TESTING_MODE = true
    const refreshInterval = TESTING_MODE ? 1000 : 10000 // 1s in test, 10s in production
    
    console.log(`⚡ Refresh mode: Every ${refreshInterval / 1000} second(s)`)
    
    const interval = setInterval(() => {
      fetchOrder()
    }, refreshInterval)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [resolvedParams.id])

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            Loading order...
          </div>
        </div>
      </div>
    )
  }

  const getStatusInfo = () => {
    switch (order.status) {
      case 'pending':
        return { text: 'Finding delivery partner...', color: 'bg-yellow-100 text-yellow-800', emoji: '🔍' }
      case 'accepted':
        return { text: 'Partner heading to pickup', color: 'bg-blue-100 text-blue-800', emoji: '🚶' }
      case 'picked_up':
        return { text: 'On the way to you!', color: 'bg-purple-100 text-purple-800', emoji: '📦' }
      case 'delivered':
        return { text: 'Delivered!', color: 'bg-green-100 text-green-800', emoji: '✅' }
      default:
        return { text: 'Unknown status', color: 'bg-gray-100 text-gray-800', emoji: '❓' }
    }
  }

  const statusInfo = getStatusInfo()

  // Get the delivery location (try both fields)
  const deliveryLocation = order.delivery_location || order.dropoff_zone || 'Not specified'
  
  // Get the total price (try both fields)
  const totalPrice = order.total_amount || order.total_price || 0

  // Format order items for display
  const formatOrderItems = () => {
    if (!order.order_items || order.order_items.length === 0) {
      return 'No items listed'
    }
    
    return order.order_items
      .map(item => `${item.quantity}x ${item.products.name}`)
      .join(', ')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>

        {/* Testing Mode Banner */}
        <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
          <p className="font-semibold text-green-900">⚡ ULTRA FAST Testing Mode</p>
          <p className="text-sm text-green-700">
            Route completes in 30 seconds • Map refreshes every 1 second
          </p>
          <p className="text-xs text-green-600 mt-1">
            Watch the blue marker zoom across campus! 🚀
          </p>
        </div>

        {/* Status Banner */}
        <div className={`p-4 rounded-lg mb-6 ${statusInfo.color}`}>
          <p className="text-xl font-semibold">
            {statusInfo.emoji} {statusInfo.text}
          </p>
        </div>

        {/* Map - Show when order is accepted or picked up */}
        {(order.status === 'accepted' || order.status === 'picked_up') && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Live Tracking</h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <DeliveryMap
                deliveryPartnerLocation={
                  order.delivery_partner_lat && order.delivery_partner_lng
                    ? {
                        lat: order.delivery_partner_lat,
                        lng: order.delivery_partner_lng
                      }
                    : null
                }
                pickupLocation={order.pickup_location || 'CUHK Café'}
                deliveryLocation={deliveryLocation}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              📍 Last updated: {order.delivery_partner_lat && order.delivery_partner_lng ? 'Just now' : 'Waiting for first update...'}
            </p>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Order Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                order.status !== 'pending' ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}>
                {order.status !== 'pending' ? '✓' : '1'}
              </div>
              <div>
                <p className="font-semibold">Order Placed</p>
                <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                order.status === 'accepted' || order.status === 'picked_up' || order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}>
                {order.status === 'accepted' || order.status === 'picked_up' || order.status === 'delivered' ? '✓' : '2'}
              </div>
              <div>
                <p className="font-semibold">Partner Assigned</p>
                <p className="text-sm text-gray-600">
                  {order.status !== 'pending' ? 'Partner on the way to pickup' : 'Waiting for partner...'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                order.status === 'picked_up' || order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}>
                {order.status === 'picked_up' || order.status === 'delivered' ? '✓' : '3'}
              </div>
              <div>
                <p className="font-semibold">Order Picked Up</p>
                <p className="text-sm text-gray-600">
                  {order.status === 'picked_up' || order.status === 'delivered' ? 'On the way to you!' : 'Not yet picked up'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}>
                {order.status === 'delivered' ? '✓' : '4'}
              </div>
              <div>
                <p className="font-semibold">Delivered</p>
                <p className="text-sm text-gray-600">
                  {order.status === 'delivered' ? 'Order completed!' : 'Not yet delivered'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details - Now with actual items */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-medium">{order.id.slice(0, 8)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Pickup Location</p>
              <p className="font-medium">{order.pickup_location || 'Not specified'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Delivery Location</p>
              <p className="font-medium">{deliveryLocation}</p>
            </div>
            
            <div className="border-t pt-3">
              <p className="text-sm text-gray-600 mb-2">Items Ordered</p>
              {order.order_items && order.order_items.length > 0 ? (
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-blue-600">{item.quantity}x</span>
                        <span className="font-medium">{item.products.name}</span>
                      </div>
                      <span className="text-gray-600">HK${(item.quantity * item.unit_price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No items listed</p>
              )}
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold text-blue-600">HK${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}