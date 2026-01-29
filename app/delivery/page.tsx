'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser, getUserProfile } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

interface PendingOrder {
  id: string
  dropoff_zone: string
  total_amount: number
  delivery_fee: number
  created_at: string
  campus_zones: {
    name: string
    walk_time_minutes: number
  }
}

export default function DeliveryPartnerPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([])
  const [myOrders, setMyOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')

  useEffect(() => {
    initializeDeliveryPartner()
  }, [])

  // 🧪 LOCATION TRACKING WITH TESTING MODE
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

    // REAL GPS MODE (existing code stays the same)
    if (!navigator.geolocation) {
      console.warn('⚠️ Geolocation not supported')
      return
    }

    console.log('📡 REAL GPS MODE: Starting location tracking')
    console.log('📦 Tracking', myOrders.length, 'active orders')

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        console.log('📍 GPS location:', latitude, longitude)
        
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

        setLocationPermission('granted')
      },
      (error) => {
        console.error('GPS error:', error)
        if (error.code === 1) setLocationPermission('denied')
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    )

    return () => {
      console.log('🛑 Stopping GPS tracking')
      navigator.geolocation.clearWatch(watchId)
    }
  }, [isOnline, myOrders])

  const initializeDeliveryPartner = async () => {
    setLoading(true)
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    setUser(currentUser)
    
    try {
      const userProfile = await getUserProfile(currentUser.id)
      setProfile(userProfile)

      if (userProfile.role !== 'delivery') {
        const confirmRole = confirm('Do you want to become a delivery partner?')
        if (confirmRole) {
          await supabase
            .from('users')
            .update({ role: 'delivery' })
            .eq('id', currentUser.id)
          
          const updatedProfile = { ...userProfile, role: 'delivery' }
          setProfile(updatedProfile)
        } else {
          router.push('/menu')
          return
        }
      }

      setIsOnline(userProfile.is_online || false)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleOnline = async () => {
    if (!user) return
    
    const newStatus = !isOnline
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_online: newStatus })
        .eq('id', user.id)
      
      if (error) throw error
      
      setIsOnline(newStatus)
      
      if (newStatus) {
        console.log('🟢 Going ONLINE - will start tracking location when order is accepted')
        fetchPendingOrders()
        fetchMyOrders()
      } else {
        console.log('⚫ Going OFFLINE - location tracking will stop')
      }
    } catch (error) {
      console.error('Error toggling online status:', error)
    }
  }

  const fetchPendingOrders = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, campus_zones(name, walk_time_minutes)')
        .eq('status', 'pending')
        .is('delivery_partner_id', null)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching pending orders:', error)
        return
      }

      setPendingOrders(data as any || [])
    } catch (error) {
      console.error('Error in fetchPendingOrders:', error)
    }
  }

  const fetchMyOrders = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, campus_zones(name, walk_time_minutes)')
        .eq('delivery_partner_id', user.id)
        .in('status', ['accepted', 'preparing', 'ready', 'picked_up'])
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching my orders:', error)
        return
      }

      console.log('📦 My active orders:', data?.length || 0)
      setMyOrders(data || [])
    } catch (error) {
      console.error('Error in fetchMyOrders:', error)
    }
  }

  const acceptOrder = async (orderId: string) => {
    if (!user) return

    console.log('🎯 Accepting order:', orderId)

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          delivery_partner_id: user.id,
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .is('delivery_partner_id', null)

      if (error) {
        console.error('Error accepting order:', error)
        alert('Failed to accept order: ' + error.message)
        return
      }

      console.log('✅ Order accepted successfully!')
      console.log('📍 Location tracking will start in 5 seconds...')
      alert('Order accepted! ✅')
      fetchPendingOrders()
      fetchMyOrders()
    } catch (error: any) {
      console.error('Error in acceptOrder:', error)
      alert('Error: ' + error.message)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    console.log('🔄 Updating order status to:', newStatus)

    const updates: any = { status: newStatus }
    if (newStatus === 'delivered') {
      updates.delivered_at = new Date().toISOString()
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .eq('delivery_partner_id', user.id)

      if (error) {
        console.error('Error updating order:', error)
        alert('Failed to update order: ' + error.message)
        return
      }

      console.log('✅ Order status updated!')
      alert(`Order marked as ${newStatus}! ✅`)
      fetchMyOrders()
    } catch (error: any) {
      console.error('Error in updateOrderStatus:', error)
      alert('Error: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Error loading profile. Please refresh.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Delivery Partner Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <Label htmlFor="online-toggle">
            {isOnline ? '🟢 Online' : '⚫ Offline'}
          </Label>
          <button
            id="online-toggle"
            onClick={toggleOnline}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isOnline ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isOnline ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Testing Mode Indicator */}
      {isOnline && myOrders.length > 0 && (
        <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
          <p className="text-blue-800 font-semibold">
            🧪 Testing Mode Active
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Route: Medical Building → Café (pickup) → New Asia Canteen (delivery)
          </p>
          <p className="text-sm text-blue-600">
            Check console (Cmd+Option+J) to see location updates every 5 seconds.
          </p>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Deliveries</p>
          <p className="text-2xl font-bold">{profile.total_deliveries || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Rating</p>
          <p className="text-2xl font-bold">⭐ {Number(profile.rating || 5).toFixed(1)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active Orders</p>
          <p className="text-2xl font-bold">{myOrders.length}</p>
        </Card>
      </div>

      {myOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">My Active Orders</h2>
          <div className="space-y-4">
            {myOrders.map(order => (
              <Card key={order.id} className="p-4 border-2 border-blue-300">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{order.campus_zones.name}</p>
                    <p className="text-sm text-gray-600">Order #{order.id.slice(0, 8)}</p>
                  </div>
                  <Badge className="bg-blue-600">{order.status}</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    💰 Delivery Fee: <span className="font-semibold">${order.delivery_fee}</span>
                  </p>
                  <p className="text-sm">
                    ⏱️ Est. {order.campus_zones.walk_time_minutes} min walk
                  </p>
                </div>

                <div className="flex gap-2">
                  {order.status === 'accepted' && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, 'picked_up')}>
                      Mark as Picked Up
                    </Button>
                  )}
                  {order.status === 'picked_up' && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                      Mark as Delivered
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isOnline ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Available Orders ({pendingOrders.length})
          </h2>
          
          {pendingOrders.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              <p>No pending orders at the moment</p>
              <p className="text-sm mt-2">Orders will appear here automatically!</p>
              <Button onClick={fetchPendingOrders} variant="outline" size="sm" className="mt-4">
                🔄 Refresh
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map(order => (
                <Card key={order.id} className="p-4 border-2 border-blue-200 bg-blue-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-lg">📍 {order.campus_zones.name}</p>
                      <p className="text-sm text-gray-600">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">Total: ${order.total_amount}</p>
                    </div>
                    <Badge variant="secondary" className="text-lg">
                      +${order.delivery_fee}
                    </Badge>
                  </div>

                  <p className="text-sm mb-4">
                    ⏱️ ~{order.campus_zones.walk_time_minutes} minutes walk
                  </p>

                  <Button className="w-full" size="lg" onClick={() => acceptOrder(order.id)}>
                    Accept Order 🚀
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-xl mb-2">You are currently offline</p>
          <p className="text-gray-600">Toggle online to start receiving delivery requests</p>
        </Card>
      )}
    </div>
  )
}