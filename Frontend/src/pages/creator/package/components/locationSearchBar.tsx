import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

type LocationPayload = {
  latitude: number;
  longitude: number;
  placeName?: string;
};

type Props = {
  onChange: (location: LocationPayload) => void;
};

export type LocationSearchBarHandle = {
  setInput: (value: string) => void;
};

const LocationSearchBar = forwardRef<LocationSearchBarHandle, Props>(({ onChange }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const geocoderInstanceRef = useRef<MapboxGeocoder | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  // Expose setInput to parent via ref

  useImperativeHandle(ref, () => ({
    setInput: (value: string) => {
      if (geocoderInstanceRef.current) {
        geocoderInstanceRef.current.setInput(value);
      }
    },
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear the container to be absolutely sure no duplicate exists
    const container = containerRef.current;
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
    <div className="location-geocoder-container relative group/loc">
      <style>{`
        .location-geocoder-container .mapboxgl-ctrl-geocoder {
          width: 100% !important;
          max-width: none !important;
          background-color: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem !important;
          box-shadow: none !important;
          font-family: inherit !important;
        }
        .location-geocoder-container .mapboxgl-ctrl-geocoder--input {
          color: white !important;
          height: 52px !important;
          padding: 0 1rem 0 3rem !important;
          font-size: 13px !important;
        }
        .location-geocoder-container .mapboxgl-ctrl-geocoder--icon-search {
          fill: rgba(255, 255, 255, 0.3) !important;
          left: 1rem !important;
          top: 14px !important;
          width: 20px !important;
          height: 20px !important;
        }
        .location-geocoder-container .mapboxgl-ctrl-geocoder--icon-close {
          fill: rgba(255, 255, 255, 0.3) !important;
          margin-top: 6px !important;
        }
        .location-geocoder-container .mapboxgl-ctrl-geocoder--suggestions {
          background-color: #121212 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem !important;
          margin-top: 8px !important;
          overflow: hidden !important;
          backdrop-filter: blur(20px) !important;
        }
        .location-geocoder-container .mapboxgl-ctrl-geocoder--suggestion {
          color: rgba(255, 255, 255, 0.6) !important;
          padding: 10px 14px !important;
        }
        .location-geocoder-container .mapboxgl-ctrl-geocoder--suggestion-title {
          color: white !important;
        }
        .location-geocoder-container .mapboxgl-ctrl-geocoder--suggestion:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        .location-geocoder-container .mapboxgl-ctrl-geocoder--pin-right {
          display: none !important;
        }
      `}</style>
      <div ref={containerRef} className="w-full" />
    </div>
  );
});

export default LocationSearchBar;
