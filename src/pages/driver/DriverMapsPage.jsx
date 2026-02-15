import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Package,
    MapPin,
    Clock,
    Truck,
    ChevronDown,
    ChevronUp,
    Navigation,
    Zap,
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';
import { getAssignedRoute } from '../../services/routeService';

// ── Leaflet Helpers ──

const createStopIcon = (index, priority) => {
    const bgColor = priority === 'High' ? '#be185d' : priority === 'Medium' ? '#59112e' : '#6b7280';
    return L.divIcon({
        className: 'bg-transparent',
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
        html: `
            <div style="display:flex;flex-direction:column;align-items:center;">
                <div style="width:26px;height:26px;border-radius:50%;background:${bgColor};color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">${index}</div>
                <div style="width:3px;height:6px;background:${bgColor};border-radius:0 0 4px 4px;"></div>
            </div>
        `,
    });
};

const createDriverIcon = () => L.divIcon({
    className: 'bg-transparent',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    html: `
        <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;inset:0;border-radius:50%;background:rgba(89,17,46,0.3);animation:ping 2s infinite;"></div>
            <div style="position:relative;width:36px;height:36px;border-radius:50%;background:#59112e;border:3px solid white;box-shadow:0 2px 12px rgba(89,17,46,0.4);display:flex;align-items:center;justify-content:center;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" fill="white" fill-opacity="0.2"/></svg>
            </div>
        </div>
        <style>@keyframes ping{0%{box-shadow:0 0 0 0 rgba(89,17,46,0.6)}70%{box-shadow:0 0 0 15px rgba(89,17,46,0)}100%{box-shadow:0 0 0 0 rgba(89,17,46,0)}}</style>
    `,
});

function MapFitter({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds && bounds.length > 1) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
    }, [bounds, map]);
    return null;
}

// ── Route Stops Panel ──

function RouteStopsPanel({ routePlan }) {
    const [collapsed, setCollapsed] = useState(false);

    if (!routePlan || !routePlan.stops) return null;

    return (
        <div className="absolute top-4 right-4 z-[1000] w-80 max-w-[calc(100vw-2rem)]">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
                <button
                    onClick={() => setCollapsed(c => !c)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50/60 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#fdf2f6] flex items-center justify-center text-[#59112e] shadow-inner">
                            <Navigation size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Optimized Route</p>
                            <p className="text-[10px] text-slate-500 font-medium">
                                {routePlan.stops.length} stops • {routePlan.totalDistance || '—'} km • {routePlan.totalDuration || '—'} min
                            </p>
                        </div>
                    </div>
                    {collapsed ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronUp size={18} className="text-slate-400" />}
                </button>

                {!collapsed && (
                    <div className="px-4 pb-4 space-y-2 max-h-[50vh] overflow-y-auto border-t border-gray-100 pt-3">
                        {routePlan.stops.map((stop, idx) => (
                            <div key={stop.orderId || idx} className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#fdf2f6] transition-colors">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 ${stop.priority === 'High' ? 'bg-pink-600' : stop.priority === 'Medium' ? 'bg-[#59112e]' : 'bg-gray-500'
                                    }`}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate">{stop.address || 'Delivery Point'}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-[#59112e] font-medium flex items-center gap-1">
                                            <Clock size={10} /> {stop.estimatedTime}
                                        </span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${stop.priority === 'High' ? 'bg-pink-50 text-pink-600' :
                                                stop.priority === 'Medium' ? 'bg-[#fdf2f6] text-[#59112e]' :
                                                    'bg-gray-100 text-gray-500'
                                            }`}>
                                            {stop.priority}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Page Component ──

export default function DriverMapsPage() {
    const { user } = useAuth();
    const [routePlan, setRoutePlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [driverLocation, setDriverLocation] = useState({ lat: 19.076, lng: 72.8777 });

    useEffect(() => {
        if (!user?.driverProfileId) {
            console.log('No driver profile ID');
            setLoading(false);
            return;
        }
        console.log('Fetching route for driver:', user.driverProfileId);
        getAssignedRoute(user.driverProfileId)
            .then(data => {
                console.log('Route data received:', data);
                if (data.routePlan) {
                    console.log('Setting route plan:', data.routePlan);
                    setRoutePlan(data.routePlan);
                    // Center on first stop
                    if (data.routePlan.stops?.length > 0) {
                        console.log('Setting driver location to:', data.routePlan.stops[0]);
                        setDriverLocation({
                            lat: data.routePlan.stops[0].lat,
                            lng: data.routePlan.stops[0].lng,
                        });
                    }
                } else {
                    console.log('No route plan in data');
                }
            })
            .catch(err => {
                console.error('Failed to fetch assigned route:', err);
                console.error('Error details:', err.message);
            })
            .finally(() => setLoading(false));
    }, [user?.driverProfileId]);

    // Simulate location updates
    useEffect(() => {
        const interval = setInterval(() => {
            setDriverLocation(prev => ({
                lat: prev.lat + (Math.random() - 0.5) * 0.0005,
                lng: prev.lng + (Math.random() - 0.5) * 0.0005,
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const stops = routePlan?.stops || [];
    const polyline = routePlan?.polyline || [];
    const mapBounds = stops.length > 0
        ? [[driverLocation.lat, driverLocation.lng], ...stops.map(s => [s.lat, s.lng])]
        : [[driverLocation.lat, driverLocation.lng]];

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#59112e]/20 border-t-[#59112e] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-[#6b4c59] font-medium">Loading route...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-80px)] w-full relative bg-slate-100 overflow-hidden font-outfit">
            <style>{`
                .cinematic-tiles { filter: grayscale(0.7) contrast(1.1) brightness(1.05); }
                @keyframes radar-pulse {
                    0% { box-shadow: 0 0 0 0 rgba(89,17,46,0.6); }
                    70% { box-shadow: 0 0 0 15px rgba(89,17,46,0); }
                    100% { box-shadow: 0 0 0 0 rgba(89,17,46,0); }
                }
            `}</style>

            {routePlan && stops.length > 0 ? (
                <>
                    <MapContainer
                        center={[driverLocation.lat, driverLocation.lng]}
                        zoom={13}
                        className="w-full h-full z-0"
                        zoomControl={false}
                    >
                        <TileLayer
                            className="cinematic-tiles"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapFitter bounds={mapBounds} />

                        {/* Driver position */}
                        <Marker position={[driverLocation.lat, driverLocation.lng]} icon={createDriverIcon()} zIndexOffset={1000}>
                            <Popup className="font-outfit font-bold text-[#59112e]">Your Location</Popup>
                        </Marker>

                        {/* Stop markers */}
                        {stops.map((stop, idx) => (
                            <Marker
                                key={stop.orderId || idx}
                                position={[stop.lat, stop.lng]}
                                icon={createStopIcon(idx + 1, stop.priority)}
                            >
                                <Popup className="font-outfit">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold">Stop {idx + 1}</p>
                                        <p className="font-bold text-sm">{stop.address || 'Delivery Point'}</p>
                                        <p className="text-xs text-gray-500 mt-1">🕐 {stop.estimatedTime} • {stop.priority} Priority</p>
                                        <p className="text-[10px] text-blue-500 mt-1">{stop.timeSlot}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Route polyline */}
                        {polyline.length > 0 && (
                            <>
                                <Polyline
                                    positions={polyline}
                                    pathOptions={{ color: '#fbcfe8', weight: 10, opacity: 0.5, lineCap: 'round' }}
                                />
                                <Polyline
                                    positions={polyline}
                                    pathOptions={{ color: '#59112e', weight: 4, opacity: 1, dashArray: '10 10' }}
                                />
                            </>
                        )}
                    </MapContainer>

                    {/* Live badge */}
                    <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                        </span>
                        <span className="text-xs font-bold text-[#59112e]">Live Route</span>
                    </div>

                    <RouteStopsPanel routePlan={routePlan} />
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-[#fdf2f6] rounded-3xl flex items-center justify-center mb-6">
                        <Navigation size={36} className="text-[#59112e]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2d0b16] mb-2">No Active Route</h3>
                    <p className="text-sm text-[#6b4c59] max-w-sm">
                        Your merchant hasn't assigned a route yet. Once an optimized route is pushed, it will appear here.
                    </p>
                </div>
            )}
        </div>
    );
}
