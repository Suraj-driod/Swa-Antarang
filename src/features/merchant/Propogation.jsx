import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, LayoutGroup } from 'framer-motion';
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
import { useAuth } from '../../app/providers/AuthContext';
import { createBroadcast, getMyBroadcasts, getMatchesForBuyer, acceptResponse, rejectResponse } from '../../services/propagationService';

const BG_COLORS = ["bg-slate-700", "bg-stone-600", "bg-zinc-500", "bg-amber-700", "bg-indigo-600"];

// --- COMPONENTS ---

// 1. The Swipeable Card
const SwipeCard = ({ data, onSwipe, onNavigate }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);

    // Color overlays
    const rotateRightOpacity = useTransform(x, [0, 150], [0, 1]);
    const rotateLeftOpacity = useTransform(x, [-150, 0], [1, 0]);

    const handleDragEnd = (_, info) => {
        if (info.offset.x > 100) onSwipe?.('right');
        else if (info.offset.x < -100) onSwipe?.('left');
    };

    return (
        <motion.div
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: 'grabbing', scale: 1.02 }}
            className="absolute top-0 left-0 w-full h-full bg-white rounded-[2rem] shadow-2xl shadow-[#59112e]/10 overflow-hidden border border-[#f2d8e4] select-none z-20 cursor-grab group"
        >
            {/* Hover Controls (Left/Right Arrows) - Navigate between cards */}
            <div className="absolute inset-y-0 left-0 w-16 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {/* Only the button is clickable */}
                <div className="pointer-events-auto cursor-pointer p-2" onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}>
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-[#59112e] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <ArrowLeft size={20} />
                    </div>
                </div>
            </div>
            <div className="absolute inset-y-0 right-0 w-16 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="pointer-events-auto cursor-pointer p-2" onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}>
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-[#59112e] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <ArrowRight size={20} />
                    </div>
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
    const { user } = useAuth();
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activePropagations, setActivePropagations] = useState([]);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);

    const [rightPanelTab, setRightPanelTab] = useState('messages');

    // Form State
    const [itemType, setItemType] = useState('');
    const [radius, setRadius] = useState(20);

    // Chats placeholder (live chat is future scope)
    const CHATS = [];

    // Load live data
    useEffect(() => {
      if (!user?.merchantProfileId) return;
      getMyBroadcasts(user.merchantProfileId).then(data => {
        setActivePropagations(data.map(b => ({
          id: b.id,
          title: `Looking for: ${b.item_name}`,
          radius: `${b.radius_km}km`,
          responses: b.propagation_responses?.[0]?.count || 0,
          active: b.status === 'active',
        })));
      }).catch(console.error);

      getMatchesForBuyer(user.merchantProfileId).then(data => {
        setCards(data.map((r, i) => ({
          id: r.id,
          company: r.merchant_profiles?.business_name || 'Unknown Seller',
          item: r.item_name,
          price: `$${Number(r.price).toFixed(2)}`,
          distance: r.distance_km ? `${r.distance_km} km` : '-',
          delivery: r.delivery_days ? `${r.delivery_days} Days` : '-',
          verified: true,
          rating: 'Seller',
          image: BG_COLORS[i % BG_COLORS.length],
        })));
      }).catch(console.error);
    }, [user?.merchantProfileId]);

    // Navigate carousel (wraps around)
    const handleNavigate = (direction) => {
        if (cards.length <= 1) return;
        if (direction === 'prev') {
            setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
        } else if (direction === 'next') {
            setCurrentIndex(prev => (prev + 1) % cards.length);
        }
    };

    // Dismiss card (swipe accept/reject)
    const handleSwipe = (id, direction) => {
        // direction: 'right' = accept, 'left' = reject
        if (direction === 'right') {
            acceptResponse(id).catch(console.error);
        } else {
            rejectResponse(id).catch(console.error);
        }
        setCards(prev => {
            const newCards = prev.filter(c => c.id !== id);
            if (currentIndex >= newCards.length && newCards.length > 0) {
                setCurrentIndex(newCards.length - 1);
            } else if (newCards.length === 0) {
                setCurrentIndex(0);
            }
            return newCards;
        });
    };

    const handleBroadcast = async () => {
        if (!user?.merchantProfileId || !itemType) return;
        try {
            const b = await createBroadcast(user.merchantProfileId, {
                itemName: itemType,
                radiusKm: Number(radius),
            });
            setActivePropagations(prev => [{
                id: b.id,
                title: `Looking for: ${b.item_name}`,
                radius: `${b.radius_km}km`,
                responses: 0,
                active: true,
            }, ...prev]);
            setShowBroadcastModal(false);
            setRightPanelTab('broadcasts');
            setItemType('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <LayoutGroup id="propagation">
            {/* FIX: Adjusted height to remove overlap issues. No sticky header. */}
            <div className="h-[calc(100vh-5rem)] bg-[#f8f9fa] font-outfit text-[#2d0b16] flex overflow-hidden w-full pt-4 md:pt-0 -mb-20 md:-mb-4">

                {/* === LEFT SIDE (MAIN DISCOVERY) === */}
                <div className="flex-1 flex flex-col relative h-full bg-[#fafafa] min-w-0 overflow-hidden">

                    {/* Content Area - No scroll, flex layout */}
                    <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 w-full overflow-hidden">

                        {/* Card Carousel with Side Silhouettes */}
                        <div className="relative flex items-center justify-center w-full max-w-[750px] mb-6 shrink-0">

                            {/* Left Silhouette - Previous Card */}
                            {cards.length > 1 && (() => {
                                const leftIdx = (currentIndex - 1 + cards.length) % cards.length;
                                const leftCard = cards[leftIdx];
                                return (
                                    <motion.div
                                        key={`left-${leftCard.id}`}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[220px] h-[360px] rounded-[1.5rem] bg-white border border-[#f2d8e4] shadow-sm overflow-hidden opacity-25 scale-[0.88] z-0 pointer-events-none"
                                        style={{ transform: 'translateY(-50%) translateX(-35%)' }}
                                    >
                                        <div className={`h-[55%] w-full ${leftCard.image} relative`}>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-3 left-3 right-3 z-10">
                                                <h3 className="text-sm font-bold text-white truncate">{leftCard.item}</h3>
                                                <p className="text-[10px] text-white/70 flex items-center gap-1 mt-0.5"><Store size={9} /> {leftCard.company}</p>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold text-[#59112e] bg-[#fdf2f6] px-2 py-0.5 rounded-md">{leftCard.price}</span>
                                                <span className="text-[9px] text-[#6b4c59] flex items-center gap-0.5"><MapPin size={8} /> {leftCard.distance}</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full w-full mb-1.5"></div>
                                            <div className="h-2 bg-gray-50 rounded-full w-2/3"></div>
                                        </div>
                                    </motion.div>
                                );
                            })()}

                            {/* Main Card */}
                            <div className="relative w-full max-w-[380px] h-[460px] shrink-0 z-10">
                                <AnimatePresence mode="wait">
                                    {cards.length > 0 && cards[currentIndex] && (
                                        <SwipeCard
                                            key={cards[currentIndex].id}
                                            data={cards[currentIndex]}
                                            onSwipe={(dir) => handleSwipe(cards[currentIndex].id, dir)}
                                            onNavigate={handleNavigate}
                                        />
                                    )}
                                </AnimatePresence>

                                {cards.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center flex-col text-center bg-white rounded-[2rem] border-2 border-dashed border-[#f2d8e4]">
                                        <div className="w-20 h-20 rounded-full bg-[#fdf2f6] flex items-center justify-center mb-4 text-[#59112e] animate-pulse">
                                            <Search size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#59112e]">No matches found</h3>
                                        <p className="text-sm text-[#6b4c59] mt-2 max-w-[200px]">We are broadcasting to more suppliers in your area...</p>
                                        <button onClick={() => {
                                            if (!user?.merchantProfileId) return;
                                            getMatchesForBuyer(user.merchantProfileId).then(data => {
                                                setCards(data.map((r, i) => ({
                                                    id: r.id,
                                                    company: r.merchant_profiles?.business_name || 'Unknown Seller',
                                                    item: r.item_name,
                                                    price: `$${Number(r.price).toFixed(2)}`,
                                                    distance: r.distance_km ? `${r.distance_km} km` : '-',
                                                    delivery: r.delivery_days ? `${r.delivery_days} Days` : '-',
                                                    verified: true,
                                                    rating: 'Seller',
                                                    image: BG_COLORS[i % BG_COLORS.length],
                                                })));
                                                setCurrentIndex(0);
                                            }).catch(console.error);
                                        }} className="mt-8 px-6 py-2 bg-[#59112e] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all">
                                            Refresh Radar
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Right Silhouette - Next Card */}
                            {cards.length > 1 && (() => {
                                const rightIdx = (currentIndex + 1) % cards.length;
                                const rightCard = cards[rightIdx];
                                return (
                                    <motion.div
                                        key={`right-${rightCard.id}`}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 w-[220px] h-[360px] rounded-[1.5rem] bg-white border border-[#f2d8e4] shadow-sm overflow-hidden opacity-25 scale-[0.88] z-0 pointer-events-none"
                                        style={{ transform: 'translateY(-50%) translateX(35%)' }}
                                    >
                                        <div className={`h-[55%] w-full ${rightCard.image} relative`}>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-3 left-3 right-3 z-10">
                                                <h3 className="text-sm font-bold text-white truncate">{rightCard.item}</h3>
                                                <p className="text-[10px] text-white/70 flex items-center gap-1 mt-0.5"><Store size={9} /> {rightCard.company}</p>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold text-[#59112e] bg-[#fdf2f6] px-2 py-0.5 rounded-md">{rightCard.price}</span>
                                                <span className="text-[9px] text-[#6b4c59] flex items-center gap-0.5"><MapPin size={8} /> {rightCard.distance}</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full w-full mb-1.5"></div>
                                            <div className="h-2 bg-gray-50 rounded-full w-2/3"></div>
                                        </div>
                                    </motion.div>
                                );
                            })()}
                        </div>

                        {/* Action Buttons (Bottom) */}
                        <div className="flex items-center gap-8 shrink-0">
                            <button
                                onClick={() => cards.length > 0 && cards[currentIndex] && handleSwipe(cards[currentIndex].id, 'left')}
                                className="w-16 h-16 rounded-full bg-white border border-[#f2d8e4] text-rose-500 shadow-[0_8px_20px_rgba(244,63,94,0.15)] flex items-center justify-center hover:scale-110 hover:bg-rose-50 transition-all"
                            >
                                <X size={32} strokeWidth={2.5} />
                            </button>
                            <button className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#59112e] to-[#851e45] text-white shadow-[0_10px_30px_rgba(89,17,46,0.3)] flex items-center justify-center hover:scale-105 hover:shadow-[0_15px_40px_rgba(89,17,46,0.4)] transition-all">
                                <MessageSquare size={32} fill="currentColor" />
                            </button>
                            <button
                                onClick={() => cards.length > 0 && cards[currentIndex] && handleSwipe(cards[currentIndex].id, 'right')}
                                className="w-16 h-16 rounded-full bg-white border border-[#f2d8e4] text-emerald-500 shadow-[0_8px_20px_rgba(16,185,129,0.15)] flex items-center justify-center hover:scale-110 hover:bg-emerald-50 transition-all"
                            >
                                <Check size={32} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* Floating New Broadcast Button - Bottom Right */}
                    <button
                        onClick={() => setShowBroadcastModal(true)}
                        className="absolute bottom-6 right-6 z-30 flex items-center gap-2 bg-[#59112e] text-white px-5 py-3 rounded-full shadow-lg shadow-[#59112e]/30 hover:bg-[#450d24] hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <Radio size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">New Broadcast</span>
                    </button>

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

                    {/* List Content */}
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
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#59112e] text-white rounded-lg hover:bg-[#4a0e26] transition-colors shadow-md flex items-center justify-center">
                                <Send size={12} />
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </LayoutGroup>
    );
};

export default PropagationPanel;