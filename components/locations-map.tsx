'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api'
import { type Location } from '@/app/actions/locations'
import { Card } from '@/components/ui/card'
import { MapPin, Navigation, Map as MapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
}

// Portland default center
const defaultCenter = {
    lat: 45.5152,
    lng: -122.6784
}

interface LocationsMapProps {
    locations: Location[]
}

export function LocationsMap({ locations }: LocationsMapProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    })

    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
    const [viewState, setViewState] = useState<'default' | 'zoomed'>('default')

    const fitBounds = useCallback((mapInstance: google.maps.Map) => {
        const bounds = new google.maps.LatLngBounds()
        let hasPoints = false

        locations.forEach(location => {
            if (location.coordinates) {
                const [latStr, lngStr] = location.coordinates.split(',').map(s => s.trim())
                const lat = parseFloat(latStr)
                const lng = parseFloat(lngStr)

                if (!isNaN(lat) && !isNaN(lng)) {
                    bounds.extend({ lat, lng })
                    hasPoints = true
                }
            }
        })

        if (hasPoints) {
            mapInstance.fitBounds(bounds)
        } else {
            mapInstance.setCenter(defaultCenter)
            mapInstance.setZoom(10)
        }
    }, [locations])

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        fitBounds(map)
        setMap(map)
    }, [fitBounds])

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null)
    }, [])

    const handleLocationClick = (location: Location) => {
        if (!map || !location.coordinates) return

        const [latStr, lngStr] = location.coordinates.split(',').map(s => s.trim())
        const lat = parseFloat(latStr)
        const lng = parseFloat(lngStr)

        if (!isNaN(lat) && !isNaN(lng)) {
            map.panTo({ lat, lng })
            map.setZoom(15)
            setSelectedLocation(location)
            setViewState('zoomed')
            // Scroll map into view smoothly, centered to avoid cutting off top
            document.getElementById('map-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    const resetView = () => {
        if (map) {
            fitBounds(map)
            setViewState('default')
            setSelectedLocation(null)
        }
    }

    const findClosestLocation = () => {
        if (!navigator.geolocation || !map) {
            alert("Geolocation is not supported by your browser or map is not loaded.")
            return
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude
            const userLng = position.coords.longitude

            const closest = locations.reduce<{ loc: Location | null, dist: number }>((acc, loc) => {
                if (loc.coordinates) {
                    const [latStr, lngStr] = loc.coordinates.split(',').map(s => s.trim())
                    const lat = parseFloat(latStr)
                    const lng = parseFloat(lngStr)

                    if (!isNaN(lat) && !isNaN(lng)) {
                        const dist = Math.sqrt(Math.pow(lat - userLat, 2) + Math.pow(lng - userLng, 2))
                        if (dist < acc.dist) {
                            return { loc, dist }
                        }
                    }
                }
                return acc
            }, { loc: null, dist: Infinity }).loc

            if (closest && closest.coordinates) {
                const [latStr, lngStr] = closest.coordinates.split(',').map(s => s.trim())
                const lat = parseFloat(latStr)
                const lng = parseFloat(lngStr)

                if (!isNaN(lat) && !isNaN(lng)) {
                    map.panTo({ lat, lng })
                    map.setZoom(14)
                    setSelectedLocation(closest)
                    setViewState('zoomed')
                }
            }
        }, (err) => {
            console.error("Error getting location", err)
            alert("Could not get your location. Please check permissions.")
        })
    }


    if (!isLoaded) {
        return <div className="h-[400px] w-full bg-neutral-900 animate-pulse rounded-lg flex items-center justify-center text-neutral-500">Loading Map...</div>
    }

    return (
        <div className="space-y-8">
            <div id="map-container" className="relative group scroll-mt-24">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={defaultCenter}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        disableDefaultUI: false,
                        styles: [ // Dark mode style for map
                            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
                            { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
                            { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
                            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
                            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
                            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
                            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
                            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
                            { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
                            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
                            { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
                        ]
                    }}
                >
                    {locations.map(location => {
                        if (!location.coordinates) return null
                        const [latStr, lngStr] = location.coordinates.split(',').map(s => s.trim())
                        const lat = parseFloat(latStr)
                        const lng = parseFloat(lngStr)

                        if (isNaN(lat) || isNaN(lng)) return null

                        return (
                            <MarkerF
                                key={location.id}
                                position={{ lat, lng }}
                                onClick={() => handleLocationClick(location)}
                            />
                        )
                    })}

                    {selectedLocation && selectedLocation.coordinates && (() => {
                        const [latStr, lngStr] = selectedLocation.coordinates.split(',').map(s => s.trim())
                        const lat = parseFloat(latStr)
                        const lng = parseFloat(lngStr)

                        if (isNaN(lat) || isNaN(lng)) return null

                        return (
                            <InfoWindowF
                                position={{ lat, lng }}
                                onCloseClick={() => setSelectedLocation(null)}
                            >
                                <div className="text-black p-2 min-w-[200px]">
                                    <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
                                    <p className="text-sm text-gray-700">{selectedLocation.address}</p>
                                    <p className="text-sm text-gray-600 mt-1">{selectedLocation.board_count} Boards</p>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${selectedLocation.address}, ${selectedLocation.city}, ${selectedLocation.state}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm block mt-2 font-medium"
                                    >
                                        Get Directions &rarr;
                                    </a>
                                </div>
                            </InfoWindowF>
                        )
                    })()}
                </GoogleMap>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    {viewState === 'zoomed' ? (
                        <Button
                            onClick={resetView}
                            className="bg-white hover:bg-neutral-200 text-black shadow-lg flex items-center gap-2"
                        >
                            <MapIcon className="w-4 h-4" /> Show All Locations
                        </Button>
                    ) : (
                        <Button
                            onClick={findClosestLocation}
                            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-lg flex items-center gap-2"
                        >
                            <Navigation className="w-4 h-4" /> Find Closest Location
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map(location => (
                    <Card
                        key={location.id}
                        className={`p-6 border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group relative overflow-hidden ${selectedLocation?.id === location.id ? 'ring-2 ring-[var(--color-primary)] bg-white/10' : ''}`}
                        onClick={() => handleLocationClick(location)}
                    >
                        {location.is_new_location && (
                            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                                New!
                            </div>
                        )}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">{location.name}</h3>
                                <p className="text-sm text-neutral-400 mt-1 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {location.city}, {location.state}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-[var(--color-primary)]">{location.board_count}</span>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Boards</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-neutral-300">
                            <p>{location.address}</p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[var(--color-primary)] text-sm font-medium">View on Map</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
