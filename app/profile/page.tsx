'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser, getUserProfile } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [editing, setEditing] = useState(false)
  
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [college, setCollege] = useState('')

  useEffect(() => {
    loadProfile()
    loadOrders()
  }, [])

  const loadProfile = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    setUser(currentUser)
    const userProfile = await getUserProfile(currentUser.id)
    setProfile(userProfile)
    setFullName(userProfile.full_name)
    setPhone(userProfile.phone || '')
    setCollege(userProfile.college || '')
  }

  const loadOrders = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser) return

    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        campus_zones(name)
      `)
      .eq('customer_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) setOrders(data)
  }

  const handleUpdateProfile = async () => {
    const { error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        phone,
        college
      })
      .eq('id', user.id)

    if (!error) {
      alert('Profile updated!')
      setEditing(false)
      loadProfile()
    } else {
      alert('Error updating profile: ' + error.message)
    }
  }

  if (!profile) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Personal Information</h2>
          <Button
            variant="outline"
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label>College</Label>
              <Input
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />
            </div>
            <Button onClick={handleUpdateProfile}>
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold">{profile.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Student ID</p>
              <p className="font-semibold">{profile.student_id}</p>
            </div>
            {profile.phone && (
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{profile.phone}</p>
              </div>
            )}
            {profile.college && (
              <div>
                <p className="text-sm text-gray-600">College</p>
                <p className="font-semibold">{profile.college}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-semibold capitalize">{profile.role}</p>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Recent Orders</h2>
        
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="border rounded p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/order/${order.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">
                    Order #{order.id.slice(0, 8)}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>📍 {order.campus_zones.name}</p>
                  <p>💰 ${order.total_amount}</p>
                  <p>📅 {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}