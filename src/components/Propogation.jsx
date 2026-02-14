import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  MessageSquare, 
  Store, 
  Archive, 
  Radio, 
  MapPin, 
  Clock, 
  DollarSign, 
  X, 
  Check, 
  Send,
  MoreVertical,
  Filter,
  AlertCircle,
  RefreshCw,
  Search,
  ChevronRight,
  Briefcase
} from 'lucide-react';

// --- MOCK DATA ---

const INVENTORY_DATA = [
  { id: 1, name: "Teak Wood Planks", stock: 120, minLevel: 50, status: "Healthy", sku: "TW-882" },
  { id: 2, name: "Industrial Steel Fasteners", stock: 15, minLevel: 100, status: "Critical", sku: "SF-991" }, // Auto-Red
  { id: 3, name: "Aluminum Sheets (Raw)", stock: 4, minLevel: 20, status: "Low", sku: "AL-202" }, // Auto-Red
  { id: 4, name: "Cotton Fabric Rolls", stock: 200, minLevel: 50, status: "Healthy", sku: "CF-101" },
];

const MATCH_CARDS = [
  { 
    id: 101, 
    company: "Acme Industrial Supply", 
    item: "Steel Fasteners (Bulk)", 
    price: "$0.45/unit", 
    distance: "4.2 km", 
    delivery: "2 Days", 
    verified: true,
    rating: "98% On-time",
    image: "bg-slate-700" 
  },
  { 
    id: 102, 
    company: "Global Raw Materials", 
    item: "Aluminum Grade-A", 
    price: "$12.50/sheet", 
    distance: "12 km", 
    delivery: "Next Day", 
    verified: true,
    rating: "4.8 ★",
    image: "bg-stone-600" 
  },
  { 
    id: 103, 
    company: "FastLogistics Hub", 
    item: "Steel Fasteners", 
    price: "$0.42/unit", 
    distance: "25 km", 
    delivery: "5 Days", 
    verified: false,
    rating: "New Seller",
    image: "bg-zinc-500" 
  },
];

const CHATS = [
  { id: 1, name: "Office Chairs Ltd.", msg: "Can we negotiate the MOQ?", time: "2m ago", unread: true, initial: "O" },
  { id: 2, name: "TechComponents Inc.", msg: "Offer received: $1.20/u", time: "2h ago", unread: false, initial: "T" },
  { id: 3, name: "Global Textiles", msg: "Waiting for reply...", time: "1d ago", unread: false, initial: "G" },
];

const ACTIVE_PROPAGATIONS = [
  { id: 1, title: "Looking for: Raw Aluminum", radius: "20km", responses: 5, active: true },
  { id: 2, title: "Selling: Surplus Teak", radius: "50km", responses: 12, active: true },
];

// --- COMPONENTS ---

// 1. The Swipeable Card
const SwipeCard = ({ data, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Color overlays for swipe feedback
  const rotateRightOpacity = useTransform(x, [0, 150], [0, 1]);
  const rotateLeftOpacity = useTransform(x, [-150, 0], [1, 0]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 100) onSwipe('right');
    else if (info.offset.x < -100) onSwipe('left');
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, cursor: 'grab' }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing', scale: 1.02 }}
      className="absolute top-0 left-0 w-full h-full bg-white rounded-[2rem] shadow-2xl shadow-[#59112e]/10 overflow-hidden border border-[#f2d8e4] select-none z-20"
    >
        {/* Swipe Feedback Overlays */}
        <motion.div style={{ opacity: rotateRightOpacity }} className="absolute inset-0 bg-emerald-500/10 z-30 flex items-center justify-center pointer-events-none backdrop-blur-[1px]">
            <div className="bg-white/80 backdrop-blur-md border-4 border-emerald-500 text-emerald-600 text-3xl font-extrabold uppercase px-6 py-2 rounded-2xl -rotate-12 shadow-xl">Connect</div>
        </motion.div>
        <motion.div style={{ opacity: rotateLeftOpacity }} className="absolute inset-0 bg-rose-500/10 z-30 flex items-center justify-center pointer-events-none backdrop-blur-[1px]">
            <div className="bg-white/80 backdrop-blur-md border-4 border-rose-500 text-rose-600 text-3xl font-extrabold uppercase px-6 py-2 rounded-2xl rotate-12 shadow-xl">Pass</div>
        </motion.div>

      {/* Image / Preview Area */}
      <div className={`h-[58%] w-full ${data.image} relative flex items-end p-6`}>
         {/* Gradient Overlay for Text Readability */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

         {/* Badges */}
         <div className="absolute top-5 left-5 flex gap-2">
            {data.verified && (
                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Check size={10} strokeWidth={4} /> VERIFIED
                </span>
            )}
         </div>
         <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <MapPin size={10} /> {data.distance}
         </div>
         
         <div className="w-full relative z-10">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white leading-tight">{data.item}</h2>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-white font-bold">
                    {data.price}
                </div>
             </div>
             <div className="flex items-center gap-2 text-white/80 font-medium text-sm mt-1">
                <Store size={14} /> {data.company}
             </div>
         </div>
      </div>

      {/* Details Area */}
      <div className="p-6 h-[42%] flex flex-col">
         <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#fdf2f6]/50 border border-[#f2d8e4] p-3 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#fdf2f6] flex items-center justify-center text-[#59112e]">
                    <Clock size={16} />
                </div>
                <div>
                    <p className="text-[10px] text-[#6b4c59] uppercase tracking-wider font-bold">Delivery</p>
                    <p className="text-sm font-bold text-[#59112e]">{data.delivery}</p>
                </div>
            </div>
            <div className="bg-[#fdf2f6]/50 border border-[#f2d8e4] p-3 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#fdf2f6] flex items-center justify-center text-[#59112e]">
                    <Store size={16} />
                </div>
                <div>
                    <p className="text-[10px] text-[#6b4c59] uppercase tracking-wider font-bold">Seller</p>
                    <p className="text-sm font-bold text-[#59112e]">{data.rating}</p>
                </div>
            </div>
         </div>

         <div className="flex-1">
             <p className="text-sm text-[#6b4c59] leading-relaxed">
                High-tensile strength suitable for heavy machinery. ISO 9001 certified.
             </p>
         </div>

         <div className="flex gap-2 mt-auto">
            {['Steel', 'ISO 9001', 'Bulk'].map(tag => (
                <span key={tag} className="text-[10px] border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">{tag}</span>
            ))}
         </div>
      </div>
    </motion.div>
  );
};

// 2. Main Dashboard Component
const PropagationPanel = () => {
  const [activeSection, setActiveSection] = useState('inventory'); // 'inventory', 'discover'
  const [cards, setCards] = useState(MATCH_CARDS);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedRefillItem, setSelectedRefillItem] = useState(null);

  const handleSwipe = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const triggerRefill = (item) => {
      setSelectedRefillItem(item);
      setShowBroadcastModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-outfit text-[#2d0b16] flex flex-col md:flex-row overflow-hidden">
      
      {/* === LEFT SIDEBAR / NAV === */}
      <div className="w-full md:w-[88px] bg-white border-r border-[#f2d8e4] flex flex-col items-center py-8 gap-8 z-20 shadow-[4px_0_24px_rgba(89,17,46,0.02)]">
         <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#59112e] to-[#851e45] flex items-center justify-center text-white shadow-lg shadow-[#59112e]/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
         </div>
         <nav className="flex flex-col gap-6 w-full items-center mt-4">
            <button 
                onClick={() => setActiveSection('inventory')}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeSection === 'inventory' ? 'bg-[#fdf2f6] text-[#59112e] shadow-inner' : 'text-gray-300 hover:text-[#59112e] hover:bg-gray-50'}`}
            >
                <Archive size={22} strokeWidth={activeSection === 'inventory' ? 2.5 : 2} />
            </button>
            <button 
                onClick={() => setActiveSection('discover')}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeSection === 'discover' ? 'bg-[#fdf2f6] text-[#59112e] shadow-inner' : 'text-gray-300 hover:text-[#59112e] hover:bg-gray-50'}`}
            >
                <Radio size={22} strokeWidth={activeSection === 'discover' ? 2.5 : 2} />
            </button>
         </nav>
      </div>

      {/* === CENTER MAIN CONTENT === */}
      <div className="flex-1 flex flex-col relative h-screen overflow-hidden bg-[#fafafa]">
        
        {/* Header */}
        <div className="h-24 px-10 flex items-center justify-between shrink-0">
            <div>
                <h1 className="text-3xl font-bold text-[#59112e] tracking-tight">
                    {activeSection === 'inventory' ? 'Inventory' : 'Discovery'}
                </h1>
                <p className="text-sm text-[#6b4c59] font-medium mt-1">
                    {activeSection === 'inventory' ? 'Real-time stock monitoring' : 'Connect with suppliers'}
                </p>
            </div>
            
            {/* Merchant Badge (Replaces B2B Toggle) */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#f2d8e4] shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-[#59112e] uppercase tracking-wider">Merchant Console</span>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-10 pb-10 relative">
            
            {/* --- VIEW: INVENTORY --- */}
            {activeSection === 'inventory' && (
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="bg-white p-5 rounded-[20px] border border-[#f2d8e4]/60 shadow-sm flex items-center gap-5 relative overflow-hidden group hover:border-[#f2d8e4] transition-colors">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center relative z-10">
                                <AlertCircle size={24}/>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-[#2d0b16]">2</h3>
                                <p className="text-xs font-bold text-red-500 uppercase tracking-wide">Critical Low</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-[20px] border border-[#f2d8e4]/60 shadow-sm flex items-center gap-5 relative overflow-hidden group hover:border-[#f2d8e4] transition-colors">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center relative z-10">
                                <Check size={24}/>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-[#2d0b16]">145</h3>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Healthy Stock</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-[#6b4c59] uppercase text-xs tracking-wider mb-4 ml-1">Needs Attention (Auto-Red)</h3>
                        <div className="space-y-3">
                            {INVENTORY_DATA.map((item) => {
                                const isLow = item.stock < item.minLevel;
                                return (
                                    <div 
                                        key={item.id} 
                                        className={`flex items-center justify-between p-4 pr-6 rounded-2xl border transition-all duration-300 group ${
                                            isLow 
                                            ? 'bg-white border-l-4 border-l-red-500 border-y-red-100 border-r-red-100 shadow-[0_4px_20px_rgba(239,68,68,0.08)]' 
                                            : 'bg-white border-transparent border-l-4 border-l-emerald-500 hover:border-gray-200 shadow-sm opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${isLow ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'}`}>
                                                {item.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`font-bold text-lg ${isLow ? 'text-[#2d0b16]' : 'text-gray-600'}`}>{item.name}</h4>
                                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-mono">{item.sku}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                                            style={{ width: `${(item.stock / 200) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <p className={`text-xs font-bold ${isLow ? 'text-red-500' : 'text-emerald-600'}`}>
                                                        {item.stock} Units Left
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {isLow && (
                                                <button 
                                                    onClick={() => triggerRefill(item)}
                                                    className="px-5 py-2.5 bg-[#59112e] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#59112e]/25 hover:shadow-xl hover:translate-y-[-1px] transition-all flex items-center gap-2"
                                                >
                                                    <RefreshCw size={16} /> Refill Now
                                                </button>
                                            )}
                                            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 hover:text-[#59112e] transition-colors">
                                                <MoreVertical size={20}/>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* --- VIEW: DISCOVERY / TINDER --- */}
            {activeSection === 'discover' && (
                <div className="h-full flex flex-col items-center justify-center pb-10">
                    
                    {/* Controls */}
                    <div className="w-full max-w-[380px] flex justify-between items-end mb-8 px-1">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-[#6b4c59] uppercase tracking-wider">Budget</span>
                            <div className="bg-white border border-[#f2d8e4] px-3 py-1.5 rounded-lg text-xs font-bold text-[#59112e] shadow-sm">$0 - $5k</div>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="text-[10px] font-bold text-[#6b4c59] uppercase tracking-wider">Radius</span>
                            <div className="bg-white border border-[#f2d8e4] px-3 py-1.5 rounded-lg text-xs font-bold text-[#59112e] shadow-sm flex items-center gap-1">
                                <MapPin size={10}/> 50km
                            </div>
                        </div>
                    </div>

                    {/* Card Stack Container */}
                    <div className="relative w-full max-w-[380px] aspect-[3/4.2]">
                        {/* Background Stack Effect */}
                        {cards.length > 1 && (
                            <div className="absolute top-4 left-0 w-full h-full bg-white rounded-[2rem] shadow-sm border border-[#f2d8e4] scale-[0.95] opacity-50 z-0"></div>
                        )}
                        {cards.length > 2 && (
                            <div className="absolute top-8 left-0 w-full h-full bg-white rounded-[2rem] shadow-sm border border-[#f2d8e4] scale-[0.9] opacity-30 -z-10"></div>
                        )}

                        <AnimatePresence>
                            {cards.map((card, index) => (
                                index === cards.length - 1 && (
                                    <SwipeCard key={card.id} data={card} onSwipe={() => handleSwipe(card.id)} />
                                )
                            ))}
                        </AnimatePresence>
                        
                        {cards.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center flex-col text-center bg-white rounded-[2rem] border-2 border-dashed border-[#f2d8e4]">
                                <div className="w-20 h-20 rounded-full bg-[#fdf2f6] flex items-center justify-center mb-4 text-[#59112e] animate-pulse">
                                    <Search size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-[#59112e]">No matches found</h3>
                                <p className="text-sm text-[#6b4c59] mt-2 max-w-[200px]">We are broadcasting to more suppliers in your area...</p>
                                <button onClick={() => setCards(MATCH_CARDS)} className="mt-8 px-6 py-2 bg-[#59112e] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all">
                                    Refresh Radar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons (Bottom) */}
                    <div className="flex items-center gap-8 mt-10">
                        <button className="w-16 h-16 rounded-full bg-white border border-[#f2d8e4] text-rose-500 shadow-[0_8px_20px_rgba(244,63,94,0.15)] flex items-center justify-center hover:scale-110 hover:bg-rose-50 transition-all">
                            <X size={32} strokeWidth={2.5} />
                        </button>
                        <button className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#59112e] to-[#851e45] text-white shadow-[0_10px_30px_rgba(89,17,46,0.3)] flex items-center justify-center hover:scale-105 hover:shadow-[0_15px_40px_rgba(89,17,46,0.4)] transition-all">
                            <MessageSquare size={32} fill="currentColor" />
                        </button>
                        <button className="w-16 h-16 rounded-full bg-white border border-[#f2d8e4] text-emerald-500 shadow-[0_8px_20px_rgba(16,185,129,0.15)] flex items-center justify-center hover:scale-110 hover:bg-emerald-50 transition-all">
                            <Check size={32} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* --- BROADCAST REFILL MODAL --- */}
        {showBroadcastModal && (
            <div className="absolute inset-0 z-50 bg-[#2d0b16]/20 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl border border-white/50"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-[#59112e]">Broadcast Request</h2>
                            <p className="text-xs text-[#6b4c59] font-medium mt-1">Refill stock from verified suppliers</p>
                        </div>
                        <button onClick={() => setShowBroadcastModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"><X size={18}/></button>
                    </div>

                    <div className="bg-[#fdf2f6] p-5 rounded-2xl mb-8 flex items-center gap-4 border border-[#f2d8e4]">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#59112e] font-bold shadow-sm text-lg">
                            {selectedRefillItem?.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[10px] text-[#6b4c59] uppercase font-bold tracking-wider mb-0.5">Refilling Item</p>
                            <p className="font-bold text-lg text-[#2d0b16]">{selectedRefillItem?.name}</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-[#6b4c59] uppercase mb-2 block">Min Price</label>
                                <div className="relative">
                                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                    <input type="number" placeholder="0.00" className="w-full pl-8 py-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-[#59112e] focus:bg-white transition-all font-bold text-[#2d0b16]" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#6b4c59] uppercase mb-2 block">Max Price</label>
                                <div className="relative">
                                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                    <input type="number" placeholder="0.00" className="w-full pl-8 py-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-[#59112e] focus:bg-white transition-all font-bold text-[#2d0b16]" />
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-[#6b4c59] uppercase mb-2 block">Required By</label>
                            <div className="relative">
                                <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#59112e]"/>
                                <select className="w-full pl-10 py-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-[#59112e] focus:bg-white appearance-none text-[#2d0b16] font-medium cursor-pointer">
                                    <option>Urgent (24 Hours)</option>
                                    <option>Standard (3 Days)</option>
                                    <option>Flexible (1 Week)</option>
                                </select>
                                <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-[#6b4c59] uppercase">Broadcasting Radius</label>
                                <span className="text-xs font-bold text-[#59112e] bg-[#fdf2f6] px-2 py-0.5 rounded-md">20 km</span>
                            </div>
                            <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#59112e]" />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 py-4 border border-[#f2d8e4] text-[#59112e] font-bold rounded-xl hover:bg-[#fdf2f6] transition-colors">Repurchase Last</button>
                        <button 
                            onClick={() => { setShowBroadcastModal(false); setActiveSection('discover'); }}
                            className="flex-1 py-4 bg-[#59112e] text-white font-bold rounded-xl shadow-lg shadow-[#59112e]/20 flex items-center justify-center gap-2 hover:bg-[#450d24] transition-colors"
                        >
                            <Radio size={18} /> Broadcast Now
                        </button>
                    </div>
                </motion.div>
            </div>
        )}

      </div>

      {/* === RIGHT PANEL: CHATS & REQUESTS === */}
      <div className="w-full md:w-[320px] bg-white border-l border-[#f2d8e4] flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
         
         {/* Right Panel Header */}
         <div className="p-6 border-b border-[#f2d8e4]">
            <h2 className="font-bold text-[#59112e] text-lg mb-5">Activity</h2>
            <div className="flex p-1 bg-[#fdf2f6] rounded-xl border border-[#f2d8e4]/50">
                <button className="flex-1 py-2.5 text-xs font-bold bg-white rounded-lg shadow-sm text-[#59112e]">Messages</button>
                <button className="flex-1 py-2.5 text-xs font-medium text-[#6b4c59] hover:text-[#59112e]">My Broadcasts</button>
            </div>
         </div>

         {/* List Content */}
         <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Active Propagations Section */}
            <div>
                <div className="flex items-center justify-between mb-3 px-2">
                    <h3 className="text-[10px] font-bold text-[#6b4c59] uppercase tracking-wider">Active Broadcasts</h3>
                    <span className="text-[10px] font-bold bg-[#59112e] text-white px-1.5 py-0.5 rounded-md">2</span>
                </div>
                {ACTIVE_PROPAGATIONS.map(prop => (
                    <div key={prop.id} className="bg-[#fff] p-4 rounded-2xl border border-[#f2d8e4] mb-3 relative overflow-hidden group hover:border-[#59112e]/30 transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-[#2d0b16] text-sm pr-4 leading-tight">{prop.title}</h4>
                            <div className="relative">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-[#59112e] opacity-20 animate-ping"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#59112e]"></span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-1.5 bg-[#fdf2f6] px-2 py-1 rounded-lg border border-[#f2d8e4]/50">
                                <MapPin size={10} className="text-[#59112e]"/> 
                                <span className="text-[10px] font-bold text-[#59112e]">{prop.radius}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-[#fdf2f6] px-2 py-1 rounded-lg border border-[#f2d8e4]/50">
                                <MessageSquare size={10} className="text-[#59112e]"/> 
                                <span className="text-[10px] font-bold text-[#59112e]">{prop.responses}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat List Section */}
            <div>
                <h3 className="text-[10px] font-bold text-[#6b4c59] uppercase tracking-wider mb-3 px-2 mt-2">Recent Chats</h3>
                {CHATS.map(chat => (
                    <div key={chat.id} className="flex items-start gap-3 p-3 hover:bg-[#fdf2f6] rounded-2xl cursor-pointer transition-colors group relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2d0b16] to-[#59112e] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
                            {chat.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className="font-bold text-[#2d0b16] text-xs truncate group-hover:text-[#59112e] transition-colors">{chat.name}</h4>
                                <span className="text-[9px] text-[#6b4c59] font-medium">{chat.time}</span>
                            </div>
                            <p className={`text-[11px] truncate ${chat.unread ? 'font-bold text-[#2d0b16]' : 'text-gray-400 group-hover:text-[#6b4c59]'}`}>
                                {chat.msg}
                            </p>
                        </div>
                        {chat.unread && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-rose-500 rounded-full shadow-sm"></div>}
                    </div>
                ))}
            </div>

         </div>

         {/* Active Chat Input Area */}
         <div className="p-4 border-t border-[#f2d8e4] bg-white">
            <div className="relative">
                <input type="text" placeholder="Type a message..." className="w-full bg-[#fafafa] border border-[#f2d8e4] rounded-xl py-3.5 pl-4 pr-10 text-xs font-medium outline-none focus:border-[#59112e] focus:bg-white transition-all text-[#2d0b16]" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#59112e] text-white rounded-lg hover:bg-[#450d24] transition-colors shadow-md">
                    <Send size={12} />
                </button>
            </div>
         </div>

      </div>

    </div>
  );
};

export default PropagationPanel;