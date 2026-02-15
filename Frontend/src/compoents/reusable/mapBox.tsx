import Map, { Marker } from "react-map-gl/mapbox";
import type { MapMouseEvent } from "react-map-gl/mapbox";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

type LocationPayload = {
  latitude: number;
  longitude: number;
  placeName?: string;
};

type Props = {
  onChange: (coords: LocationPayload) => void;
};

export default function MapboxLocationPicker({ onChange }: Props) {

  const [marker, setMarker] = useState<LocationPayload | null>(null);

  const geocoderContainerRef = useRef<HTMLDivElement | null>(null);

  const defaultCenter = {
    latitude: 10.8505,
    longitude: 76.2711,
  };

  // SEARCH LOCATION
  useEffect(() => {
    if (!geocoderContainerRef.current) return;

    const geocoder = new MapboxGeocoder({
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
      mapboxgl: mapboxgl as any,
      marker: false,
      placeholder: "Search location",
    });

    geocoder.addTo(geocoderContainerRef.current);

    geocoder.on("result", (e: any) => {
      const [lng, lat] = e.result.center;

      const payload: LocationPayload = {
        latitude: lat,
        longitude: lng,
        placeName: e.result.place_name,
      };
      setMarker(payload);
      onChange(payload);
    });

    return () => {
      geocoder.clear();
    };
  }, [onChange]);

  // CLICK MAP → REVERSE GEOCODE
  const handleMapClick = async (e: MapMouseEvent) => {
    const lat = e.lngLat.lat;
    const lng = e.lngLat.lng;

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
      );

      const data = await res.json();

      const payload: LocationPayload = {
        latitude: lat,
        longitude: lng,
        placeName: data?.features?.[0]?.place_name,
      };

      setMarker(payload);
      onChange(payload);
    } catch {
      const payload: LocationPayload = {
        latitude: lat,
        longitude: lng,
      };

      setMarker(payload);
      onChange(payload);
    }
  };

  return (
    <div className="space-y-2">

      {/* SEARCH BOX */}
      <div ref={geocoderContainerRef} />

      {/* MAP */}
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          latitude: defaultCenter.latitude,
          longitude: defaultCenter.longitude,
          zoom: 10,
        }}
        style={{ width: "100%", height: 350 }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onClick={handleMapClick}
      >
        {marker && (
          <Marker
            latitude={marker.latitude}
            longitude={marker.longitude}
            anchor="bottom"
          />
        )}
      </Map>
    </div>
  );
}
