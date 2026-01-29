'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { Product, CartItem, CampusZone } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, ShoppingCart, Coffee, Leaf, Cookie } from 'lucide-react'

export default function MenuPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [zones, setZones] = useState<CampusZone[]>([])
  const [selectedZone, setSelectedZone] = useState('')
  const [dropoffDetails, setDropoffDetails] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'fps' | 'payme'>('cash')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchZones()
    checkUser()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      router.push('/auth/login')
    } else {
      setUser(currentUser)
    }
  }

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('category')
    
    if (data) setProducts(data)
  }

  const fetchZones = async () => {
    const { data } = await supabase
      .from('campus_zones')
      .select('*')
      .order('walk_time_minutes')
    
    if (data) setZones(data)
  }

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id)
    if (existing) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    const existing = cart.find(item => item.product.id === productId)
    if (existing && existing.quantity > 1) {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ))
    } else {
      setCart(cart.filter(item => item.product.id !== productId))
    }
  }

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  }

  const getDeliveryFee = () => {
    const zone = zones.find(z => z.code === selectedZone)
    return zone ? zone.delivery_fee : 0
  }

  const handlePlaceOrder = async () => {
    if (!selectedZone) {
      alert('Please select a delivery location')
      return
    }
    if (cart.length === 0) {
      alert('Your cart is empty')
      return
    }
    if (!user) {
      alert('Please log in first')
      router.push('/auth/login')
      return
    }

    setLoading(true)

    try {
      const subtotal = getCartTotal()
      const deliveryFee = getDeliveryFee()
      const total = subtotal + deliveryFee

      // Create order - ONLY use fields that exist in your database
      const orderInsert = {
        customer_id: user.id,
        pickup_location: 'STUDENT_CAFE',
        dropoff_zone: selectedZone,
        dropoff_details: dropoffDetails.trim() || null,
        subtotal: Number(subtotal),
        delivery_fee: Number(deliveryFee),
        total_amount: Number(total),
        payment_method: paymentMethod,
        status: 'pending' as const,
        payment_status: 'pending' as const
      }

      console.log('Inserting order:', orderInsert)

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(orderInsert)
        .select()
        .single()

      if (orderError) {
        console.error('Order error:', orderError)
        throw orderError
      }

      console.log('✅ Order created:', orderData)

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: Number(item.product.price),
        subtotal: Number(item.product.price * item.quantity)
      }))

      console.log('Inserting order items:', orderItems)

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Items error:', itemsError)
        throw itemsError
      }

      console.log('✅ Order items created')

      // Clear cart and redirect
      setCart([])
      setSelectedZone('')
      setDropoffDetails('')
      alert('Order placed successfully! 🎉')
      router.push(`/order/${orderData.id}`)
    } catch (error: any) {
      console.error('Full error:', error)
      alert('Error placing order: ' + (error.message || error.hint || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coffee': return <Coffee className="w-5 h-5" />
      case 'tea': return <Leaf className="w-5 h-5" />
      case 'food': return <Cookie className="w-5 h-5" />
      default: return null
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Menu</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Products Grid */}
        <div className="lg:col-span-2">
          {products.length === 0 ? (
            <p className="text-gray-500">Loading products...</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {products.map(product => (
                <Card key={product.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(product.category)}
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                    <Badge variant="secondary">${product.price}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromCart(product.id)}
                      disabled={!cart.find(i => i.product.id === product.id)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {cart.find(i => i.product.id === product.id)?.quantity || 0}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div>
          <Card className="p-6 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Your Order</h2>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div>
                    <Label htmlFor="zone">Delivery Location *</Label>
                    <select
                      id="zone"
                      className="w-full mt-1 p-2 border rounded"
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                    >
                      <option value="">Select location...</option>
                      {zones.map(zone => (
                        <option key={zone.code} value={zone.code}>
                          {zone.name} (+${zone.delivery_fee})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="details">Room/Details (Optional)</Label>
                    <Input
                      id="details"
                      placeholder="e.g., Room 301, near elevator"
                      value={dropoffDetails}
                      onChange={(e) => setDropoffDetails(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="payment">Payment Method</Label>
                    <select
                      id="payment"
                      className="w-full mt-1 p-2 border rounded"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                    >
                      <option value="cash">Cash on Delivery</option>
                      <option value="fps">FPS (Faster Payment)</option>
                      <option value="payme">PayMe</option>
                    </select>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${getDeliveryFee().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${(getCartTotal() + getDeliveryFee()).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={loading || !selectedZone}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}