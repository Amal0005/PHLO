import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

type LocationPayload = {
  latitude: number;
  longitude: number;
  placeName?: string;
};

type Props = {
  onChange: (location: LocationPayload) => void;
};

export default function LocationSearchBar({ onChange }: Props) {
  const geocoderRef = useRef<HTMLDivElement | null>(null);
  const geocoderInstanceRef = useRef<MapboxGeocoder | null>(null);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!geocoderRef.current) return;

    // Clear the container to be absolutely sure no duplicate exists
    const container = geocoderRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const geocoder = new MapboxGeocoder({
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
      // @ts-expect-error: MapboxGL type mismatch with geocoder
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: "Search location...",
      collapsed: false,
    });

    geocoderInstanceRef.current = geocoder;
    geocoder.addTo(container);

    geocoder.on("result", (e: { result: { center: [number, number]; place_name: string } }) => {
      const [lng, lat] = e.result.center;

      const locationData = {
        latitude: lat,
        longitude: lng,
        placeName: e.result.place_name,
      };

      onChangeRef.current(locationData);
    });

    return () => {
      if (geocoderInstanceRef.current) {
        geocoderInstanceRef.current.clear();
        geocoderInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="location-geocoder-container">
      <div ref={geocoderRef} className="w-full" />
    </div>
  );
}
