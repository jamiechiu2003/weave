// components/DeliveryMap.tsx
'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons
const cafeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const customerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface DeliveryMapProps {
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
  deliveryPartnerLat?: number
  deliveryPartnerLng?: number
  estimatedTime: number
  orderStatus: string
}

export default function DeliveryMap({
  pickupLat,
  pickupLng,
  dropoffLat,
  dropoffLng,
  deliveryPartnerLat,
  deliveryPartnerLng,
  estimatedTime,
  orderStatus
}: DeliveryMapProps) {
  const [mounted, setMounted] = useState(false)
  const [walkingRoute, setWalkingRoute] = useState<[number, number][]>([])
  const [routeDistance, setRouteDistance] = useState<number>(0)
  const [routeDuration, setRouteDuration] = useState<number>(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      calculateRoute()
    }
  }, [mounted, pickupLat, pickupLng, dropoffLat, dropoffLng, deliveryPartnerLat, deliveryPartnerLng])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const calculateRoute = () => {
    // Determine start and end points
    let startLat, startLng, endLat, endLng

    if (deliveryPartnerLat && deliveryPartnerLng && orderStatus !== 'pending') {
      startLat = deliveryPartnerLat
      startLng = deliveryPartnerLng
      endLat = dropoffLat
      endLng = dropoffLng
    } else {
      startLat = pickupLat
      startLng = pickupLng
      endLat = dropoffLat
      endLng = dropoffLng
    }

    // Campus waypoints for more realistic routing (CUHK main paths)
    const mainWaypoints = [
      { lat: 22.41849, lng: 114.20648, name: 'John Fulton Centre' },
      { lat: 22.4183, lng: 114.2082, name: 'Library Junction' },
      { lat: 22.4192, lng: 114.2074, name: 'University Mall' },
      { lat: 22.4178, lng: 114.2065, name: 'Central Avenue' },
      { lat: 22.4165, lng: 114.2055, name: 'Sports Complex' },
    ]

    // Find closest waypoint to end destination
    let closestWaypoint = mainWaypoints[0]
    let minDist = calculateDistance(endLat, endLng, closestWaypoint.lat, closestWaypoint.lng)

    mainWaypoints.forEach(wp => {
      const dist = calculateDistance(endLat, endLng, wp.lat, wp.lng)
      if (dist < minDist) {
        minDist = dist
        closestWaypoint = wp
      }
    })

    // Build route: start -> waypoint -> end
    const route: [number, number][] = []
    
    // Add intermediate points for smoother path
    const steps = 5
    
    // From start to waypoint
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps
      const lat = startLat + (closestWaypoint.lat - startLat) * ratio
      const lng = startLng + (closestWaypoint.lng - startLng) * ratio
      route.push([lat, lng])
    }

    // From waypoint to end
    for (let i = 1; i <= steps; i++) {
      const ratio = i / steps
      const lat = closestWaypoint.lat + (endLat - closestWaypoint.lat) * ratio
      const lng = closestWaypoint.lng + (endLng - closestWaypoint.lng) * ratio
      route.push([lat, lng])
    }

    setWalkingRoute(route)

    // Calculate total distance with waypoint
    const dist1 = calculateDistance(startLat, startLng, closestWaypoint.lat, closestWaypoint.lng)
    const dist2 = calculateDistance(closestWaypoint.lat, closestWaypoint.lng, endLat, endLng)
    const totalDistance = (dist1 + dist2) * 1000 // in meters

    // Add 20% for walking paths/turns
    const adjustedDistance = totalDistance * 1.2

    setRouteDistance(adjustedDistance)

    // Walking speed: ~5 km/h = 83.33 m/min
    const walkingSpeed = 83.33
    const duration = adjustedDistance / walkingSpeed

    setRouteDuration(duration)
  }

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  const centerLat = (pickupLat + dropoffLat) / 2
  const centerLng = (pickupLng + dropoffLng) / 2

  const distanceMeters = Math.round(routeDistance)
  const durationMinutes = Math.ceil(routeDuration)

  return (
    <div className="w-full">
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-600">Walking Distance</p>
          <p className="text-lg font-bold">{distanceMeters}m</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-600">Walking Time</p>
          <p className="text-lg font-bold">{durationMinutes} min</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-600">Status</p>
          <p className="text-lg font-bold capitalize">{orderStatus.replace('_', ' ')}</p>
        </div>
        {deliveryPartnerLat && deliveryPartnerLng && (
          <div className="bg-blue-50 p-3 rounded-lg shadow-sm border-2 border-blue-300">
            <p className="text-xs text-gray-600">Live ETA</p>
            <p className="text-lg font-bold text-blue-600">{durationMinutes} min</p>
          </div>
        )}
      </div>

      <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Pickup location (Café) */}
          <Marker position={[pickupLat, pickupLng]} icon={cafeIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-bold">☕ John Fulton Centre</p>
                <p className="text-xs">Rm LG05, Student Café</p>
                <p className="text-xs text-gray-500">Pickup Location</p>
              </div>
            </Popup>
          </Marker>

          {/* Dropoff location (Customer) */}
          <Marker position={[dropoffLat, dropoffLng]} icon={customerIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-bold">📍 Delivery Location</p>
                <p className="text-xs">{distanceMeters}m from café</p>
                <p className="text-xs">{durationMinutes} min walk</p>
              </div>
            </Popup>
          </Marker>

          {/* Delivery partner location */}
          {deliveryPartnerLat && deliveryPartnerLng && orderStatus !== 'pending' && (
            <>
              <Marker position={[deliveryPartnerLat, deliveryPartnerLng]} icon={deliveryIcon}>
                <Popup>
                  <div className="text-center">
                    <p className="font-bold">🚶 Delivery Partner</p>
                    <p className="text-xs">Currently on the way!</p>
                    <p className="text-xs font-semibold text-blue-600">ETA: {durationMinutes} min</p>
                  </div>
                </Popup>
              </Marker>
              
              <Circle
                center={[deliveryPartnerLat, deliveryPartnerLng]}
                radius={30}
                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
              />
            </>
          )}

          {/* Walking route */}
          {walkingRoute.length > 0 && (
            <Polyline
              positions={walkingRoute}
              pathOptions={{
                color: orderStatus === 'delivered' ? '#22c55e' : '#3b82f6',
                weight: 5,
                opacity: 0.8,
                dashArray: orderStatus === 'pending' ? '10, 10' : undefined
              }}
            />
          )}

          {/* Delivery radius */}
          <Circle
            center={[dropoffLat, dropoffLng]}
            radius={50}
            pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
          />
        </MapContainer>
      </div>

      <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Café</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Delivery Partner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Customer</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Estimated campus walking route
          </div>
        </div>
      </div>
    </div>
  )
}