import React, { useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EnvLocation, MapEngineMode } from '../types';

// Fix Leaflet default marker icons issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapContainerProps {
  locations: EnvLocation[];
  selectedLocation: EnvLocation | null;
  onSelectLocation: (loc: EnvLocation) => void;
  center: { lat: number; lng: number };
  zoom: number;
  mapEngine: MapEngineMode;
  onMapClick: (lat: number, lng: number) => void;
  hasGoogleMapsKey: boolean;
  googleApiKey: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  center,
  zoom,
  mapEngine,
  onMapClick,
  hasGoogleMapsKey,
  googleApiKey,
}) => {
  const leafletContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;
  const onSelectLocationRef = useRef(onSelectLocation);
  onSelectLocationRef.current = onSelectLocation;

  // Function to get color based on category/aqi
  const getCategoryColor = (loc: EnvLocation): string => {
    if (loc.category === 'aqi' && loc.aqi) {
      return loc.aqi.statusColor || '#10B981';
    }
    switch (loc.category) {
      case 'canopy': return '#22C55E';
      case 'renewable': return '#F59E0B';
      case 'waste': return '#14B8A6';
      case 'hazard': return '#EF4444';
      case 'report': return '#A855F7';
      default: return '#10B981';
    }
  };

  const isUsingGoogle = mapEngine === 'google' && hasGoogleMapsKey;

  // -------------------------------------------------------------
  // LEAFLET MAP INITIALIZATION & CLEANUP
  // -------------------------------------------------------------
  useEffect(() => {
    if (isUsingGoogle) {
      // Clean up leaflet map if switching to Google
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markersLayerRef.current = null;
      }
      return;
    }

    const container = leafletContainerRef.current;
    if (!container) return;

    // Destroy existing instance if container is already attached
    if ((container as any)._leaflet_id && leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
      markersLayerRef.current = null;
    } else if ((container as any)._leaflet_id) {
      (container as any)._leaflet_id = null;
    }

    const mapInstance = L.map(container, {
      center: [center.lat, center.lng],
      zoom: zoom,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapInstance);

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    mapInstance.on('click', (e: L.LeafletMouseEvent) => {
      onMapClickRef.current(e.latlng.lat, e.latlng.lng);
    });

    const markersGroup = L.layerGroup().addTo(mapInstance);
    markersLayerRef.current = markersGroup;
    leafletMapRef.current = mapInstance;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, [isUsingGoogle]);

  // Update view when center / zoom change
  useEffect(() => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [center.lat, center.lng, zoom]);

  // Update Leaflet Markers whenever locations or selection change
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    locations.forEach((loc) => {
      const color = getCategoryColor(loc);
      const isSelected = selectedLocation?.id === loc.id;
      const size = isSelected ? 34 : 28;
      const anchor = size / 2;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: ${isSelected ? '3px solid #38bdf8' : '2px solid #0f172a'};
            box-shadow: ${isSelected ? '0 0 16px rgba(56, 189, 248, 0.6)' : '0 4px 12px rgba(0,0,0,0.3)'};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${loc.aqi ? loc.aqi.index : '•'}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [anchor, anchor],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });
      marker.on('click', () => {
        onSelectLocationRef.current(loc);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [locations, selectedLocation]);

  // -------------------------------------------------------------
  // RENDER GOOGLE MAPS ENGINE OR LEAFLET ENGINE
  // -------------------------------------------------------------
  if (isUsingGoogle) {
    return (
      <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <APIProvider apiKey={googleApiKey} version="weekly">
          <Map
            defaultCenter={center}
            defaultZoom={zoom}
            center={center}
            zoom={zoom}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
            onClick={(e) => {
              if (e.detail.latLng) {
                onMapClick(e.detail.latLng.lat, e.detail.latLng.lng);
              }
            }}
          >
            {locations.map((loc) => {
              const color = getCategoryColor(loc);
              const isSelected = selectedLocation?.id === loc.id;

              return (
                <AdvancedMarker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  onClick={() => onSelectLocation(loc)}
                  title={loc.title}
                >
                  <Pin
                    background={color}
                    glyphColor="#ffffff"
                    borderColor="#0f172a"
                    scale={isSelected ? 1.3 : 1.0}
                  />
                </AdvancedMarker>
              );
            })}

            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={() => {}}
              >
                <div className="p-2 text-slate-900 font-sans max-w-xs">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {selectedLocation.category.toUpperCase()}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{selectedLocation.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedLocation.address}</p>
                  {selectedLocation.aqi && (
                    <div className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-100/80 p-1.5 rounded">
                      AQI Index: {selectedLocation.aqi.index} ({selectedLocation.aqi.label})
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    );
  }

  // Leaflet Map Container Engine (Zero key required fallback / direct mode)
  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      <div ref={leafletContainerRef} className="w-full h-full z-10" />
    </div>
  );
};
