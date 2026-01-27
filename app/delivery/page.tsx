'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  pickup_location: string
  delivery_location: string
  items: string
  total_price: number
  status: string
  created_at: string
  delivery_partner_lat?: number
  delivery_partner_lng?: number
}

export default function DeliveryPage() {
  const [user, setUser] = useState<any>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [availableOrders, setAvailableOrders] = useState<Order[]>([])
  const [myOrders, setMyOrders] = useState<Order[]>([])
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Check authentication
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUser(user)
    }
    checkUser()
  }, [])

  // Fetch available orders
  const fetchAvailableOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (!error && data) {
      setAvailableOrders(data)
    }
  }

  // Fetch my orders
  const fetchMyOrders = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('delivery_partner_id', user.id)
      .in('status', ['accepted', 'picked_up'])
      .order('created_at', { ascending: true })

    if (!error && data) {
      setMyOrders(data)
    }
  }

  // Fetch orders when online status changes
  useEffect(() => {
    if (isOnline && user) {
      fetchAvailableOrders()
      fetchMyOrders()

      const interval = setInterval(() => {
        fetchAvailableOrders()
        fetchMyOrders()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isOnline, user])

  // Accept order
  const acceptOrder = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({
        delivery_partner_id: user.id,
        status: 'accepted'
      })
      .eq('id', orderId)

    if (!error) {
      fetchAvailableOrders()
      fetchMyOrders()
    }
  }

  // Mark as picked up
  const markAsPickedUp = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'picked_up' })
      .eq('id', orderId)

    if (!error) {
      fetchMyOrders()
    }
  }

  // Mark as delivered
  const markAsDelivered = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'delivered' })
      .eq('id', orderId)

    if (!error) {
      fetchMyOrders()
    }
  }

  // 🧪 LOCATION TRACKING WITH ULTRA FAST TESTING MODE
  useEffect(() => {
    if (!isOnline || myOrders.length === 0) return

    // 🧪 TESTING MODE - Set to true for testing without being on campus
    const TESTING_MODE = true

    if (TESTING_MODE) {
      console.log('🧪 TESTING MODE ENABLED: ULTRA FAST delivery simulation')
      console.log('📦 Active orders:', myOrders.length)
      console.log('⚡ SPEED MODE: Complete route in 30 SECONDS!')
      console.log('📍 Updates every 2 seconds (15 steps × 2s = 30s)')
      
      let step = 0
      
      // Compact route: 15 waypoints × 2 seconds = 30 seconds total
      const simulatedPath = [
        // Phase 1: Medical Building → Café (5 steps = 10 seconds)
        { lat: 22.41952, lng: 114.20545, name: '🏥 Medical Building START', phase: 'heading_to_pickup' },
        { lat: 22.41920, lng: 114.20520, name: '🚶💨 Fast walking', phase: 'heading_to_pickup' },
        { lat: 22.41890, lng: 114.20500, name: '🚶💨 Rushing', phase: 'heading_to_pickup' },
        { lat: 22.41865, lng: 114.20483, name: '🚶💨 Almost there', phase: 'heading_to_pickup' },
        { lat: 22.418461, lng: 114.204712, name: '☕ AT CAFÉ - PICKUP!', phase: 'at_pickup' },
        
        // Phase 2: Café → New Asia (10 steps = 20 seconds)
        { lat: 22.418461, lng: 114.204712, name: '📦 PICKED UP - GO!', phase: 'heading_to_customer' },
        { lat: 22.41900, lng: 114.20600, name: '🚶💨 Speed walking', phase: 'heading_to_customer' },
        { lat: 22.41940, lng: 114.20700, name: '🚶💨 Fast pace', phase: 'heading_to_customer' },
        { lat: 22.41980, lng: 114.20760, name: '🚶💨 Rushing', phase: 'heading_to_customer' },
        { lat: 22.42020, lng: 114.20820, name: '🚶💨 Quick steps', phase: 'heading_to_customer' },
        { lat: 22.42050, lng: 114.20860, name: '🚶💨 Nearly there', phase: 'heading_to_customer' },
        { lat: 22.42080, lng: 114.20890, name: '🚶💨 Final sprint', phase: 'heading_to_customer' },
        { lat: 22.42100, lng: 114.20905, name: '🚶💨 Almost arrived', phase: 'heading_to_customer' },
        { lat: 22.42115, lng: 114.20915, name: '🚶💨 At entrance', phase: 'heading_to_customer' },
        { lat: 22.421197, lng: 114.209186, name: '🎯 ARRIVED NEW ASIA!', phase: 'at_customer' },
      ]

      console.log('🗺️ Route: 15 waypoints')
      console.log('   Phase 1: Medical → Café (5 steps, 10s)')
      console.log('   Phase 2: Café → New Asia (10 steps, 20s)')

      // Get current order status
      const currentOrderStatus = myOrders[0]?.status || 'accepted'
      
      let startStep = 0
      if (currentOrderStatus === 'picked_up') {
        startStep = 5
        console.log('📦 Starting from CAFÉ (picked up)')
      } else {
        startStep = 0
        console.log('🏥 Starting from MEDICAL BUILDING')
      }

      const updateInterval = setInterval(async () => {
        const currentStep = (startStep + step) % simulatedPath.length
        const currentLocation = simulatedPath[currentStep]
        
        const timeElapsed = step * 2
        const timeRemaining = (simulatedPath.length - step - 1) * 2
        
        console.log('')
        console.log(`⚡ Step ${step + 1}/${simulatedPath.length} [${timeElapsed}s elapsed, ${timeRemaining}s remaining]`)
        console.log(`📍 ${currentLocation.name}`)
        console.log(`   ${currentLocation.lat}, ${currentLocation.lng}`)

        // Update location in database
        for (const order of myOrders) {
          const { error } = await supabase
            .from('orders')
            .update({
              delivery_partner_lat: currentLocation.lat,
              delivery_partner_lng: currentLocation.lng,
              last_location_update: new Date().toISOString()
            })
            .eq('id', order.id)

          if (error) {
            console.error('   ❌ Error:', error)
          } else {
            console.log(`   ✅ Updated order #${order.id.slice(0, 8)}`)
            
            if (currentLocation.phase === 'at_pickup') {
              console.log('   💡 Click "Mark as Picked Up" NOW!')
            } else if (currentLocation.phase === 'at_customer') {
              console.log('   💡 Click "Mark as Delivered" NOW!')
            }
          }
        }

        step++
      }, 2000) // Update every 2 SECONDS (fast!)

      return () => {
        console.log('🛑 Stopping simulation')
        clearInterval(updateInterval)
      }
    }

    // REAL GPS MODE (for production use)
    if (!navigator.geolocation) {
      console.warn('⚠️ Geolocation not supported')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        for (const order of myOrders) {
          await supabase
            .from('orders')
            .update({
              delivery_partner_lat: latitude,
              delivery_partner_lng: longitude,
              last_location_update: new Date().toISOString()
            })
            .eq('id', order.id)
        }
      },
      (error) => {
        console.error('Location error:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [isOnline, myOrders])

  if (!user) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Delivery Partner Dashboard</h1>

        {/* Online Toggle */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Status</h2>
              <p className="text-gray-600">
                {isOnline ? '🟢 Online - Accepting orders' : '🔴 Offline'}
              </p>
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-6 py-3 rounded-lg font-semibold ${
                isOnline
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Testing Mode Banner */}
        {isOnline && myOrders.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
            <p className="font-semibold text-green-900">⚡ ULTRA FAST Testing Mode Active</p>
            <p className="text-sm text-green-700">
              Route completes in 30 seconds • Updates every 2 seconds
            </p>
            <p className="text-xs text-green-600 mt-1">
              Watch the console for step-by-step progress! 🚀
            </p>
          </div>
        )}

        {/* My Active Orders */}
        {myOrders.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">My Active Orders</h2>
            {myOrders.map((order) => (
              <div key={order.id} className="bg-blue-50 p-6 rounded-lg shadow-md mb-4 border-2 border-blue-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-lg">{order.customer_name}</p>
                    <p className="text-gray-600">{order.customer_phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'accepted' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'
                  }`}>
                    {order.status === 'accepted' ? '📍 Heading to pickup' : '📦 Heading to customer'}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Pickup: <span className="font-semibold">{order.pickup_location}</span></p>
                  <p className="text-sm text-gray-600">Deliver to: <span className="font-semibold">{order.delivery_location}</span></p>
                  <p className="text-sm text-gray-600 mt-2">Items: {order.items}</p>
                  <p className="text-lg font-bold mt-2">HK${order.total_price}</p>
                </div>
                <div className="flex gap-2">
                  {order.status === 'accepted' && (
                    <button
                      onClick={() => markAsPickedUp(order.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      ✅ Mark as Picked Up
                    </button>
                  )}
                  {order.status === 'picked_up' && (
                    <button
                      onClick={() => markAsDelivered(order.id)}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      🎯 Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Available Orders */}
        {isOnline && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Available Orders</h2>
            {availableOrders.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                No orders available right now
              </div>
            ) : (
              availableOrders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-lg shadow-md mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold text-lg">{order.customer_name}</p>
                      <p className="text-gray-600">{order.customer_phone}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-700">
                      New Order
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Pickup: <span className="font-semibold">{order.pickup_location}</span></p>
                    <p className="text-sm text-gray-600">Deliver to: <span className="font-semibold">{order.delivery_location}</span></p>
                    <p className="text-sm text-gray-600 mt-2">Items: {order.items}</p>
                    <p className="text-lg font-bold mt-2">HK${order.total_price}</p>
                  </div>
                  <button
                    onClick={() => acceptOrder(order.id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Accept Order
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}