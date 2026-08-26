"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

interface MarkerPoint {
  coords: [number, number];
  label: string;
  color: string;
}

interface BorderMapProps {
  points: MarkerPoint[];
}

// UI仕様書3.2: 出発国側／到着国側でマーカーの色を検索方向に応じて変える
export function BorderMap({ points }: BorderMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || points.length === 0) return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      const markers = points.map((point) => {
        const icon = L.divIcon({
          className: "",
          html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${point.color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.3);"></span>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        return L.marker(point.coords, { icon }).addTo(map).bindPopup(point.label);
      });

      if (points.length === 1) {
        map.setView(points[0].coords, 12);
      } else {
        const bounds = L.latLngBounds(points.map((p) => p.coords));
        map.fitBounds(bounds, { padding: [32, 32] });
      }

      return () => {
        markers.forEach((m) => m.remove());
      };
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [points]);

  if (points.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
        位置情報が未確定のため地図を表示できません
      </div>
    );
  }

  return <div ref={containerRef} className="h-72 w-full rounded-lg" />;
}
