import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    Popup,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Custom Marker Icons (SVG data-URIs to avoid bundler issues) ────────────

const makeIcon = (color, size = 32) =>
    L.divIcon({
        className: "",
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="#fff" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>`,
    });

const DRIVER_ICON = makeIcon("#3b82f6", 36); // blue
const DELIVERY_ICON = makeIcon("#ef4444", 30); // red

// ─── Haversine distance (km) — mock-friendly ────────────────────────────────

function haversine(a, b) {
    const R = 6371;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLng = toRad(b[1] - a[1]);
    const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// ─── MapController — auto-center & fit bounds ───────────────────────────────

function MapController({ driverLocation, deliveryPoints }) {
    const map = useMap();

    useEffect(() => {
        if (!driverLocation) return;

        if (deliveryPoints?.length) {
            const pts = [
                [driverLocation.lat, driverLocation.lng],
                ...deliveryPoints.map((p) => [p.lat, p.lng]),
            ];
            map.fitBounds(pts, { padding: [40, 40], maxZoom: 15 });
        } else {
            map.setView([driverLocation.lat, driverLocation.lng], 14);
        }
    }, [driverLocation?.lat, driverLocation?.lng, deliveryPoints, map]);

    return null;
}

// ─── DriverMarker — with optional live-location simulation ──────────────────

function DriverMarker({ location, simulate }) {
    const [pos, setPos] = useState(location);
    const intervalRef = useRef(null);

    useEffect(() => {
        setPos(location);
    }, [location]);

    useEffect(() => {
        if (!simulate) return;
        intervalRef.current = setInterval(() => {
            setPos((p) => ({
                lat: p.lat + (Math.random() - 0.45) * 0.0003,
                lng: p.lng + (Math.random() - 0.45) * 0.0003,
            }));
        }, 1500);
        return () => clearInterval(intervalRef.current);
    }, [simulate]);

    return (
        <Marker position={[pos.lat, pos.lng]} icon={DRIVER_ICON}>
            <Popup>Driver</Popup>
        </Marker>
    );
}

// ─── DeliveryMarkers ────────────────────────────────────────────────────────

function DeliveryMarkers({ points, draggable, onReorder }) {
    const handleDragEnd = useCallback(
        (idx, e) => {
            if (!onReorder) return;
            const { lat, lng } = e.target.getLatLng();
            const updated = points.map((p, i) =>
                i === idx ? { ...p, lat, lng } : p
            );
            // simple reorder: sort by distance to first point
            const origin = updated[0];
            const sorted = [...updated].sort(
                (a, b) =>
                    haversine([origin.lat, origin.lng], [a.lat, a.lng]) -
                    haversine([origin.lat, origin.lng], [b.lat, b.lng])
            );
            onReorder(sorted.map((s) => s.id));
        },
        [points, onReorder]
    );

    return points.map((pt, idx) => (
        <Marker
            key={pt.id}
            position={[pt.lat, pt.lng]}
            icon={DELIVERY_ICON}
            draggable={draggable}
            eventHandlers={
                draggable ? { dragend: (e) => handleDragEnd(idx, e) } : undefined
            }
        >
            <Popup>
                <span className="font-semibold">{pt.address}</span>
                {pt.priority != null && (
                    <span className="block text-xs text-gray-400">
                        Priority: {pt.priority}
                    </span>
                )}
            </Popup>
        </Marker>
    ));
}

// ─── RoutePolyline ──────────────────────────────────────────────────────────

function RoutePolylineLayer({ positions }) {
    if (!positions?.length) return null;
    return (
        <Polyline
            positions={positions}
            pathOptions={{ color: "#6366f1", weight: 4, opacity: 0.8 }}
        />
    );
}

// ─── DriverPanel (bottom floating) ──────────────────────────────────────────

function DriverPanel({ deliveryPoints, routePolyline }) {
    const remaining = deliveryPoints?.length ?? 0;

    const totalDistance = useMemo(() => {
        if (!routePolyline || routePolyline.length < 2) return 0;
        let d = 0;
        for (let i = 1; i < routePolyline.length; i++) {
            d += haversine(routePolyline[i - 1], routePolyline[i]);
        }
        return d.toFixed(1);
    }, [routePolyline]);

    const [started, setStarted] = useState(false);

    return (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] pointer-events-none">
            <div className="mx-3 mb-4 rounded-2xl bg-gray-900/90 backdrop-blur-lg border border-gray-700/50 p-4 pointer-events-auto shadow-2xl">
                {/* Stats row */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-bold">
                            {remaining}
                        </span>
                        <span className="text-sm text-gray-300">stops left</span>
                    </div>
                    <div className="text-sm text-gray-400">
                        ~<span className="text-white font-medium">{totalDistance}</span> km
                    </div>
                </div>

                {/* Action button */}
                <button
                    onClick={() => setStarted((s) => !s)}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[.97] ${started
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-indigo-500 hover:bg-indigo-600 text-white"
                        }`}
                >
                    {started ? "Stop Delivery" : "Start Delivery"}
                </button>
            </div>
        </div>
    );
}

// ─── Floating driver indicator badge ────────────────────────────────────────

function DriverBadge() {
    return (
        <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 rounded-full bg-gray-900/80 backdrop-blur px-3 py-1.5 shadow-lg border border-gray-700/40">
            <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
            </span>
            <span className="text-xs font-medium text-gray-200">Driver Live</span>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// TradeMap — main export
// ═══════════════════════════════════════════════════════════════════════════

export default function TradeMap({
    role = "customer",
    driverLocation = { lat: 28.6139, lng: 77.209 },
    deliveryPoints = [],
    routePolyline,
    onReorderStops,
}) {
    const isDriver = role === "driver";

    // Build polyline: if none supplied, derive from driver + delivery points
    const computedPolyline = useMemo(() => {
        if (routePolyline) return routePolyline;
        if (!deliveryPoints.length) return [];
        return [
            [driverLocation.lat, driverLocation.lng],
            ...deliveryPoints.map((p) => [p.lat, p.lng]),
        ];
    }, [routePolyline, deliveryPoints, driverLocation]);

    return (
        <div className="relative w-full h-screen">
            <MapContainer
                center={[driverLocation.lat, driverLocation.lng]}
                zoom={13}
                scrollWheelZoom
                className="h-full w-full"
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController
                    driverLocation={driverLocation}
                    deliveryPoints={deliveryPoints}
                />

                {/* Driver marker — simulates movement only for the driver role */}
                <DriverMarker location={driverLocation} simulate={isDriver} />

                {/* Delivery point markers */}
                {deliveryPoints.length > 0 && (
                    <DeliveryMarkers
                        points={deliveryPoints}
                        draggable={isDriver}
                        onReorder={isDriver ? onReorderStops : undefined}
                    />
                )}

                {/* Route polyline */}
                <RoutePolylineLayer positions={computedPolyline} />
            </MapContainer>

            {/* Floating driver badge */}
            <DriverBadge />

            {/* Bottom panel — driver only */}
            {isDriver && (
                <DriverPanel
                    deliveryPoints={deliveryPoints}
                    routePolyline={computedPolyline}
                />
            )}
        </div>
    );
}
