import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Map as MapIcon,
    Truck,
    Package,
    Navigation,
    Zap,
    BarChart3,
    Send,
    MapPin,
    ArrowRight,
    ShieldCheck,
    Layers,
    Settings,
    X,
    Radar,
    Clock,
    ChevronDown,
    Users,
    Calendar,
    AlertTriangle,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../app/providers/AuthContext';
import { getOrdersByMerchant } from '../services/orderService';
import {
    calculateDeliverySchedule,
    saveOptimizedRoute,
    getMerchantDrivers,
    getNearbyFestivals,
} from '../services/routeService';

// ── Leaflet Helpers ──

const createStopIcon = (index, priority) => {
    const bgColor = priority === 'High' ? '#be185d' : priority === 'Medium' ? '#59112e' : '#6b7280';
    return L.divIcon({
        className: 'bg-transparent',
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [0, -44],
        html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="width:28px;height:28px;border-radius:50%;background:${bgColor};color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">${index}</div>
        <div style="width:3px;height:8px;background:${bgColor};border-radius:0 0 4px 4px;"></div>
      </div>
    `,
    });
};

const createMerchantIcon = () => L.divIcon({
    className: 'bg-transparent',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    html: `
    <div style="width:40px;height:40px;border-radius:50%;background:#059669;color:white;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 12px rgba(5,150,105,0.4);">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </div>
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

// ── AI Processing Overlay ──

const AIProcessingOverlay = ({ onComplete, stages }) => {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        if (stage < stages.length - 1) {
            const timer = setTimeout(() => setStage(prev => prev + 1), 1500);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(onComplete, 600);
            return () => clearTimeout(timer);
        }
    }, [stage]);

    const icons = [Layers, BarChart3, Calendar, ShieldCheck, Zap, Navigation];
    const CurrentIcon = icons[stage % icons.length];

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#2d0b16]/95 backdrop-blur-xl flex flex-col items-center justify-center text-center overflow-hidden rounded-[2.5rem]"
        >
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="w-[600px] h-[600px] border border-[#59112e] rounded-full animate-[ping_3s_linear_infinite]" />
                <div className="w-[400px] h-[400px] border border-[#59112e] rounded-full absolute animate-[ping_3s_linear_infinite_1s]" />
            </div>
            <div className="relative z-10 flex flex-col items-center">
                <motion.div key={stage} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#59112e] to-[#851e45] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#59112e]/50 text-white">
                        <CurrentIcon size={40} className="animate-pulse" />
                    </div>
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">AI Route Engine</h2>
                <AnimatePresence mode="wait">
                    <motion.p key={stage} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="text-emerald-400 font-mono text-sm font-medium w-96">
                        {">"} {stages[stage]}
                    </motion.p>
                </AnimatePresence>
                <div className="w-64 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
                    <motion.div className="h-full bg-emerald-500" initial={{ width: '0%' }} animate={{ width: `${((stage + 1) / stages.length) * 100}%` }} transition={{ duration: 0.5 }} />
                </div>
            </div>
        </motion.div>
    );
};

// ── ONDC / 3PL Data (keep existing mock) ──

const ONDC_DRIVERS = [
    { id: 1, name: "Ramesh T.", vehicle: "Tata Ace", route: "Mumbai -> Pune", match: "98%", cost: "₹850", rating: 4.8 },
    { id: 2, name: "SpeedLogistics", vehicle: "Eicher 14ft", route: "Thane -> Pune", match: "92%", cost: "₹1,200", rating: 4.5 },
];

const LOGISTICS_PARTNERS = [
    { id: 1, name: "Delhivery", eta: "2 Days", cost: "₹450", type: "Express" },
    { id: 2, name: "Ekart", eta: "3 Days", cost: "₹380", type: "Standard" },
    { id: 3, name: "Shadowfax", eta: "Same Day", cost: "₹800", type: "Hyperlocal" },
];

// ── Main Component ──

const RouteOptimizer = () => {
    const { user } = useAuth();
    const [activeMode, setActiveMode] = useState('own');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [routeReady, setRouteReady] = useState(false);
    const [routeData, setRouteData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [showDriverDropdown, setShowDriverDropdown] = useState(false);
    const [error, setError] = useState(null);
    const [pushing, setPushing] = useState(false);
    const [pushed, setPushed] = useState(false);
    const [processingStages, setProcessingStages] = useState([]);
    const [festivals, setFestivals] = useState([]);

    // Fetch orders and drivers on mount
    useEffect(() => {
        if (!user?.merchantProfileId) return;

        getOrdersByMerchant(user.merchantProfileId)
            .then(data => {
                const pending = data.filter(o => ['pending', 'confirmed', 'packed'].includes(o.status));
                setOrders(pending);
            })
            .catch(err => console.error('Failed to fetch orders:', err));

        getMerchantDrivers()
            .then(data => setDrivers(data))
            .catch(err => console.error('Failed to fetch drivers:', err));

        setFestivals(getNearbyFestivals());
    }, [user?.merchantProfileId]);

    // Merchant location (from merchant profile or default)
    const merchantLocation = {
        lat: user?.merchantLat || 19.076,
        lng: user?.merchantLng || 72.8777,
    };

    const startOptimization = async () => {
        if (orders.length === 0) {
            setError('No pending orders to optimize. Orders must be in pending, confirmed, or packed status.');
            return;
        }

        setError(null);
        setRouteReady(false);
        setPushed(false);

        // Dynamic stages based on what we're processing
        const stages = [
            'Connecting to TomTom Geocoding API...',
            `Processing ${orders.length} order${orders.length > 1 ? 's' : ''}...`,
            'Analyzing Order Density Heatmap...',
        ];
        if (festivals.length > 0) {
            stages.push(`Festival detected: ${festivals[0]} — Adjusting schedule...`);
        }
        stages.push('Running Waypoint Optimization...');
        stages.push('Fetching Road Geometry (OSRM)...');
        stages.push('Checking TomTom Traffic Flow...');
        stages.push('Route Generation Complete.');
        setProcessingStages(stages);
        setIsOptimizing(true);

        try {
            const result = await calculateDeliverySchedule(orders, merchantLocation);
            setRouteData(result);
        } catch (err) {
            console.error('Route optimization failed:', err);
            setError('Route optimization failed. Please try again.');
            setIsOptimizing(false);
        }
    };

    const handleOptimizationComplete = () => {
        setIsOptimizing(false);
        if (routeData) {
            setRouteReady(true);
        }
    };

    const handlePushToDriver = async () => {
        if (!selectedDriver || !routeData) return;
        setPushing(true);
        try {
            await saveOptimizedRoute(user.merchantProfileId, selectedDriver.id, routeData);
            setPushed(true);
        } catch (err) {
            console.error('Push failed:', err);
            setError('Failed to push route to driver. Please try again.');
        } finally {
            setPushing(false);
        }
    };

    // Map bounds from route data
    const mapBounds = routeData?.stops?.length > 0
        ? [[merchantLocation.lat, merchantLocation.lng], ...routeData.stops.map(s => [s.lat, s.lng])]
        : [[merchantLocation.lat, merchantLocation.lng]];

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-outfit text-[#2d0b16] flex flex-col md:flex-row overflow-hidden">

            {/* === LEFT SIDEBAR === */}
            <div className="w-full md:w-[88px] bg-white border-r border-[#f2d8e4] flex flex-col items-center py-8 gap-8 z-30 shadow-[4px_0_24px_rgba(89,17,46,0.02)]">
                <div className="w-11 h-11 rounded-2xl bg-[#59112e] flex items-center justify-center text-white shadow-lg shadow-[#59112e]/20">
                    <Truck size={22} />
                </div>
                <nav className="flex flex-col gap-6 w-full items-center mt-4">
                    {[
                        { mode: 'own', icon: MapIcon, title: 'Own Fleet' },
                        { mode: 'ondc', icon: Navigation, title: 'ONDC Empty Trucks' },
                        { mode: '3pl', icon: Package, title: '3PL Partners' },
                    ].map(({ mode, icon: Icon, title }) => (
                        <button
                            key={mode}
                            onClick={() => setActiveMode(mode)}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeMode === mode ? 'bg-[#fdf2f6] text-[#59112e] shadow-inner' : 'text-gray-300 hover:text-[#59112e] hover:bg-gray-50'}`}
                            title={title}
                        >
                            <Icon size={22} strokeWidth={activeMode === mode ? 2.5 : 2} />
                        </button>
                    ))}
                </nav>
            </div>

            {/* === MAIN CONTENT === */}
            <div className="flex-1 flex flex-col h-screen relative bg-[#fafafa]">

                {/* Header */}
                <div className="h-24 px-10 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm border-b border-[#f2d8e4] z-20">
                    <div>
                        <h1 className="text-3xl font-bold text-[#59112e] tracking-tight">Route Optimization</h1>
                        <p className="text-sm text-[#6b4c59] font-medium mt-1">
                            {activeMode === 'own' ? `${orders.length} pending order${orders.length !== 1 ? 's' : ''} • AI-powered fleet routing` : activeMode === 'ondc' ? 'Find empty returning trucks' : 'Compare logistics partners'}
                        </p>
                    </div>
                    {activeMode === 'own' && festivals.length > 0 && (
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
                            <Calendar size={16} className="text-amber-600" />
                            <span className="text-xs font-bold text-amber-700">Festival: {festivals[0]}</span>
                        </div>
                    )}
                </div>

                {/* Content Body */}
                <div className="flex-1 p-6 relative overflow-hidden flex">

                    {/* --- MODE 1: OWN FLEET (SPLIT VIEW) --- */}
                    {activeMode === 'own' && (
                        <div className="w-full h-full flex gap-6 relative">

                            {/* The Overlay */}
                            <AnimatePresence>
                                {isOptimizing && (
                                    <div className="absolute inset-0 z-50">
                                        <AIProcessingOverlay
                                            stages={processingStages}
                                            onComplete={handleOptimizationComplete}
                                        />
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Left: Route List */}
                            <div className="w-[420px] bg-white rounded-[2.5rem] border border-[#f2d8e4] shadow-sm flex flex-col overflow-hidden">
                                <div className="p-8 border-b border-[#f2d8e4]">

                                    {/* Driver Selector */}
                                    <div className="mb-6">
                                        <label className="text-[10px] font-bold text-[#6b4c59] uppercase tracking-wider mb-2 block">Select Driver</label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowDriverDropdown(!showDriverDropdown)}
                                                className="w-full flex items-center justify-between py-3 px-4 bg-[#fdf2f6] border border-[#f2d8e4] rounded-xl text-sm font-medium text-[#2d0b16] hover:border-[#59112e]/30 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Users size={16} className="text-[#59112e]" />
                                                    <span>{selectedDriver ? (selectedDriver.profiles?.full_name || 'Driver') : 'Choose a driver'}</span>
                                                </div>
                                                <ChevronDown size={16} className={`text-[#6b4c59] transition-transform ${showDriverDropdown ? 'rotate-180' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {showDriverDropdown && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -8 }}
                                                        className="absolute top-full mt-2 left-0 right-0 bg-white border border-[#f2d8e4] rounded-xl shadow-xl z-20 overflow-hidden"
                                                    >
                                                        {drivers.length === 0 ? (
                                                            <div className="p-4 text-xs text-gray-400 text-center">No drivers found</div>
                                                        ) : (
                                                            drivers.map(d => (
                                                                <button
                                                                    key={d.id}
                                                                    onClick={() => { setSelectedDriver(d); setShowDriverDropdown(false); }}
                                                                    className={`w-full flex items-center gap-3 p-3 hover:bg-[#fdf2f6] transition-colors text-left ${selectedDriver?.id === d.id ? 'bg-[#fdf2f6]' : ''}`}
                                                                >
                                                                    <div className="w-8 h-8 rounded-full bg-[#59112e]/10 flex items-center justify-center">
                                                                        <Truck size={14} className="text-[#59112e]" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-[#2d0b16]">{d.profiles?.full_name || 'Driver'}</p>
                                                                        <p className="text-[10px] text-[#6b4c59]">{d.vehicle_type || 'Vehicle not set'}</p>
                                                                    </div>
                                                                </button>
                                                            ))
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                                            <AlertTriangle size={14} className="text-red-500" />
                                            <p className="text-xs text-red-600 font-medium">{error}</p>
                                        </div>
                                    )}

                                    {!routeReady ? (
                                        <div className="bg-[#fdf2f6] rounded-2xl p-6 text-center border border-[#f2d8e4] border-dashed">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-[#59112e] shadow-sm">
                                                <Zap size={24} />
                                            </div>
                                            <h3 className="font-bold text-[#2d0b16] mb-1">Route Not Optimized</h3>
                                            <p className="text-xs text-[#6b4c59] mb-4">
                                                {orders.length} order{orders.length !== 1 ? 's' : ''} ready.
                                                Run AI to calculate optimal delivery path.
                                            </p>
                                            <button
                                                onClick={startOptimization}
                                                disabled={orders.length === 0}
                                                className="w-full py-3.5 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#59112e]/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Radar size={16} /> Start AI Optimization
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                                                <p className="text-[10px] text-emerald-600 font-bold uppercase">Distance</p>
                                                <p className="text-lg font-bold text-emerald-700">{routeData?.totalDistance || '—'} km</p>
                                            </div>
                                            <div className="flex-1 bg-blue-50 border border-blue-100 p-3 rounded-xl">
                                                <p className="text-[10px] text-blue-600 font-bold uppercase">Duration</p>
                                                <p className="text-lg font-bold text-blue-700">{routeData?.totalDuration || '—'} min</p>
                                            </div>
                                            <div className="flex-1 bg-amber-50 border border-amber-100 p-3 rounded-xl">
                                                <p className="text-[10px] text-amber-600 font-bold uppercase">Fuel Est.</p>
                                                <p className="text-lg font-bold text-amber-700">{routeData?.fuelEstimate || '—'} L</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Stops List */}
                                {routeReady && routeData?.stops && (
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                        {routeData.stops.map((stop, idx) => (
                                            <div key={stop.id || idx} className="relative pl-8">
                                                <div className="absolute left-3 top-3 bottom-[-20px] w-0.5 bg-[#f2d8e4] last:hidden" />
                                                <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-[3px] border-white shadow-md z-10 flex items-center justify-center text-[10px] font-bold ${stop.priority === 'High' ? 'bg-pink-600 text-white' : stop.priority === 'Medium' ? 'bg-[#59112e] text-white' : 'bg-gray-500 text-white'
                                                    }`}>
                                                    {idx + 1}
                                                </div>
                                                <div className={`p-4 rounded-2xl border transition-all ${stop.traffic?.congestion === 'High'
                                                        ? 'bg-amber-50 border-amber-200'
                                                        : 'bg-white border-[#f2d8e4] hover:border-[#59112e]/30'
                                                    }`}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-[#2d0b16] text-sm">{stop.order_items?.[0]?.product_name || stop.geocodedAddress || `Order #${(stop.id || '').slice(0, 8)}`}</h4>
                                                        <span className="text-xs font-bold text-[#59112e]">{stop.estimatedTime}</span>
                                                    </div>
                                                    <p className="text-[10px] text-[#6b4c59] mb-2 truncate">📍 {stop.geocodedAddress || 'Nearby'}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className={`text-[10px] px-2 py-1 rounded-lg font-medium border ${stop.priority === 'High' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                                                                stop.priority === 'Medium' ? 'bg-[#fdf2f6] text-[#59112e] border-[#f2d8e4]' :
                                                                    'bg-gray-50 text-gray-600 border-gray-200'
                                                            }`}>
                                                            {stop.priority} Priority
                                                        </span>
                                                        <span className={`text-[10px] px-2 py-1 rounded-lg font-medium border ${stop.traffic?.congestion === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                stop.traffic?.congestion === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                            }`}>
                                                            Traffic: {stop.traffic?.congestion || 'Unknown'}
                                                        </span>
                                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-medium border border-blue-100">
                                                            {stop.timeSlot}
                                                        </span>
                                                    </div>
                                                    {stop.festivalNote && (
                                                        <p className="text-[10px] text-amber-600 mt-2 font-medium flex items-center gap-1">
                                                            <Calendar size={10} /> {stop.festivalNote}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Push to Driver */}
                                {routeReady && (
                                    <div className="p-6 border-t border-[#f2d8e4] bg-[#fafafa]">
                                        {pushed ? (
                                            <div className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">
                                                ✓ Route Pushed to {selectedDriver?.profiles?.full_name || 'Driver'}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handlePushToDriver}
                                                disabled={!selectedDriver || pushing}
                                                className="w-full py-4 bg-[#59112e] text-white font-bold rounded-xl text-sm shadow-xl shadow-[#59112e]/20 flex items-center justify-center gap-2 hover:bg-[#450d24] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {pushing ? (
                                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Pushing...</>
                                                ) : (
                                                    <><Send size={18} /> Push to {selectedDriver ? (selectedDriver.profiles?.full_name || 'Driver') : 'Driver (select above)'}</>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right: Map Visualization */}
                            <div className="flex-1 bg-white rounded-[2.5rem] border border-[#f2d8e4] shadow-sm relative overflow-hidden">
                                {routeReady && routeData ? (
                                    <MapContainer
                                        center={[merchantLocation.lat, merchantLocation.lng]}
                                        zoom={12}
                                        className="w-full h-full z-0"
                                        zoomControl={false}
                                        style={{ borderRadius: '2.5rem' }}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <MapFitter bounds={mapBounds} />

                                        {/* Merchant marker */}
                                        <Marker position={[merchantLocation.lat, merchantLocation.lng]} icon={createMerchantIcon()}>
                                            <Popup><b>Your Store</b></Popup>
                                        </Marker>

                                        {/* Stop markers */}
                                        {routeData.stops.map((stop, idx) => (
                                            <Marker
                                                key={stop.id || idx}
                                                position={[stop.lat, stop.lng]}
                                                icon={createStopIcon(idx + 1, stop.priority)}
                                            >
                                                <Popup>
                                                    <div className="font-outfit">
                                                        <p className="text-xs text-gray-400 font-bold">Stop {idx + 1}</p>
                                                        <p className="font-bold text-sm">{stop.geocodedAddress || 'Delivery Point'}</p>
                                                        <p className="text-xs text-gray-500 mt-1">🕐 {stop.estimatedTime} • {stop.priority} Priority</p>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        ))}

                                        {/* Route polyline */}
                                        {routeData.routeGeometry?.polyline && (
                                            <>
                                                <Polyline
                                                    positions={routeData.routeGeometry.polyline}
                                                    pathOptions={{ color: '#fbcfe8', weight: 10, opacity: 0.6, lineCap: 'round' }}
                                                />
                                                <Polyline
                                                    positions={routeData.routeGeometry.polyline}
                                                    pathOptions={{ color: '#59112e', weight: 4, opacity: 1, dashArray: '10 10' }}
                                                />
                                            </>
                                        )}
                                    </MapContainer>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-[#fdf2f6]/30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-[#f2d8e4] shadow-xl">
                                                <div className="w-16 h-16 bg-[#fdf2f6] rounded-full flex items-center justify-center mx-auto mb-4 text-[#59112e]">
                                                    <MapIcon size={32} />
                                                </div>
                                                <h3 className="text-lg font-bold text-[#2d0b16]">Map Inactive</h3>
                                                <p className="text-sm text-[#6b4c59] mt-1">Run route optimization to visualize path.</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- MODE 2: ONDC / 3PL --- */}
                    {(activeMode === 'ondc' || activeMode === '3pl') && (
                        <div className="w-full max-w-5xl mx-auto space-y-6">
                            <div className="bg-[#59112e] text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                                <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
                                <h2 className="text-3xl font-bold relative z-10 mb-2">
                                    {activeMode === 'ondc' ? 'ONDC Return Trucks' : '3PL Forward Logistics'}
                                </h2>
                                <p className="text-white/80 relative z-10 max-w-xl text-lg">
                                    {activeMode === 'ondc'
                                        ? 'Find empty trucks returning on your route. Save up to 40% on logistics costs.'
                                        : 'Instant quotes from India\'s top logistics partners. Optimized for bulk and weight.'}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(activeMode === 'ondc' ? ONDC_DRIVERS : LOGISTICS_PARTNERS).map(item => (
                                    <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-[#f2d8e4] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-[#fdf2f6] rounded-2xl flex items-center justify-center text-[#59112e] group-hover:bg-[#59112e] group-hover:text-white transition-colors">
                                                {activeMode === 'ondc' ? <Truck size={24} /> : <Package size={24} />}
                                            </div>
                                            {activeMode === 'ondc' && (
                                                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg border border-emerald-100">
                                                    {item.match} Match
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-[#2d0b16] mb-1">{item.name}</h3>
                                        <p className="text-sm text-[#6b4c59] mb-4">{activeMode === 'ondc' ? item.vehicle : item.type}</p>
                                        <div className="border-t border-[#f2d8e4] pt-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] text-[#6b4c59] uppercase font-bold tracking-wider">Cost</p>
                                                <p className="text-xl font-bold text-[#59112e]">{item.cost}</p>
                                            </div>
                                            <button className="w-10 h-10 rounded-full border border-[#f2d8e4] flex items-center justify-center text-[#59112e] hover:bg-[#59112e] hover:text-white transition-colors">
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouteOptimizer;