import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  Phone, 
  MessageSquare, 
  ChevronRight, 
  AlignLeft,
  Package,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Menu,
  ArrowRight
} from 'lucide-react';

// --- MOCK DATA ---

const STATS = [
  { label: "Earnings", value: "₹1,240", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Trips", value: "8", icon: Bike, color: "text-[#59112e]", bg: "bg-[#fdf2f6]" },
  { label: "On-Time", value: "98%", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
];

const PRIORITY_ORDERS = [
  { 
    id: "DEL-882", 
    time: "10:30 AM", 
    shop: "Acme Hub", 
    customer: "Urban Tech", 
    pay: "₹120", 
    distance: "4.2 km", 
    items: "Electronics",
    status: "Pending",
    tag: "High Pay"
  },
  { 
    id: "DEL-991", 
    time: "01:15 PM", 
    shop: "Fresh Market", 
    customer: "Sarah J.", 
    pay: "₹95", 
    distance: "2.8 km", 
    items: "Perishables",
    status: "Scheduled",
    tag: "Fragile"
  }
];

const STANDARD_ORDERS = [
  { 
    id: "STD-442", 
    window: "< 6 PM", 
    shop: "Acme Hub", 
    customer: "Westside", 
    pay: "₹65", 
    distance: "1.5 km", 
    items: "Chairs",
    status: "In Queue"
  },
  { 
    id: "STD-551", 
    window: "Anytime", 
    shop: "Gen. Store", 
    customer: "City Lib", 
    pay: "₹50", 
    distance: "3.0 km", 
    items: "Stationery",
    status: "In Queue"
  },
  { 
    id: "STD-662", 
    window: "Anytime", 
    shop: "Hardware", 
    customer: "Ramesh H.", 
    pay: "₹45", 
    distance: "1.2 km", 
    items: "Tools",
    status: "In Queue"
  }
];

const DashboardDelivery = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('priority'); // 'priority' | 'standard'

  return (
    // Outer Wrapper to center the "Phone" on desktop
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-outfit">
      
      {/* --- MOBILE CONTAINER (Restricted Width) --- */}
      <div className="w-full max-w-md bg-[#f8f9fa] min-h-[850px] h-[90vh] rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border-[8px] border-white ring-1 ring-slate-200">
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pb-32 no-scrollbar">
          
          {/* --- HEADER --- */}
          <div className="bg-white p-6 pb-6 rounded-b-[32px] shadow-sm relative z-20">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-inner">
                      <span className="text-slate-600 font-bold">JD</span>
                  </div>
                  <div>
                      <h1 className="text-lg font-bold text-slate-800 leading-none">Hello, John</h1>
                      <div className="flex items-center gap-1.5 mt-1">
                          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          <p className="text-xs text-slate-500 font-medium">{isOnline ? 'Online' : 'Offline'}</p>
                      </div>
                  </div>
               </div>
               
               {/* Compact Shift Toggle */}
               <button 
                 onClick={() => setIsOnline(!isOnline)}
                 className={`relative h-8 px-1 rounded-full flex items-center transition-all duration-300 shadow-sm border ${
                     isOnline ? 'bg-[#59112e] border-[#59112e] w-14' : 'bg-slate-100 border-slate-200 w-14'
                 }`}
               >
                  <motion.div 
                    layout
                    className={`absolute w-6 h-6 rounded-full shadow-md border-2 ${isOnline ? 'bg-white border-[#59112e]' : 'bg-slate-400 border-white'}`}
                    style={{ 
                        left: isOnline ? 'calc(100% - 28px)' : '2px',
                    }}
                  />
               </button>
            </div>

            {/* Date Badge */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overview</span>
                <div className="flex items-center gap-1.5 text-[#59112e] bg-[#fdf2f6] px-2.5 py-1 rounded-lg border border-[#f2d8e4]">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold">Feb 14</span>
                </div>
            </div>

            {/* KPI Stats - Compact Grid */}
            <div className="grid grid-cols-3 gap-2">
                {STATS.map((stat, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 p-2.5 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col items-center text-center">
                        <div className={`w-7 h-7 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-1.5`}>
                            <stat.icon size={14} />
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                        <span className="text-xs font-bold text-slate-800 mt-0.5">{stat.value}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* --- EARNINGS PROGRESS --- */}
          <div className="px-6 mt-6">
              <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-500">Daily Target</span>
                  <span className="text-xs font-bold text-[#59112e]">₹1,240 / ₹2,000</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '62%' }}
                    className="h-full bg-[#59112e] rounded-full"
                  />
              </div>
          </div>

          {/* --- TABS --- */}
          <div className="px-6 mt-6 mb-4">
             <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                 <button 
                    onClick={() => setActiveTab('priority')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'priority' ? 'bg-[#59112e] text-white shadow-sm' : 'text-slate-400 hover:text-[#59112e]'
                    }`}
                 >
                     Priority (2)
                 </button>
                 <button 
                    onClick={() => setActiveTab('standard')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'standard' ? 'bg-[#59112e] text-white shadow-sm' : 'text-slate-400 hover:text-[#59112e]'
                    }`}
                 >
                     Standard (4)
                 </button>
             </div>
          </div>

          {/* --- ORDERS GRID (Cards) --- */}
          <div className="px-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="grid grid-cols-2 gap-3"
                >
                    {(activeTab === 'priority' ? PRIORITY_ORDERS : STANDARD_ORDERS).map((order) => (
                        <div key={order.id} className="bg-white p-3.5 rounded-[20px] shadow-sm border border-slate-100 relative group flex flex-col justify-between hover:border-[#f2d8e4] transition-all h-[150px]">
                            
                            {/* Header */}
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    activeTab === 'priority' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                    {activeTab === 'priority' ? 'URGENT' : 'STD'}
                                </span>
                                <span className="text-xs font-bold text-[#59112e]">{order.pay}</span>
                            </div>

                            {/* Info */}
                            <div>
                                <h3 className="font-bold text-slate-800 text-xs leading-tight truncate mb-0.5">{order.shop}</h3>
                                <div className="flex items-center gap-1 text-[9px] text-slate-400">
                                    <span className="truncate max-w-[80px]">{order.customer}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between text-[9px] font-bold text-slate-500">
                                <span className="flex items-center gap-0.5">
                                    <Clock size={9} className={activeTab === 'priority' ? "text-rose-500" : ""} />
                                    {order.time || order.window}
                                </span>
                                <span className="flex items-center gap-0.5">
                                    <Navigation size={9} />
                                    {order.distance}
                                </span>
                            </div>

                            {/* Accept Overlay */}
                            <div className="absolute inset-0 bg-[#59112e]/95 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer">
                                <span className="text-white text-[10px] font-medium">Click to</span>
                                <span className="text-white text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Accept</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* --- FLOATING CURRENT TASK (Fixed to Container) --- */}
        <div className="absolute bottom-6 left-0 right-0 px-6 z-30">
            <motion.div 
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-[#2d0b16] text-white p-4 rounded-[24px] shadow-2xl flex items-center justify-between border border-white/10"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/10 relative">
                         <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-50"></div>
                        <Navigation size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider">Active Trip</p>
                        <h4 className="text-xs font-bold">Acme Warehouse A</h4>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="text-right mr-1">
                        <p className="text-xs font-bold">3 min</p>
                        <p className="text-[9px] text-white/60">0.8 km</p>
                    </div>
                    <button className="w-9 h-9 bg-white text-[#59112e] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </motion.div>
        </div>

      </div>
    </div>
  );
};

export default DashboardDelivery;