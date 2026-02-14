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
  Radar
} from 'lucide-react';

// --- MOCK DATA ---

// Own Fleet Route
const OPTIMIZED_STOPS = [
  { id: 1, name: "Downtown Hub", orders: 45, traffic: "Low", type: "Priority", time: "06:00 AM", status: "optimized" },
  { id: 2, name: "Westside Market", orders: 12, traffic: "Med", type: "Standard", time: "07:45 AM", status: "optimized" },
  { id: 3, name: "Industrial Zone", orders: 8, traffic: "High", type: "Avoided", time: "11:00 AM", status: "delayed" }, 
  { id: 4, name: "Suburban Drop", orders: 22, traffic: "Low", type: "Standard", time: "01:30 PM", status: "optimized" },
];

// ONDC Matches
const ONDC_DRIVERS = [
  { id: 1, name: "Ramesh T.", vehicle: "Tata Ace", route: "Mumbai -> Pune", match: "98%", cost: "₹850", rating: 4.8 },
  { id: 2, name: "SpeedLogistics", vehicle: "Eicher 14ft", route: "Thane -> Pune", match: "92%", cost: "₹1,200", rating: 4.5 },
];

// 3PL Providers
const LOGISTICS_PARTNERS = [
  { id: 1, name: "Delhivery", eta: "2 Days", cost: "₹450", type: "Express" },
  { id: 2, name: "Ekart", eta: "3 Days", cost: "₹380", type: "Standard" },
  { id: 3, name: "Shadowfax", eta: "Same Day", cost: "₹800", type: "Hyperlocal" },
];

// --- COMPONENTS ---

// 1. New "Radar Scan" Animation Overlay
const AIProcessingOverlay = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const stages = [
    { text: "Connecting to TomTom Traffic API...", icon: Layers },
    { text: "Analyzing Order Density Heatmap...", icon: BarChart3 },
    { text: "Checking Festival Restrictions...", icon: ShieldCheck },
    { text: "Optimizing Fuel Efficiency...", icon: Zap },
    { text: "Route Generation Complete.", icon: CheckCircle }
  ];

  useEffect(() => {
    if (stage < stages.length - 1) {
      const timer = setTimeout(() => setStage(prev => prev + 1), 1200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const CurrentIcon = stages[stage].icon;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-[#2d0b16]/95 backdrop-blur-xl flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* Background Radar Effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
         <div className="w-[600px] h-[600px] border border-[#59112e] rounded-full animate-[ping_3s_linear_infinite]"></div>
         <div className="w-[400px] h-[400px] border border-[#59112e] rounded-full absolute animate-[ping_3s_linear_infinite_1s]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          key={stage}
          initial={{ scale: 0.8, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -10 }}
          className="mb-8"
        >
           <div className="w-20 h-20 bg-gradient-to-br from-[#59112e] to-[#851e45] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#59112e]/50 text-white">
              <CurrentIcon size={40} className="animate-pulse" />
           </div>
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">AI Optimization Engine</h2>
        <div className="h-6 overflow-hidden relative w-96">
            <AnimatePresence mode="wait">
                <motion.p 
                    key={stage}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-emerald-400 font-mono text-sm font-medium w-full absolute"
                >
                    {">"} {stages[stage].text}
                </motion.p>
            </AnimatePresence>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
            <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: "0%" }}
                animate={{ width: `${((stage + 1) / stages.length) * 100}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
      </div>
    </motion.div>
  );
};

// Helper for icon
const CheckCircle = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
)

const RouteOptimizer = () => {
  const [activeMode, setActiveMode] = useState('own'); // 'own', 'ondc', '3pl'
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [routeReady, setRouteReady] = useState(false);

  const startOptimization = () => {
      setRouteReady(false);
      setIsOptimizing(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-outfit text-[#2d0b16] flex flex-col md:flex-row overflow-hidden">
      
      {/* === LEFT SIDEBAR === */}
      <div className="w-full md:w-[88px] bg-white border-r border-[#f2d8e4] flex flex-col items-center py-8 gap-8 z-30 shadow-[4px_0_24px_rgba(89,17,46,0.02)]">
         <div className="w-11 h-11 rounded-2xl bg-[#59112e] flex items-center justify-center text-white shadow-lg shadow-[#59112e]/20">
            <Truck size={22} />
         </div>
         <nav className="flex flex-col gap-6 w-full items-center mt-4">
            <button 
                onClick={() => setActiveMode('own')}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeMode === 'own' ? 'bg-[#fdf2f6] text-[#59112e] shadow-inner' : 'text-gray-300 hover:text-[#59112e] hover:bg-gray-50'}`}
                title="Own Fleet"
            >
                <MapIcon size={22} strokeWidth={activeMode === 'own' ? 2.5 : 2} />
            </button>
            <button 
                onClick={() => setActiveMode('ondc')}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeMode === 'ondc' ? 'bg-[#fdf2f6] text-[#59112e] shadow-inner' : 'text-gray-300 hover:text-[#59112e] hover:bg-gray-50'}`}
                title="ONDC Empty Trucks"
            >
                <Navigation size={22} strokeWidth={activeMode === 'ondc' ? 2.5 : 2} />
            </button>
            <button 
                onClick={() => setActiveMode('3pl')}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeMode === '3pl' ? 'bg-[#fdf2f6] text-[#59112e] shadow-inner' : 'text-gray-300 hover:text-[#59112e] hover:bg-gray-50'}`}
                title="3PL Partners"
            >
                <Package size={22} strokeWidth={activeMode === '3pl' ? 2.5 : 2} />
            </button>
         </nav>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="flex-1 flex flex-col h-screen relative bg-[#fafafa]">
        
        {/* Header */}
        <div className="h-24 px-10 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm border-b border-[#f2d8e4] z-20">
            <div>
                <h1 className="text-3xl font-bold text-[#59112e] tracking-tight">Route Optimization</h1>
                <p className="text-sm text-[#6b4c59] font-medium mt-1">
                    {activeMode === 'own' ? 'AI-powered fleet management' : activeMode === 'ondc' ? 'Find empty returning trucks' : 'Compare logistics partners'}
                </p>
            </div>
            
            {activeMode === 'own' && (
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#6b4c59] uppercase tracking-wider">Live Traffic</span>
                    <button className="w-12 h-6 bg-emerald-500 rounded-full relative shadow-inner transition-colors">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </button>
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
                            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden z-50 shadow-2xl">
                                <AIProcessingOverlay onComplete={() => { setIsOptimizing(false); setRouteReady(true); }} />
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Left: Route List */}
                    <div className="w-[420px] bg-white rounded-[2.5rem] border border-[#f2d8e4] shadow-sm flex flex-col overflow-hidden transition-all duration-500">
                        <div className="p-8 border-b border-[#f2d8e4]">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-[#2d0b16]">Driver: Rajesh K.</h2>
                                    <p className="text-xs text-[#6b4c59] mt-1">Vehicle: Tata Ace (MH-12-8822)</p>
                                </div>
                                <div className="bg-[#fdf2f6] p-2 rounded-xl text-[#59112e]">
                                    <Truck size={20} />
                                </div>
                            </div>

                            {!routeReady ? (
                                <div className="bg-[#fdf2f6] rounded-2xl p-6 text-center border border-[#f2d8e4] border-dashed">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-[#59112e] shadow-sm">
                                        <Zap size={24} />
                                    </div>
                                    <h3 className="font-bold text-[#2d0b16] mb-1">Route Not Optimized</h3>
                                    <p className="text-xs text-[#6b4c59] mb-4">Run AI to calculate the most efficient path based on orders & traffic.</p>
                                    <button 
                                        onClick={startOptimization}
                                        className="w-full py-3.5 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#59112e]/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                                    >
                                        <Radar size={16} /> Start AI Optimization
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase">Time Saved</p>
                                        <p className="text-lg font-bold text-emerald-700">45m</p>
                                    </div>
                                    <div className="flex-1 bg-blue-50 border border-blue-100 p-3 rounded-xl">
                                        <p className="text-[10px] text-blue-600 font-bold uppercase">Fuel Saved</p>
                                        <p className="text-lg font-bold text-blue-700">2.4L</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {routeReady && (
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {OPTIMIZED_STOPS.map((stop, idx) => (
                                    <div key={stop.id} className="relative pl-8">
                                        {/* Timeline */}
                                        <div className="absolute left-3 top-3 bottom-[-20px] w-0.5 bg-[#f2d8e4] last:hidden"></div>
                                        <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-[3px] border-white shadow-md z-10 flex items-center justify-center text-[10px] font-bold ${
                                            stop.status === 'delayed' ? 'bg-amber-500 text-white' : 'bg-[#59112e] text-white'
                                        }`}>
                                            {idx + 1}
                                        </div>

                                        <div className={`p-4 rounded-2xl border transition-all ${
                                            stop.status === 'delayed' ? 'bg-amber-50 border-amber-200' : 'bg-white border-[#f2d8e4] hover:border-[#59112e]/30'
                                        }`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-[#2d0b16]">{stop.name}</h4>
                                                <span className="text-xs font-bold text-[#59112e]">{stop.time}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="text-[10px] bg-[#fdf2f6] text-[#59112e] px-2 py-1 rounded-lg font-medium border border-[#f2d8e4]">
                                                    {stop.orders} Orders
                                                </span>
                                                <span className={`text-[10px] px-2 py-1 rounded-lg font-medium border ${
                                                    stop.traffic === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                    Traffic: {stop.traffic}
                                                </span>
                                            </div>
                                            {stop.status === 'delayed' && (
                                                <p className="text-[10px] text-amber-600 mt-2 font-medium flex items-center gap-1">
                                                    <Clock size={10} /> AI Rescheduled to avoid peak traffic
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {routeReady && (
                            <div className="p-6 border-t border-[#f2d8e4] bg-[#fafafa]">
                                <button className="w-full py-4 bg-[#59112e] text-white font-bold rounded-xl text-sm shadow-xl shadow-[#59112e]/20 flex items-center justify-center gap-2 hover:bg-[#450d24] transition-colors">
                                    <Send size={18} /> Push to Driver App
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Map Visualization */}
                    <div className="flex-1 bg-white rounded-[2.5rem] border border-[#f2d8e4] shadow-sm relative overflow-hidden group">
                        {/* Map Background (Mock) */}
                        <div className="absolute inset-0 bg-[#fdf2f6]/30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50"></div>
                        
                        {/* Map Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                            
                            {routeReady && (
                                <motion.path 
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                    d="M 100 400 Q 250 300 350 200 T 600 100" 
                                    fill="none" 
                                    stroke="#59112e" 
                                    strokeWidth="4" 
                                    strokeLinecap="round"
                                    className="drop-shadow-lg"
                                />
                            )}
                        </svg>

                        {/* Map Pins */}
                        {routeReady && (
                            <>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} className="absolute top-[380px] left-[80px] bg-white p-2 rounded-xl shadow-lg border border-[#f2d8e4] flex items-center gap-2">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-bold text-[#2d0b16]">Start</span>
                                </motion.div>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} className="absolute top-[80px] left-[580px] bg-[#59112e] text-white p-2 rounded-xl shadow-lg flex items-center gap-2">
                                    <MapPin size={12} />
                                    <span className="text-xs font-bold">End</span>
                                </motion.div>
                            </>
                        )}

                        {!routeReady && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-[#f2d8e4] shadow-xl">
                                    <div className="w-16 h-16 bg-[#fdf2f6] rounded-full flex items-center justify-center mx-auto mb-4 text-[#59112e]">
                                        <MapIcon size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#2d0b16]">Map Inactive</h3>
                                    <p className="text-sm text-[#6b4c59] mt-1">Run route optimization to visualize path.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- MODE 2: ONDC / 3PL (Simplified for brevity but styled consistently) --- */}
            {(activeMode === 'ondc' || activeMode === '3pl') && (
                <div className="w-full max-w-5xl mx-auto space-y-6">
                    {/* Header Card */}
                    <div className="bg-[#59112e] text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
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
                                        {activeMode === 'ondc' ? <Truck size={24}/> : <Package size={24}/>}
                                    </div>
                                    {activeMode === 'ondc' && (
                                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg border border-emerald-100">
                                            {item.match} Match
                                        </span>
                                    )}
                                </div>
                                
                                <h3 className="text-xl font-bold text-[#2d0b16] mb-1">{item.name}</h3>
                                <p className="text-sm text-[#6b4c59] mb-4">
                                    {activeMode === 'ondc' ? item.vehicle : item.type}
                                </p>
                                
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