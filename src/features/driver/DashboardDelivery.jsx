import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bike,
    Navigation,
    ChevronRight,
    Calendar,
    DollarSign,
    CheckCircle2,
    TrendingUp,
} from 'lucide-react';

import StatCard from './components/StatCard';
import OrderCard from './components/OrderCard';
import ProgressBar from './components/ProgressBar';
import ChatWidget from './components/ChatWidget';

// --- MOCK DATA ---

const STATS = [
    { label: "Earnings", value: "₹1,240", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", subtitle: "Today" },
    { label: "Trips", value: "8", icon: Bike, color: "text-[#59112e]", bg: "bg-[#fdf2f6]", subtitle: "Completed" },
    { label: "On-Time", value: "98%", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50", subtitle: "Delivery rate" },
    { label: "Rating", value: "4.9", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", subtitle: "This week" },
];

const PRIORITY_ORDERS = [
    {
        id: "DEL-882",
        time: "10:30 AM",
        shop: "Acme Hub",
        customer: "Urban Tech Park, Hinjewadi",
        pay: "₹120",
        distance: "4.2 km",
        items: "Electronics",
        status: "Pending",
        tag: "High Pay",
        contactName: "Rajesh Kumar",
    },
    {
        id: "DEL-991",
        time: "01:15 PM",
        shop: "Fresh Market",
        customer: "Green Valley Apts, Baner",
        pay: "₹95",
        distance: "2.8 km",
        items: "Perishables",
        status: "Scheduled",
        tag: "Fragile",
        contactName: "Sarah Jenkins",
    }
];

const STANDARD_ORDERS = [
    {
        id: "STD-442",
        window: "< 6 PM",
        shop: "Acme Hub",
        customer: "Westside Mall, Kothrud",
        pay: "₹65",
        distance: "1.5 km",
        items: "Chairs",
        status: "In Queue",
        contactName: "Amit Patel",
    },
    {
        id: "STD-551",
        window: "Anytime",
        shop: "Gen. Store",
        customer: "City Library, Shivajinagar",
        pay: "₹50",
        distance: "3.0 km",
        items: "Stationery",
        status: "In Queue",
        contactName: "Priya Sharma",
    },
    {
        id: "STD-662",
        window: "Anytime",
        shop: "Hardware Depot",
        customer: "Ramesh House, Karve Nagar",
        pay: "₹45",
        distance: "1.2 km",
        items: "Tools",
        status: "In Queue",
        contactName: "Ramesh H.",
    }
];

const DashboardDelivery = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatContact, setChatContact] = useState(null);

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const openChat = (order) => {
        setChatContact({
            name: order.contactName || order.shop,
            shop: order.shop,
            avatar: (order.contactName || order.shop).charAt(0),
            orderId: order.id,
            pay: order.pay,
        });
        setChatOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-outfit">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8">

                {/* === TOP SECTION: GREETING + TOGGLE === */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, John 👋
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
                    {STATS.map((stat, idx) => (
                        <StatCard key={idx} {...stat} />
                    ))}
                </div>

                {/* === DAILY TARGET PROGRESS === */}
                <div className="mb-8">
                    <ProgressBar
                        label="Daily Earnings Target"
                        current={1240}
                        target={2000}
                        unit="₹"
                    />
                </div>

                {/* === ACTIVE TRIP BAR === */}
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
                            <h4 className="text-lg font-bold">Acme Warehouse A</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="text-right">
                            <p className="text-lg font-bold">3 min</p>
                            <p className="text-xs text-white/50 font-medium">0.8 km away</p>
                        </div>
                        <button className="w-11 h-11 bg-white text-[#59112e] rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </motion.div>

                {/* === ORDERS SECTION === */}
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight mb-1">Available Orders</h2>
                    <p className="text-sm text-slate-500 font-medium">Accept deliveries to start earning</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                    {/* Priority Orders Column */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                            <h3 className="text-base md:text-lg font-bold text-slate-700">Priority Orders</h3>
                            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                                {PRIORITY_ORDERS.length}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {PRIORITY_ORDERS.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    variant="priority"
                                    onAccept={() => alert(`Accepted ${order.id}`)}
                                    onViewRoute={() => alert(`Viewing route for ${order.id}`)}
                                    onChat={() => openChat(order)}
                                    onCall={() => alert(`Calling ${order.contactName || order.shop}...`)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Standard Orders Column */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            <h3 className="text-base md:text-lg font-bold text-slate-700">Standard Orders</h3>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                {STANDARD_ORDERS.length}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {STANDARD_ORDERS.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    variant="standard"
                                    onAccept={() => alert(`Accepted ${order.id}`)}
                                    onChat={() => openChat(order)}
                                    onCall={() => alert(`Calling ${order.contactName || order.shop}...`)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

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