'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface DeliveryMapProps {
  deliveryPartnerLocation?: {
    lat: number
    lng: number
  } | null
  pickupLocation: string
  deliveryLocation: string
}

// Location coordinates for CUHK locations
const LOCATIONS: { [key: string]: { lat: number; lng: number } } = {
  'CUHK Café': { lat: 22.418461, lng: 114.204712 },
  'New Asia College': { lat: 22.421197, lng: 114.209186 },
  'Shaw College': { lat: 22.419234, lng: 114.207789 },
  'United College': { lat: 22.418976, lng: 114.206543 },
  'Chung Chi College': { lat: 22.414567, lng: 114.208901 },
  'Medical Building': { lat: 22.41952, lng: 114.20545 },
}

export default function DeliveryMap({ deliveryPartnerLocation, pickupLocation, deliveryLocation }: DeliveryMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const deliveryPartnerMarkerRef = useRef<L.Marker | null>(null)
  const pickupMarkerRef = useRef<L.Marker | null>(null)
  const deliveryMarkerRef = useRef<L.Marker | null>(null)
  const routeLayerRef = useRef<L.Polyline | null>(null)
  const decoratorLayerRef = useRef<any>(null)
  const [routeDistance, setRouteDistance] = useState<number | null>(null)
  const [routeDuration, setRouteDuration] = useState<number | null>(null)

  // Fetch walking route from OSRM
  const fetchWalkingRoute = async (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => {
    try {
      // Using OSRM (Open Source Routing Machine) for walking directions
      const url = `https://router.project-osrm.org/route/v1/foot/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
      
      const response = await fetch(url)
      const data = await response.json()

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0]
        const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]) // Convert [lng, lat] to [lat, lng]
        
        // Get distance and duration
        const distanceInMeters = route.distance
        const durationInSeconds = route.duration
        
        setRouteDistance(distanceInMeters)
        setRouteDuration(durationInSeconds)
        
        return coordinates
      }
    } catch (error) {
      console.error('Error fetching route:', error)
    }
    
    // Fallback to straight line if routing fails
    return [[start.lat, start.lng], [end.lat, end.lng]]
  }

  useEffect(() => {
    if (!mapContainerRef.current) return
    
    // Don't initialize map if delivery partner location is not available
    if (!deliveryPartnerLocation?.lat || !deliveryPartnerLocation?.lng) {
      console.log('Waiting for delivery partner location...')
      return
    }

    // Get coordinates for pickup and delivery locations
    const pickupCoords = LOCATIONS[pickupLocation] || LOCATIONS['CUHK Café']
    const deliveryCoords = LOCATIONS[deliveryLocation] || LOCATIONS['New Asia College']

    // Initialize map centered on delivery location
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [deliveryCoords.lat, deliveryCoords.lng],
        15
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)
    }

    // Create custom icons
    const deliveryPartnerIcon = L.divIcon({
      html: '<div style="background-color: #3B82F6; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">🚶</div>',
      className: 'custom-div-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    })

    const pickupIcon = L.divIcon({
      html: '<div style="background-color: #F59E0B; width: 35px; height: 35px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">☕</div>',
      className: 'custom-div-icon',
      iconSize: [35, 35],
      iconAnchor: [17.5, 17.5],
    })

    const deliveryIcon = L.divIcon({
      html: '<div style="background-color: #10B981; width: 35px; height: 35px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">🏠</div>',
      className: 'custom-div-icon',
      iconSize: [35, 35],
      iconAnchor: [17.5, 17.5],
    })

    // Update or create delivery partner marker
    if (deliveryPartnerMarkerRef.current) {
      deliveryPartnerMarkerRef.current.setLatLng([deliveryPartnerLocation.lat, deliveryPartnerLocation.lng])
    } else {
      deliveryPartnerMarkerRef.current = L.marker(
        [deliveryPartnerLocation.lat, deliveryPartnerLocation.lng],
        { icon: deliveryPartnerIcon }
      )
        .addTo(mapRef.current)
        .bindPopup('Delivery Partner 🚶')
    }

    // Update or create pickup marker
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setLatLng([pickupCoords.lat, pickupCoords.lng])
    } else {
      pickupMarkerRef.current = L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon })
        .addTo(mapRef.current)
        .bindPopup(`Pickup: ${pickupLocation}`)
    }

    // Update or create delivery marker
    if (deliveryMarkerRef.current) {
      deliveryMarkerRef.current.setLatLng([deliveryCoords.lat, deliveryCoords.lng])
    } else {
      deliveryMarkerRef.current = L.marker([deliveryCoords.lat, deliveryCoords.lng], { icon: deliveryIcon })
        .addTo(mapRef.current)
        .bindPopup(`Delivery: ${deliveryLocation}`)
    }

    // Draw walking route from delivery partner to delivery location
    const drawRoute = async () => {
      // Check if map still exists
      if (!mapRef.current) {
        console.log('⚠️ Map not initialized, skipping route draw')
        return
      }

      const routeCoordinates = await fetchWalkingRoute(
        deliveryPartnerLocation,
        deliveryCoords
      )

      // Check again after async operation
      if (!mapRef.current) {
        console.log('⚠️ Map was destroyed during route fetch')
        return
      }

      // Remove old route and decorator if exists
      if (routeLayerRef.current && mapRef.current) {
        try {
          mapRef.current.removeLayer(routeLayerRef.current)
        } catch (e) {
          console.log('Could not remove old route layer')
        }
      }
      if (decoratorLayerRef.current && mapRef.current) {
        try {
          mapRef.current.removeLayer(decoratorLayerRef.current)
        } catch (e) {
          console.log('Could not remove old decorator layer')
        }
      }

      // Draw new route
      routeLayerRef.current = L.polyline(routeCoordinates, {
        color: '#3B82F6',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(mapRef.current)

      // Try to add arrow decorators (optional - will fail gracefully if library not loaded)
      try {
        if ((L as any).polylineDecorator) {
          decoratorLayerRef.current = (L as any).polylineDecorator(routeLayerRef.current, {
            patterns: [
              {
                offset: 25,
                repeat: 100,
                symbol: (L.Symbol as any).arrowHead({
                  pixelSize: 12,
                  polygon: false,
                  pathOptions: { stroke: true, color: '#3B82F6', weight: 3 }
                })
              }
            ]
          })
          decoratorLayerRef.current.addTo(mapRef.current)
        }
      } catch (error) {
        console.log('Arrow decorators not available (optional feature)')
      }

      // Fit map to show all markers and route
      if (mapRef.current && deliveryPartnerMarkerRef.current && pickupMarkerRef.current && deliveryMarkerRef.current && routeLayerRef.current) {
        try {
          const group = L.featureGroup([
            deliveryPartnerMarkerRef.current,
            pickupMarkerRef.current,
            deliveryMarkerRef.current,
            routeLayerRef.current,
          ])
          mapRef.current.fitBounds(group.getBounds().pad(0.1))
        } catch (e) {
          console.log('Could not fit bounds')
        }
      }
    }

    drawRoute()

    return () => {
      // Don't remove map on cleanup, just clean up layers
      if (routeLayerRef.current && mapRef.current) {
        try {
          mapRef.current.removeLayer(routeLayerRef.current)
        } catch (e) {
          // Layer already removed
        }
      }
      if (decoratorLayerRef.current && mapRef.current) {
        try {
          mapRef.current.removeLayer(decoratorLayerRef.current)
        } catch (e) {
          // Layer already removed
        }
      }
    }
  }, [deliveryPartnerLocation, pickupLocation, deliveryLocation])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Show loading state if no delivery partner location
  if (!deliveryPartnerLocation?.lat || !deliveryPartnerLocation?.lng) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Waiting for delivery partner location...</p>
          <p className="text-sm text-gray-500 mt-2">Map will appear once tracking starts</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
      
      {/* Route info overlay */}
      {routeDistance !== null && routeDuration !== null && (
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
          <div className="text-sm font-semibold text-gray-700">Walking Route</div>
          <div className="text-xs text-gray-600 mt-1">
            📏 {(routeDistance / 1000).toFixed(2)} km
          </div>
          <div className="text-xs text-gray-600">
            ⏱️ ~{Math.round(routeDuration / 60)} min
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-lg shadow-lg z-[1000] text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Delivery Partner</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
          <span>Pickup Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Delivery Location</span>
        </div>
      </div>
    </div>
  )
}