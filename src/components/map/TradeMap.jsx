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
import { Zap, Navigation, MapPin, Package, Clock } from "lucide-react";

// ─── 1. Custom CSS for Map Styling ──────────────────────────────────────
// This style tag creates the "Cinematic" map look and marker animations
const MapStyles = () => (
  <style>{`
    /* Desaturate the map tiles to make our colors pop */
    .cinematic-tiles {
      filter: grayscale(0.8) contrast(1.1) brightness(1.05);
    }
    
    /* Driver Pulse Animation */
    @keyframes radar-pulse {
      0% { box-shadow: 0 0 0 0 rgba(89, 17, 46, 0.6); }
      70% { box-shadow: 0 0 0 15px rgba(89, 17, 46, 0); }
      100% { box-shadow: 0 0 0 0 rgba(89, 17, 46, 0); }
    }
    .driver-marker-pulse {
      animation: radar-pulse 2s infinite;
    }

    /* Route Flow Animation */
    @keyframes dash-flow {
      to { stroke-dashoffset: -20; }
    }
    .route-flow-line {
      animation: dash-flow 1s linear infinite;
    }
  `}</style>
);

// ─── 2. Advanced Marker Generators ──────────────────────────────────────

// Driver Icon: A "Navigation Puck" style with a pulsing ring
const createDriverIcon = () => {
  return L.divIcon({
    className: "bg-transparent",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    html: `
      <div class="relative w-full h-full flex items-center justify-center">
        <div class="absolute inset-0 rounded-full bg-[#59112e]/30 driver-marker-pulse"></div>
        <div class="relative w-10 h-10 bg-[#59112e] border-[3px] border-white rounded-full shadow-xl flex items-center justify-center z-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11" fill="white" fill-opacity="0.2"/>
          </svg>
        </div>
      </div>
    `,
  });
};

// Stop Icon: A "Lollipop" pin with index number and status colors
const createStopIcon = (index, isPriority, isOptimized) => {
  const bgColor = isPriority ? "#be185d" : (isOptimized ? "#59112e" : "#ffffff");
  const textColor = isPriority || isOptimized ? "#ffffff" : "#59112e";
  const borderColor = isPriority ? "#fbcfe8" : "#59112e";

  return L.divIcon({
    className: "bg-transparent",
    iconSize: [40, 50],
    iconAnchor: [20, 50], // Tip of the pin at the bottom
    popupAnchor: [0, -50],
    html: `
      <div class="relative w-full h-full flex flex-col items-center justify-end drop-shadow-lg group hover:scale-110 transition-transform">
        <div class="w-8 h-8 rounded-full border-[3px] flex items-center justify-center text-sm font-bold shadow-sm z-10" 
             style="background-color: ${bgColor}; color: ${textColor}; border-color: ${borderColor};">
          ${index + 1}
        </div>
        <div class="w-1 h-3 bg-[#59112e] rounded-b-full"></div>
        <div class="absolute -bottom-1 w-8 h-2 bg-black/20 blur-[2px] rounded-full"></div>
      </div>
    `,
  });
};

// ─── 3. Functional Components ───────────────────────────────────────────

function MapController({ driverLocation, deliveryPoints }) {
  const map = useMap();
  useEffect(() => {
    if (!driverLocation) return;
    const points = [[driverLocation.lat, driverLocation.lng], ...deliveryPoints.map(p => [p.lat, p.lng])];
    map.fitBounds(points, { padding: [60, 60], maxZoom: 15, animate: true });
  }, [driverLocation, deliveryPoints, map]);
  return null;
}

function RouteLayer({ positions, isOptimized }) {
  if (!positions?.length) return null;

  return (
    <>
      {/* Glow Layer */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: isOptimized ? "#fbcfe8" : "#94a3b8",
          weight: 10,
          opacity: 0.5,
          lineCap: "round",
          lineJoin: "round"
        }}
      />
      {/* Core Line */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: isOptimized ? "#59112e" : "#64748b",
          weight: 4,
          opacity: 1,
          dashArray: isOptimized ? "10 10" : undefined,
          className: isOptimized ? "route-flow-line" : "" // Applies CSS animation
        }}
      />
    </>
  );
}

function FloatingPanel({ deliveryPoints, isOptimized, onOptimize }) {
  return (
    <div className="absolute bottom-6 left-4 right-4 z-[1000] pointer-events-none">
      <div className="bg-white/90 backdrop-blur-xl p-5 rounded-[28px] shadow-2xl border border-white/50 pointer-events-auto flex flex-col gap-4">

        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#fdf2f6] rounded-2xl flex items-center justify-center text-[#59112e] shadow-inner">
              <MapPin size={24} fill="#59112e" fillOpacity={0.1} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight">Delivery Route</h3>
              <p className="text-xs text-slate-500 font-medium">
                {deliveryPoints.length} Stops • Est. 45 mins
              </p>
            </div>
          </div>
          {isOptimized && (
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-emerald-200">
              Optimized
            </span>
          )}
        </div>

        {/* Dynamic Button */}
        <button
          onClick={onOptimize}
          className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
            ${!isOptimized
              ? 'bg-[#59112e] text-white shadow-[#59112e]/25 hover:bg-[#450d24]'
              : 'bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-600'
            }`}
        >
          {!isOptimized ? (
            <><Zap size={18} fill="currentColor" /> Optimize & Start Route</>
          ) : (
            <><Navigation size={18} /> Navigation Active</>
          )}
        </button>

      </div>
    </div>
  );
}

// ─── 4. Main Export ─────────────────────────────────────────────────────

export default function RouteMap({
  driverLocation = { lat: 28.6139, lng: 77.209 },
  deliveryPoints = [
    { id: 1, lat: 28.621, lng: 77.212, address: "Connaught Place", priority: true },
    { id: 2, lat: 28.632, lng: 77.225, address: "New Delhi Rly Stn", priority: false },
    { id: 3, lat: 28.610, lng: 77.230, address: "India Gate", priority: false }
  ],
  showDefaultPanel = true,
}) {
  const [isOptimized, setIsOptimized] = useState(false);
  const [routePath, setRoutePath] = useState([]);

  // Initial RAW path
  useEffect(() => {
    const raw = [
      [driverLocation.lat, driverLocation.lng],
      ...deliveryPoints.map(p => [p.lat, p.lng])
    ];
    setRoutePath(raw);
  }, [driverLocation, deliveryPoints]);

  const handleOptimize = () => {
    setIsOptimized(true);
    // Mock optimization: simply redraws path with new style, 
    // real app would reorder 'deliveryPoints' and fetch Directions API geometry
    const optimized = [
      [driverLocation.lat, driverLocation.lng],
      // Simulating a slightly different path geometry for visual flair
      [driverLocation.lat + 0.005, driverLocation.lng + 0.002],
      ...deliveryPoints.map(p => [p.lat, p.lng])
    ];
    setRoutePath(optimized);
  };

  return (
    <div className="w-full h-full relative bg-slate-100 overflow-hidden font-outfit">
      <MapStyles /> {/* Inject CSS */}

      <MapContainer
        center={[driverLocation.lat, driverLocation.lng]}
        zoom={13}
        className="w-full h-full z-0"
        zoomControl={false} // We can add custom zoom controls if needed
      >
        <TileLayer
          className="cinematic-tiles"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController driverLocation={driverLocation} deliveryPoints={deliveryPoints} />

        {/* Driver Pin */}
        <Marker position={[driverLocation.lat, driverLocation.lng]} icon={createDriverIcon()} zIndexOffset={1000}>
          <Popup className="font-outfit font-bold text-[#59112e]">You are here</Popup>
        </Marker>

        {/* Stops */}
        {deliveryPoints.map((pt, idx) => (
          <Marker
            key={pt.id}
            position={[pt.lat, pt.lng]}
            icon={createStopIcon(idx, pt.priority, isOptimized)}
          >
            <Popup className="font-outfit">
              <div className="p-1">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Stop {idx + 1}</p>
                <p className="font-bold text-slate-800 text-sm">{pt.address}</p>
                {pt.priority && <p className="text-[10px] text-rose-500 font-bold mt-1">★ Priority Delivery</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route Line */}
        <RouteLayer positions={routePath} isOptimized={isOptimized} />

      </MapContainer>

      {/* Top Left Badge */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-bold text-[#59112e]">Live Tracking</span>
      </div>

      {showDefaultPanel && (
        <FloatingPanel
          deliveryPoints={deliveryPoints}
          isOptimized={isOptimized}
          onOptimize={handleOptimize}
        />
      )}
    </div>
  );
}