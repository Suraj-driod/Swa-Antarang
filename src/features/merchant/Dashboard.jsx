import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Truck, 
  Clock, 
  ChevronRight, 
  Lightbulb, 
  MoreHorizontal,
  ArrowUpRight,
  Calendar,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Search
} from 'lucide-react';

// --- MOCK DATA ---

const KPI_STATS = [
  { 
    id: 1, 
    label: "Critical Stock", 
    value: "12", 
    sub: "Items below MOQ", 
    icon: AlertTriangle, 
    color: "text-rose-600", 
    bg: "bg-rose-50", 
    border: "border-rose-100" 
  },
  { 
    id: 2, 
    label: "Healthy Stock", 
    value: "148", 
    sub: "92% of Inventory", 
    icon: CheckCircle2, 
    color: "text-emerald-600", 
    bg: "bg-emerald-50", 
    border: "border-emerald-100" 
  },
  { 
    id: 3, 
    label: "Pending Orders", 
    value: "5", 
    sub: "Needs Approval", 
    icon: Clock, 
    color: "text-amber-600", 
    bg: "bg-amber-50", 
    border: "border-amber-100" 
  },
  { 
    id: 4, 
    label: "Today's Revenue", 
    value: "$2.4k", 
    sub: "+12% from yesterday", 
    icon: DollarSign, 
    color: "text-[#59112e]", 
    bg: "bg-[#fdf2f6]", 
    border: "border-[#f2d8e4]" 
  },
];

const AGENDA_ITEMS = [
  { id: 1, type: 'order', title: "Review Bulk Request", desc: "Urban Furnishings • 500 Units", time: "10:30 AM", priority: "High" },
  { id: 2, type: 'delivery', title: "Incoming Shipment", desc: "Raw Aluminum • Tata Logistics", time: "02:00 PM", priority: "Medium" },
  { id: 3, type: 'order', title: "Dispatch B2C Order", desc: "Sarah Jenkins • 1 Chair", time: "04:15 PM", priority: "Normal" },
];

const TOP_SELLERS = [
  { name: "Teak Wood Planks", sales: 85, trend: "up", sku: "TW-001" },
  { name: "Industrial Fasteners", sales: 62, trend: "up", sku: "IF-992" },
  { name: "Cotton Fabric", sales: 40, trend: "stable", sku: "CF-221" },
];

const SLOW_MOVERS = [
  { name: "Polyurethane Foam", sales: 5, trend: "down", sku: "PF-110" },
  { name: "Varnish Grade-B", sales: 8, trend: "down", sku: "VG-002" },
];

// --- COMPONENTS ---

// 1. Enhanced Chart with Grid Lines
const SalesChart = () => (
  <div className="relative h-56 w-full mt-6">
    {/* Grid Lines */}
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
      <div className="w-full h-px bg-slate-100"></div>
      <div className="w-full h-px bg-slate-100"></div>
      <div className="w-full h-px bg-slate-100"></div>
      <div className="w-full h-px bg-slate-100"></div>
      <div className="w-full h-px bg-slate-200"></div> {/* Baseline */}
    </div>

    {/* SVG Chart */}
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#59112e" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#59112e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path 
        d="M0,150 Q150,50 300,100 T600,60 V224 H0 Z" 
        fill="url(#chartGradient)" 
      />
      <path 
        d="M0,150 Q150,50 300,100 T600,60" 
        fill="none" 
        stroke="#59112e" 
        strokeWidth="3" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    
    {/* Data Points with Tooltips */}
    <div className="absolute top-[38%] left-[25%] group">
        <div className="w-3 h-3 bg-white border-2 border-[#59112e] rounded-full shadow-sm z-10 relative cursor-pointer hover:scale-125 transition-transform"></div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#2d0b16] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            $1,200
        </div>
    </div>
    <div className="absolute top-[18%] left-[50%] group">
        <div className="w-3 h-3 bg-white border-2 border-[#59112e] rounded-full shadow-sm z-10 relative cursor-pointer hover:scale-125 transition-transform"></div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#2d0b16] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            $2,450
        </div>
    </div>
    <div className="absolute top-[35%] left-[75%] group">
        <div className="w-3 h-3 bg-white border-2 border-[#59112e] rounded-full shadow-sm z-10 relative cursor-pointer hover:scale-125 transition-transform"></div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#2d0b16] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            $1,800
        </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-outfit p-6 md:p-10 pb-20">
      
      {/* --- HERO BANNER (Beckn Style - Centered & Themed) --- */}
      <div className="mb-12 relative w-full min-h-[420px] rounded-[40px] overflow-hidden shadow-sm border border-slate-100 bg-white">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ 
            backgroundImage: `url('https://becknprotocol.io/wp-content/uploads/2022/03/beckn-header-bg.jpg')`
          }}
        />
        
        {/* Radial Overlay for Center Readability - Tinted slightly Warm */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/95 via-white/70 to-white/40"></div>

        {/* Content Overlay - Centered Alignment */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-20">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5 }}
             className="mb-2"
           >
             <span className="px-4 py-1.5 rounded-full bg-[#fdf2f6] text-[#59112e] text-xs font-bold uppercase tracking-widest border border-[#f2d8e4]">
                Merchant OS v2.0
             </span>
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight mt-4 mb-6 font-serif"
           >
             The network's leap<br/>
             for <span className="text-[#59112e] italic">commerce.</span>
           </motion.h1>
           
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl leading-relaxed"
           >
             SupplierMatch is a universal resource discovery and inventory protocol that enables the leap to open, decentralized, and interoperable supply chains.
           </motion.p>
           
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
           >
              {/* Primary Button - Burgundy */}
              <button className="px-8 py-4 bg-[#59112e] hover:bg-[#450d24] text-white rounded-full font-bold text-base shadow-lg shadow-[#59112e]/20 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                 Start Broadcasting
              </button>
              
              {/* Secondary Button - Soft Pink/Burgundy Outline */}
              <button className="px-8 py-4 bg-[#fdf2f6] text-[#59112e] border border-[#f2d8e4] rounded-full font-bold text-base hover:bg-white hover:border-[#59112e]/30 transition-all flex items-center justify-center gap-2">
                 Join the Collective
              </button>
           </motion.div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Today's Overview</h2>
          <p className="text-slate-500 mt-1 font-medium">Key performance indicators for <span className="text-[#59112e] font-bold">Acme Supplies</span></p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-[#59112e] bg-white px-5 py-2.5 rounded-xl border border-[#f2d8e4] shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <Calendar size={18} />
          <span>Feb 14, 2026</span>
        </div>
      </div>

      {/* 1. KPI Tiles Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {KPI_STATS.map((stat, idx) => (
          <motion.div 
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-[24px] bg-white border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all group relative overflow-hidden`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-sm`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              {stat.id === 1 && <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-pulse ring-4 ring-rose-100"></span>}
            </div>
            <div>
              <h3 className="text-4xl font-bold text-slate-800 mb-1 tracking-tight">{stat.value}</h3>
              <p className="text-sm text-slate-600 font-bold">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (Analytics & Inventory) --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Sales Analytics Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 size={20} className="text-[#59112e]"/> Sales Performance
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Revenue vs. Previous Period</p>
              </div>
              <div className="flex bg-[#f8f9fa] p-1 rounded-xl border border-slate-100">
                  <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold text-[#59112e]">Weekly</button>
                  <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-[#59112e]">Monthly</button>
              </div>
            </div>
            
            <SalesChart />
            
            <div className="grid grid-cols-3 gap-6 mt-8">
               <div className="text-center p-4 bg-[#fdf2f6] rounded-2xl border border-[#f2d8e4]">
                  <p className="text-xs text-[#6b4c59] font-bold uppercase tracking-wider">Total Orders</p>
                  <p className="text-2xl font-bold text-[#59112e] mt-1">1,240</p>
               </div>
               <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Conversion</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">3.2%</p>
               </div>
               <div className="text-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Returns</p>
                  <p className="text-2xl font-bold text-slate-700 mt-1">12</p>
               </div>
            </div>
          </motion.div>

          {/* Best / Worst Sellers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Sellers */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100"><TrendingUp size={20}/></div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Top Performers</h3>
                    <p className="text-xs text-slate-400 font-medium">Highest volume items</p>
                </div>
              </div>
              <div className="space-y-5">
                {TOP_SELLERS.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <div>
                          <span className="font-bold text-slate-700 block">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.sku}</span>
                      </div>
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg h-fit">{item.sales} sold</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.sales}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Slow Movers */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 border border-rose-100"><TrendingDown size={20}/></div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Slow Moving</h3>
                    <p className="text-xs text-slate-400 font-medium">Lowest volume items</p>
                </div>
              </div>
              <div className="space-y-5">
                {SLOW_MOVERS.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <div>
                          <span className="font-bold text-slate-700 block">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.sku}</span>
                      </div>
                      <span className="text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded-lg h-fit">{item.sales} sold</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: `${item.sales * 5}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>

        {/* --- RIGHT COLUMN (Agenda & Tips) --- */}
        <div className="space-y-8">
          
          {/* Today's Agenda */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-xl font-bold text-slate-800">Today's Agenda</h2>
              <span className="bg-[#59112e] text-white text-[10px] px-2.5 py-1 rounded-lg font-bold shadow-sm">3 Pending</span>
            </div>

            {/* Timeline List */}
            <div className="space-y-4 relative z-10">
              {AGENDA_ITEMS.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-[#f2d8e4] hover:shadow-md transition-all cursor-pointer group">
                  {/* Icon Marker */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                    item.type === 'order' 
                    ? 'bg-[#fdf2f6] text-[#59112e] border-[#f2d8e4]' 
                    : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {item.type === 'order' ? <ShoppingBag size={20} /> : <Truck size={20} />}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.priority === 'High' ? 'bg-rose-100 text-rose-600' : 
                          item.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                      }`}>{item.priority}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 truncate">{item.desc}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock size={10}/> {item.time}
                        </span>
                        <button className="text-[10px] font-bold text-[#59112e] flex items-center gap-1 group-hover:underline">
                            Action <ChevronRight size={10} />
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Insights / Tips Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#59112e] to-[#9d174d] p-8 rounded-[32px] text-white relative overflow-hidden shadow-2xl shadow-[#59112e]/20"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl -ml-5 -mb-5"></div>

            <div className="flex items-center gap-4 relative z-10 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Lightbulb size={24} className="text-yellow-300 fill-yellow-300/20" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Smart Insight</h3>
                <p className="text-xs text-white/80 font-medium">AI-Generated Tip</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
                <p className="text-sm leading-relaxed text-white/95">
                "Teak Wood" sales have spiked by <strong className="text-emerald-300">22%</strong> this week. You are projected to stock out in 4 days.
                </p>
            </div>

            <button className="w-full py-4 bg-white text-[#59112e] font-bold rounded-xl text-sm hover:bg-[#fdf2f6] transition-colors shadow-lg flex items-center justify-center gap-2 relative z-10">
              <Package size={18} /> Auto-Restock Now
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;