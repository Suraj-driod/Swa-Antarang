import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
    MessageSquare,
    Store,
    MapPin,
    Clock,
    DollarSign,
    X,
    Check,
    Send,
    Radio,
    Search,
    ArrowLeft,
    ArrowRight
} from 'lucide-react';

// --- MOCK DATA ---

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

const INITIAL_PROPAGATIONS = [
    { id: 1, title: "Looking for: Raw Aluminum", radius: "20km", responses: 5, active: true },
    { id: 2, title: "Selling: Surplus Teak", radius: "50km", responses: 12, active: true },
];

// --- COMPONENTS ---

// 1. The Swipeable Card
const SwipeCard = ({ data, onSwipe }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Color overlays
    const rotateRightOpacity = useTransform(x, [0, 150], [0, 1]);
    const rotateLeftOpacity = useTransform(x, [-150, 0], [1, 0]);

    const handleDragEnd = (_, info) => {
        if (info.offset.x > 100) onSwipe('right');
        else if (info.offset.x < -100) onSwipe('left');
    };

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: 'grabbing', scale: 1.02 }}
            className="absolute top-0 left-0 w-full h-full bg-white rounded-[2rem] shadow-2xl shadow-[#59112e]/10 overflow-hidden border border-[#f2d8e4] select-none z-20 cursor-grab group"
        >
            {/* Hover Controls (Left/Right Arrows) */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-50 flex items-center justify-start pl-4 cursor-pointer" onClick={() => onSwipe('left')}>
                <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-rose-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <ArrowLeft size={20} />
                </div>
            </div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-50 flex items-center justify-end pr-4 cursor-pointer" onClick={() => onSwipe('right')}>
                <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-emerald-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <ArrowRight size={20} />
                </div>
            </div>

            {/* Swipe Feedback Overlays */}
            <motion.div style={{ opacity: rotateRightOpacity }} className="absolute inset-0 bg-emerald-500/10 z-30 flex items-center justify-center pointer-events-none backdrop-blur-[1px]">
                <div className="bg-white/80 backdrop-blur-md border-4 border-emerald-500 text-emerald-600 text-3xl font-extrabold uppercase px-6 py-2 rounded-2xl -rotate-12 shadow-xl">Connect</div>
            </motion.div>
            <motion.div style={{ opacity: rotateLeftOpacity }} className="absolute inset-0 bg-rose-500/10 z-30 flex items-center justify-center pointer-events-none backdrop-blur-[1px]">
                <div className="bg-white/80 backdrop-blur-md border-4 border-rose-500 text-rose-600 text-3xl font-extrabold uppercase px-6 py-2 rounded-2xl rotate-12 shadow-xl">Pass</div>
            </motion.div>

            {/* Image / Preview Area */}
            <div className={`h-[58%] w-full ${data.image} relative flex items-end p-6`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
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
    const [cards, setCards] = useState(MATCH_CARDS);
    const [activePropagations, setActivePropagations] = useState(INITIAL_PROPAGATIONS);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);

    // Tab State for Right Panel
    const [rightPanelTab, setRightPanelTab] = useState('messages');

    // Form State
    const [itemType, setItemType] = useState('Teak Wood Planks');
    const [radius, setRadius] = useState(20);

    const handleSwipe = (id) => {
        setCards(prev => prev.filter(c => c.id !== id));
    };

    const handleBroadcast = () => {
        const newBroadcast = {
            id: Date.now(),
            title: `Looking for: ${itemType}`,
            radius: `${radius}km`,
            responses: 0,
            active: true
        };
        setActivePropagations([newBroadcast, ...activePropagations]);
        setShowBroadcastModal(false);
        setRightPanelTab('broadcasts');
    };

    return (
        <div className="h-[calc(100dvh-5rem)] bg-[#f8f9fa] font-outfit text-[#2d0b16] flex overflow-hidden w-full -mb-20 md:-mb-4">

            {/* === LEFT SIDE (MAIN DISCOVERY) === */}
            <div className="flex-1 flex flex-col relative h-full bg-[#fafafa] min-w-0 overflow-hidden">

                {/* Header (Fixed) */}
                <div className="h-20 px-8 flex items-center justify-between shrink-0 border-b border-[#f2d8e4]/30 bg-white/50 backdrop-blur-sm z-10 sticky top-0">
                    <div>
                        <h1 className="text-2xl font-bold text-[#59112e] tracking-tight">Discovery</h1>
                        <p className="text-xs text-[#6b4c59] font-medium">Connect with suppliers</p>
                    </div>

                    <button
                        onClick={() => setShowBroadcastModal(true)}
                        className="flex items-center gap-2 bg-[#59112e] text-white px-4 py-2 rounded-full shadow-lg shadow-[#59112e]/20 hover:bg-[#450d24] transition-colors"
                    >
                        <Radio size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">New Broadcast</span>
                    </button>
                </div>

                {/* Content Area - FIXED SCROLLING CONTAINER */}
                <div className="flex-1 overflow-y-scroll w-full">
                    {/* Added specific padding values to ensure content sits nicely.
               Removed 'min-h-full' on inner div which can sometimes cause scrollbar layout shift.
            */}
                    <div className="flex flex-col items-center justify-start pt-4 pb-12 px-4 w-full">

                        {/* Controls */}
                        <div className="w-full max-w-[380px] flex justify-between items-end mb-4 px-1 shrink-0">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-[#6b4c59] uppercase tracking-wider">Budget</span>
                                <div className="bg-white border border-[#f2d8e4] px-3 py-1.5 rounded-lg text-xs font-bold text-[#59112e] shadow-sm">$0 - $5k</div>
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                                <span className="text-[10px] font-bold text-[#6b4c59] uppercase tracking-wider">Radius</span>
                                <div className="bg-white border border-[#f2d8e4] px-3 py-1.5 rounded-lg text-xs font-bold text-[#59112e] shadow-sm flex items-center gap-1">
                                    <MapPin size={10} /> 50km
                                </div>
                            </div>
                        </div>

                        {/* Card Stack Container */}
                        <div className="relative w-full max-w-[380px] h-[520px] mb-8 shrink-0">
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
                        <div className="flex items-center gap-8 shrink-0">
                            <button
                                onClick={() => cards.length > 0 && handleSwipe(cards[cards.length - 1].id)}
                                className="w-16 h-16 rounded-full bg-white border border-[#f2d8e4] text-rose-500 shadow-[0_8px_20px_rgba(244,63,94,0.15)] flex items-center justify-center hover:scale-110 hover:bg-rose-50 transition-all"
                            >
                                <X size={32} strokeWidth={2.5} />
                            </button>
                            <button className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#59112e] to-[#851e45] text-white shadow-[0_10px_30px_rgba(89,17,46,0.3)] flex items-center justify-center hover:scale-105 hover:shadow-[0_15px_40px_rgba(89,17,46,0.4)] transition-all">
                                <MessageSquare size={32} fill="currentColor" />
                            </button>
                            <button
                                onClick={() => cards.length > 0 && handleSwipe(cards[cards.length - 1].id)}
                                className="w-16 h-16 rounded-full bg-white border border-[#f2d8e4] text-emerald-500 shadow-[0_8px_20px_rgba(16,185,129,0.15)] flex items-center justify-center hover:scale-110 hover:bg-emerald-50 transition-all"
                            >
                                <Check size={32} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- BROADCAST MODAL --- */}
                {showBroadcastModal && (
                    <div className="absolute inset-0 z-50 bg-[#2d0b16]/20 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl border border-white/50"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#59112e]">New Broadcast</h2>
                                    <p className="text-xs text-[#6b4c59] font-medium mt-1">Request stock from network</p>
                                </div>
                                <button onClick={() => setShowBroadcastModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"><X size={18} /></button>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div>
                                    <label className="text-xs font-bold text-[#6b4c59] uppercase mb-2 block">Item Name</label>
                                    <input
                                        type="text"
                                        value={itemType}
                                        onChange={(e) => setItemType(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-[#59112e] focus:bg-white transition-all font-bold text-[#2d0b16]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-[#6b4c59] uppercase mb-2 block">Min Price</label>
                                        <div className="relative">
                                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="number" placeholder="0.00" className="w-full pl-8 py-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-[#59112e] focus:bg-white transition-all font-bold text-[#2d0b16]" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#6b4c59] uppercase mb-2 block">Max Price</label>
                                        <div className="relative">
                                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="number" placeholder="0.00" className="w-full pl-8 py-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-[#59112e] focus:bg-white transition-all font-bold text-[#2d0b16]" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-bold text-[#6b4c59] uppercase">Broadcasting Radius</label>
                                        <span className="text-xs font-bold text-[#59112e] bg-[#fdf2f6] px-2 py-0.5 rounded-md">{radius} km</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5" max="100"
                                        value={radius}
                                        onChange={(e) => setRadius(e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#59112e]"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleBroadcast}
                                    className="w-full py-4 bg-[#59112e] text-white font-bold rounded-xl shadow-lg shadow-[#59112e]/20 flex items-center justify-center gap-2 hover:bg-[#450d24] transition-colors"
                                >
                                    <Radio size={18} /> Launch Broadcast
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

            </div>

            {/* === RIGHT PANEL: ACTIVITY (FIXED WIDTH) === */}
            <div className="w-[340px] bg-white border-l border-[#f2d8e4] flex flex-col z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] shrink-0 h-full overflow-hidden">

                {/* Right Panel Header */}
                <div className="p-6 border-b border-[#f2d8e4] shrink-0">
                    <h2 className="font-bold text-[#59112e] text-lg mb-5">Activity</h2>
                    <div className="flex p-1 bg-[#fdf2f6] rounded-xl border border-[#f2d8e4]/50">
                        <button
                            onClick={() => setRightPanelTab('messages')}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${rightPanelTab === 'messages' ? 'bg-white shadow-sm text-[#59112e]' : 'text-[#6b4c59] hover:text-[#59112e]'}`}
                        >
                            Messages
                        </button>
                        <button
                            onClick={() => setRightPanelTab('broadcasts')}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${rightPanelTab === 'broadcasts' ? 'bg-white shadow-sm text-[#59112e]' : 'text-[#6b4c59] hover:text-[#59112e]'}`}
                        >
                            Broadcasts
                        </button>
                    </div>
                </div>

                {/* List Content - FIXED: Ensure proper flex sizing for scroll */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* CONDITIONAL RENDER based on Tab */}
                    {rightPanelTab === 'broadcasts' ? (
                        <div>
                            <div className="flex items-center justify-between mb-3 px-2">
                                <h3 className="text-[10px] font-bold text-[#6b4c59] uppercase tracking-wider">Your Broadcasts</h3>
                                <span className="text-[10px] font-bold bg-[#59112e] text-white px-1.5 py-0.5 rounded-md">{activePropagations.length}</span>
                            </div>

                            <AnimatePresence>
                                {activePropagations.map(prop => (
                                    <motion.div
                                        key={prop.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-[#fff] p-4 rounded-2xl border border-[#f2d8e4] mb-3 relative overflow-hidden group hover:border-[#59112e]/30 transition-colors shadow-sm"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-[#2d0b16] text-sm pr-4 leading-tight">{prop.title}</h4>
                                            <div className="relative">
                                                <span className="absolute inline-flex h-full w-full rounded-full bg-[#59112e] opacity-20 animate-ping"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#59112e]"></span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center gap-1.5 bg-[#fdf2f6] px-2 py-1 rounded-lg border border-[#f2d8e4]/50">
                                                <MapPin size={10} className="text-[#59112e]" />
                                                <span className="text-[10px] font-bold text-[#59112e]">{prop.radius}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-[#fdf2f6] px-2 py-1 rounded-lg border border-[#f2d8e4]/50">
                                                <MessageSquare size={10} className="text-[#59112e]" />
                                                <span className="text-[10px] font-bold text-[#59112e]">{prop.responses}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {activePropagations.length === 0 && (
                                <div className="text-center p-8 text-slate-400 text-xs">No active broadcasts</div>
                            )}
                        </div>
                    ) : (
                        /* Chat List Section */
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
                    )}
                </div>

                {/* Active Chat Input Area */}
                <div className="p-4 border-t border-[#f2d8e4] bg-white shrink-0">
                    <div className="relative">
                        <input type="text" placeholder="Type a message..." className="w-full bg-[#fafafa] border border-[#f2d8e4] rounded-xl py-3.5 pl-4 pr-10 text-xs font-medium outline-none focus:border-[#59112e] focus:bg-white transition-all text-[#2d0b16]" />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#59112e] text-white rounded-lg hover:bg-[#450d24] transition-colors shadow-md flex items-center justify-center">
                            <Send size={12} />
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default PropagationPanel;