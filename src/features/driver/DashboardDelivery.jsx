import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Bike,
    Navigation,
    ChevronRight,
    Calendar,
    DollarSign,
    CheckCircle2,
    TrendingUp,
    PackageX
} from 'lucide-react';

import { useAuth } from '../../app/providers/AuthContext';
import { supabase } from '../../services/supabaseClient';

import StatCard from './components/StatCard';
import OrderCard from './components/OrderCard';
import ProgressBar from './components/ProgressBar';
import ChatWidget from './components/ChatWidget';

const DashboardDelivery = () => {
    const { user } = useAuth();
    const [isOnline, setIsOnline] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatContact, setChatContact] = useState(null);

    // Data State
    const [stats, setStats] = useState([
        { label: "Earnings", value: "₹0", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", subtitle: "Today" },
        { label: "Trips", value: "0", icon: Bike, color: "text-[#59112e]", bg: "bg-[#fdf2f6]", subtitle: "Completed" },
        { label: "On-Time", value: "100%", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50", subtitle: "Delivery rate" },
        { label: "Rating", value: "5.0", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", subtitle: "This week" },
    ]);
    const [activeTrip, setActiveTrip] = useState(null);
    const [priorityOrders, setPriorityOrders] = useState([]);
    const [standardOrders, setStandardOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    useEffect(() => {
        if (user?.driverProfileId) {
            fetchDashboardData();
        } else if (user && !user.driverProfileId) {
            // User loaded but no driver profile - empty state
            setLoading(false);
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const driverId = user.driverProfileId;

            // 1. Fetch Completed Deliveries (Today) for Stats
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const { data: completed, error: statsError } = await supabase
                .from('deliveries')
                .select('*, order:orders(total_amount)')
                .eq('driver_id', driverId)
                .eq('status', 'delivered')
                .gte('delivered_at', startOfDay.toISOString());

            if (!statsError && completed) {
                const earnings = completed.reduce((sum, item) => sum + (item.order?.total_amount || 0), 0);
                const trips = completed.length;

                setStats(prev => [
                    { ...prev[0], value: `₹${earnings.toLocaleString()}` },
                    { ...prev[1], value: trips.toString() },
                    prev[2],
                    prev[3]
                ]);
            }

            // 2. Fetch Active Trip (In Transit / Picked Up)
            const { data: active, error: tripError } = await supabase
                .from('deliveries')
                .select(`
                    id, 
                    status, 
                    pickup_at,
                    order:orders(
                        id, 
                        shipping_address, 
                        merchant:merchant_profiles(business_name, address)
                    )
                `)
                .eq('driver_id', driverId)
                .in('status', ['picked_up', 'in_transit'])
                .single(); // Assuming only 1 active trip at a time

            if (!tripError && active) {
                setActiveTrip({
                    shopName: active.order?.merchant?.business_name || 'Unknown Hub',
                    status: active.status === 'picked_up' ? 'Heading to Drop' : 'Heading to Pickup',
                    time: 'On time', // Mocking estimated time for now
                    distance: 'Live'
                });
            } else {
                setActiveTrip(null);
            }

            // 3. Fetch Pending Orders (Assigned but not picked up)
            const { data: pending, error: pendingError } = await supabase
                .from('deliveries')
                .select(`
                    id,
                    status,
                    order:orders(
                        id,
                        total_amount,
                        shipping_address,
                        status,
                        merchant:merchant_profiles(business_name, address),
                        customer:profiles(full_name, phone)
                    )
                `)
                .eq('driver_id', driverId)
                .eq('status', 'pending');

            if (!pendingError && pending) {
                const priority = [];
                const standard = [];

                pending.forEach(d => {
                    // Normalize data structure for OrderCard
                    const orderData = {
                        id: d.order?.id?.slice(0, 8).toUpperCase() || 'ORD',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        shop: d.order?.merchant?.business_name || 'Merchant',
                        customer: d.order?.shipping_address?.addressLine || 'Customer Location',
                        pay: `₹${d.order?.total_amount || 0}`,
                        distance: 'Calculating...',
                        items: 'Package', // Placeholder as items are in sub-table
                        status: d.status,
                        tag: d.order?.total_amount > 1000 ? 'High Value' : 'Standard',
                        contactName: d.order?.shipping_address?.fullName || 'Customer',
                        fullOrder: d // Keep reference
                    };

                    if (d.order?.total_amount > 1000) {
                        priority.push(orderData);
                    } else {
                        standard.push(orderData);
                    }
                });

                setPriorityOrders(priority);
                setStandardOrders(standard);
            }

        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            // Don't show error boundary, just log
        } finally {
            setLoading(false);
        }
    };

    const openChat = (order) => {
        setChatContact({
            name: order.contactName || order.shop,
            shop: order.shop,
            avatar: (order.contactName || order.shop || '?').charAt(0),
            orderId: order.id,
            pay: order.pay,
        });
        setChatOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-full mb-3"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-outfit">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8">

                {/* === TOP SECTION: GREETING + TOGGLE === */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.fullName?.split(' ')[0] || 'Driver'} 👋
                        </h1>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                <Calendar size={16} className="text-[#59112e]" />
                                <span className="font-medium">{today}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                        <button
                            onClick={() => setIsOnline(!isOnline)}
                            className={`relative h-10 w-20 rounded-full flex items-center transition-all duration-300 shadow-inner border-2 ${isOnline
                                ? 'bg-[#59112e] border-[#59112e]'
                                : 'bg-slate-200 border-slate-200'
                                }`}
                        >
                            <motion.div
                                layout
                                className={`absolute w-8 h-8 rounded-full shadow-md border-2 ${isOnline ? 'bg-white border-[#59112e]' : 'bg-slate-400 border-white'
                                    }`}
                                style={{
                                    left: isOnline ? 'calc(100% - 34px)' : '2px',
                                }}
                            />
                            <span className={`absolute w-2.5 h-2.5 rounded-full top-3.5 ${isOnline ? 'left-3 bg-white/40 animate-pulse' : 'left-3 bg-slate-300'
                                }`} />
                        </button>
                    </div>
                </div>

                {/* === STAT CARDS GRID === */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
                    {stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} />
                    ))}
                </div>

                {/* === DAILY TARGET PROGRESS === */}
                <div className="mb-8">
                    <ProgressBar
                        label="Daily Earnings Target"
                        current={parseInt(stats[0].value.replace(/[^0-9]/g, '')) || 0}
                        target={5000}
                        unit="₹"
                    />
                </div>

                {/* === ACTIVE TRIP BAR === */}
                {activeTrip && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-[#2d0b16] text-white p-5 lg:p-6 rounded-2xl shadow-xl shadow-[#2d0b16]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border border-white/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/10 relative shrink-0">
                                <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping opacity-40"></div>
                                <Navigation size={22} />
                            </div>
                            <div>
                                <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Active Trip</p>
                                <h4 className="text-lg font-bold">{activeTrip.shopName}</h4>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                            <div className="text-right">
                                <p className="text-lg font-bold">{activeTrip.time}</p>
                                <p className="text-xs text-white/50 font-medium">{activeTrip.status}</p>
                            </div>
                            <button className="w-11 h-11 bg-white text-[#59112e] rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* === ORDERS SECTION === */}
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight mb-1">Available Orders</h2>
                    <p className="text-sm text-slate-500 font-medium">Accept deliveries to start earning</p>
                </div>

                {!activeTrip && priorityOrders.length === 0 && standardOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                            <PackageX size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No Orders Available</h3>
                        <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">
                            You're all caught up! New delivery requests will appear here when they become available.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                        {/* Priority Orders Column */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                                <h3 className="text-base md:text-lg font-bold text-slate-700">Priority Orders</h3>
                                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                                    {priorityOrders.length}
                                </span>
                            </div>

                            {priorityOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {priorityOrders.map((order) => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            variant="priority"
                                            onAccept={() => alert(`Accepted ${order.id}`)}
                                            onViewRoute={() => alert(`Viewing route for ${order.id}`)}
                                            onChat={() => openChat(order)}
                                            onCall={() => alert(`Calling ${order.contactName}...`)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic py-4">No priority orders currently.</p>
                            )}
                        </div>

                        {/* Standard Orders Column */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                <h3 className="text-base md:text-lg font-bold text-slate-700">Standard Orders</h3>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                    {standardOrders.length}
                                </span>
                            </div>

                            {standardOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {standardOrders.map((order) => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            variant="standard"
                                            onAccept={() => alert(`Accepted ${order.id}`)}
                                            onChat={() => openChat(order)}
                                            onCall={() => alert(`Calling ${order.contactName}...`)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic py-4">No standard orders currently.</p>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* Chat Widget */}
            <ChatWidget
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                contact={chatContact}
            />
        </div>
    );
};

export default DashboardDelivery;