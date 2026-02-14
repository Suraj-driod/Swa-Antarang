import { useState, useEffect } from 'react';
import DriverMapLayout from '../../components/driver/DriverMapLayout';
import RouteMap from '../../components/map/TradeMap';
import {
    Package,
    MapPin,
    IndianRupee,
    Truck,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

// ─── Mock active order data (replace with real API later) ────────────────
const MOCK_ORDER = {
    id: 'ORD-7821',
    customerName: 'Arjun Sharma',
    pickupAddress: 'Connaught Place, Block A, New Delhi',
    dropAddress: '12, Lodhi Road, New Delhi',
    amount: 1250,
    status: 'In Transit', // "Picked Up" | "In Transit" | "Delivered"
    pickup: { lat: 28.6315, lng: 77.2167 },
    drop: { lat: 28.5916, lng: 77.2273 },
};

const STATUS_STYLES = {
    'Picked Up': {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
    },
    'In Transit': {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
    },
    Delivered: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
    },
};

// ─── Order Info Panel ────────────────────────────────────────────────────
function OrderInfoPanel({ order }) {
    const [collapsed, setCollapsed] = useState(false);
    const style = STATUS_STYLES[order.status] || STATUS_STYLES['In Transit'];

    return (
        <div className="absolute top-4 right-4 z-[1000] pointer-events-auto w-80 max-w-[calc(100vw-2rem)]">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden transition-all">
                {/* Header — always visible */}
                <button
                    onClick={() => setCollapsed((c) => !c)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50/60 transition-colors"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#fdf2f6] flex items-center justify-center text-[#59112e] shrink-0 shadow-inner">
                            <Truck size={20} />
                        </div>
                        <div className="min-w-0 text-left">
                            <p className="text-sm font-bold text-slate-800 truncate">
                                {order.id}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span
                                    className={`relative flex h-2 w-2 shrink-0`}
                                >
                                    <span
                                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`}
                                    />
                                    <span
                                        className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`}
                                    />
                                </span>
                                <span
                                    className={`text-[11px] font-semibold ${style.text}`}
                                >
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    {collapsed ? (
                        <ChevronDown size={18} className="text-slate-400 shrink-0" />
                    ) : (
                        <ChevronUp size={18} className="text-slate-400 shrink-0" />
                    )}
                </button>

                {/* Details — collapsible */}
                {!collapsed && (
                    <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
                        {/* Customer */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#fdf2f6] flex items-center justify-center text-[#59112e] shrink-0">
                                <span className="text-sm font-bold">
                                    {order.customerName.charAt(0)}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                    Customer
                                </p>
                                <p className="text-sm font-bold text-slate-800 truncate">
                                    {order.customerName}
                                </p>
                            </div>
                        </div>

                        {/* Addresses */}
                        <div className="space-y-2 pl-1">
                            <div className="flex items-start gap-2.5">
                                <Package size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                        Pickup
                                    </p>
                                    <p className="text-xs text-slate-700 leading-relaxed">
                                        {order.pickupAddress}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <MapPin size={14} className="text-rose-500 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                        Drop
                                    </p>
                                    <p className="text-xs text-slate-700 leading-relaxed">
                                        {order.dropAddress}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-200">
                            <span className="text-xs font-semibold text-slate-500">
                                Order Total
                            </span>
                            <div className="flex items-center gap-1 text-[#59112e] font-bold text-sm">
                                <IndianRupee size={14} />
                                {order.amount.toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Page Component ──────────────────────────────────────────────────────
export default function DriverMapsPage() {
    const [driverLocation, setDriverLocation] = useState({
        lat: 28.6139,
        lng: 77.209,
    });
    const order = MOCK_ORDER;

    // Simulate live location updates
    useEffect(() => {
        const interval = setInterval(() => {
            setDriverLocation((prev) => ({
                lat: prev.lat + (Math.random() - 0.5) * 0.0005,
                lng: prev.lng + (Math.random() - 0.5) * 0.0005,
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Build delivery points from the active order
    const deliveryPoints = [
        {
            id: 'pickup',
            lat: order.pickup.lat,
            lng: order.pickup.lng,
            address: order.pickupAddress,
            priority: true,
            type: 'pickup',
        },
        {
            id: 'drop',
            lat: order.drop.lat,
            lng: order.drop.lng,
            address: order.dropAddress,
            priority: false,
            type: 'drop',
        },
    ];

    return (
        <DriverMapLayout>
            <RouteMap
                driverLocation={driverLocation}
                deliveryPoints={deliveryPoints}
                showDefaultPanel={false}
            />
            <OrderInfoPanel order={order} />
        </DriverMapLayout>
    );
}
