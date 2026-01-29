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
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  })

  useEffect(() => {
    initializeProfile()
  }, [])

  const initializeProfile = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    setUser(currentUser)

    try {
      const userProfile = await getUserProfile(currentUser.id)
      setProfile(userProfile)
      setFormData({
        full_name: userProfile.full_name || '',
        phone: userProfile.phone || '',
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleUpdateProfile = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        alert('Failed to update profile: ' + error.message)
        return
      }

      alert('Profile updated successfully! ✅')
      setEditing(false)
      initializeProfile()
    } catch (error: any) {
      console.error('Error in handleUpdateProfile:', error)
      alert('Error: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-xl mb-4">Error loading profile</p>
          <Button onClick={initializeProfile}>Retry</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                {profile.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.full_name || 'User'}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="border-t pt-6">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input value={user.email} disabled className="bg-gray-100" />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <Label>Role</Label>
                    <Input value={profile.role || 'customer'} disabled className="bg-gray-100" />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleUpdateProfile} className="flex-1">
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditing(false)
                        setFormData({
                          full_name: profile.full_name || '',
                          phone: profile.phone || '',
                        })
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Full Name</Label>
                    <p className="text-lg font-medium">{profile.full_name || 'Not set'}</p>
                  </div>

                  <div>
                    <Label className="text-gray-600">Phone Number</Label>
                    <p className="text-lg font-medium">{profile.phone || 'Not set'}</p>
                  </div>

                  <div>
                    <Label className="text-gray-600">Email</Label>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>

                  <div>
                    <Label className="text-gray-600">Role</Label>
                    <p className="text-lg font-medium capitalize">{profile.role || 'customer'}</p>
                  </div>

                  {profile.role === 'delivery' && (
                    <>
                      <div>
                        <Label className="text-gray-600">Total Deliveries</Label>
                        <p className="text-lg font-medium">{profile.total_deliveries || 0}</p>
                      </div>

                      <div>
                        <Label className="text-gray-600">Rating</Label>
                        <p className="text-lg font-medium">⭐ {Number(profile.rating || 5).toFixed(1)}</p>
                      </div>
                    </>
                  )}

                  <Button onClick={() => setEditing(true)} className="w-full mt-4">
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>

            {/* Account Stats */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Account Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-lg font-semibold">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Account Status</p>
                  <p className="text-lg font-semibold text-green-600">Active</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}