import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Phone, 
  User, 
  Store, 
  CheckCircle2, 
  Circle, 
  MoreVertical,
  Search,
  ArrowRight,
  Box,
  Navigation,
  ChevronRight,
  X,
  Send
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';
import { getOrdersByMerchant } from '../../services/orderService';
import { getDeliveryByOrder } from '../../services/deliveryService';

const STATUS_PROGRESS = {
  pending: 10, confirmed: 25, packed: 50, out_for_delivery: 75, delivered: 100, cancelled: 0,
};
const STATUS_LABEL = {
  pending: 'Pending', confirmed: 'Confirmed', packed: 'Packed', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
};

// --- COMPONENTS ---

// 1. Interactive Map Component (Visual Simulation)
const LiveMap = ({ order }) => {
  return (
    <div className="absolute inset-0 bg-[#fdf2f6]/30 overflow-hidden">
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#59112e 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        
        {/* Roads (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Route Path */}
            <motion.path 
                d="M 100 450 Q 300 350 450 250 T 800 150" 
                fill="none" 
                stroke="#e2e8f0" 
                strokeWidth="8" 
                strokeLinecap="round"
            />
            <motion.path 
                d="M 100 450 Q 300 350 450 250 T 800 150" 
                fill="none" 
                stroke="#59112e" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeDasharray="10 10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: order.progress / 100 }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Pulsing Destination */}
            <circle cx="800" cy="150" r="10" fill="#59112e" opacity="0.2" className="animate-ping" />
            <circle cx="800" cy="150" r="6" fill="#59112e" />
        </svg>

        {/* Floating Driver Marker (Animated) */}
        <motion.div 
            initial={{ x: 100, y: 450 }}
            animate={{ x: 450, y: 250 }} // Simplified path interpolation for demo
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute p-2 bg-white rounded-full shadow-xl border-2 border-[#59112e] z-10"
        >
            <Truck size={20} className="text-[#59112e]" />
            
            {/* Live Status Tooltip */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#2d0b16] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg"
            >
                {order.eta} away
                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-t-[#2d0b16] border-l-transparent border-r-transparent"></div>
            </motion.div>
        </motion.div>

        {/* Start Point */}
        <div className="absolute left-[80px] top-[430px] p-2 bg-white rounded-full shadow-md border border-gray-200">
            <Store size={16} className="text-gray-400" />
        </div>
        
        {/* End Point */}
        <div className="absolute left-[780px] top-[130px] p-2 bg-[#59112e] rounded-full shadow-xl border-4 border-white">
            <MapPin size={20} className="text-white" />
        </div>
    </div>
  );
};

// 2. Chat Overlay
const ChatOverlay = ({ target, onClose }) => {
    const [msgs, setMsgs] = useState([
        { id: 1, sender: 'them', text: `Hi, I am on my way with the ${target.item}.` },
    ]);
    const [input, setInput] = useState("");

    const send = () => {
        if (!input) return;
        setMsgs([...msgs, { id: Date.now(), sender: 'me', text: input }]);
        setInput("");
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-[#f2d8e4] overflow-hidden flex flex-col z-30"
        >
            <div className="bg-[#59112e] p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <User size={16} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">{target.driver.name}</h4>
                        <p className="text-[10px] opacity-80">{target.type === 'B2C' ? 'Delivery Partner' : 'Logistics Driver'}</p>
                    </div>
                </div>
                <button onClick={onClose}><X size={18} /></button>
            </div>
            
            <div className="h-64 bg-[#fafafa] p-4 overflow-y-auto space-y-3">
                {msgs.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${
                            m.sender === 'me' ? 'bg-[#59112e] text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input 
                    className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#59112e]" 
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                />
                <button onClick={send} className="p-2 bg-[#59112e] text-white rounded-lg"><Send size={14}/></button>
            </div>
        </motion.div>
    );
};

const TrackingPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sent');
  const [outgoingOrders, setOutgoingOrders] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // Fetch orders
  useEffect(() => {
    if (!user?.merchantProfileId) return;
    getOrdersByMerchant(user.merchantProfileId).then(data => {
      const mapped = data.filter(o => o.status !== 'cancelled').map(o => ({
        id: o.id.slice(0, 8).toUpperCase(),
        fullId: o.id,
        recipient: o.profiles?.full_name || o.type === 'b2b' ? 'B2B Partner' : 'Customer',
        type: o.type === 'b2b' ? 'B2B' : 'B2C',
        item: o.order_items?.[0]?.product_name || 'Order',
        status: STATUS_LABEL[o.status] || o.status,
        progress: STATUS_PROGRESS[o.status] || 0,
        eta: '-',
        driver: { name: '-', vehicle: '-', phone: '-', rating: 0 },
        timeline: [
          { time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: 'Order Placed', done: true },
        ],
      }));
      setOutgoingOrders(mapped);
      if (mapped.length > 0 && !selectedOrder) setSelectedOrder(mapped[0]);
    }).catch(console.error);
  }, [user?.merchantProfileId]);

  const activeList = activeTab === 'sent' ? outgoingOrders : incomingOrders;

  useEffect(() => {
      setSelectedOrder(activeList[0] || null);
      setShowChat(false);
  }, [activeTab, activeList.length]);

  return (
    // FIX: Added 'pt-20' to push content below the fixed Navbar
    <div className="h-screen bg-[#f8f9fa] font-outfit text-[#2d0b16] flex flex-col md:flex-row overflow-hidden pt-20">
      
      {/* === LEFT SIDEBAR: ORDER LIST === */}
      <div className="w-full md:w-[400px] bg-white border-r border-[#f2d8e4] flex flex-col z-20 shadow-lg h-full">
         
         {/* Header */}
         <div className="p-6 border-b border-[#f2d8e4] shrink-0">
            <h1 className="text-2xl font-bold text-[#59112e] mb-6">Track Shipments</h1>
            
            {/* Tab Switcher */}
            <div className="flex p-1 bg-[#fdf2f6] rounded-xl border border-[#f2d8e4]">
                <button 
                    onClick={() => setActiveTab('sent')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                        activeTab === 'sent' ? 'bg-white text-[#59112e] shadow-sm' : 'text-[#6b4c59] hover:text-[#59112e]'
                    }`}
                >
                    Sent Orders
                </button>
                <button 
                    onClick={() => setActiveTab('received')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                        activeTab === 'received' ? 'bg-white text-[#59112e] shadow-sm' : 'text-[#6b4c59] hover:text-[#59112e]'
                    }`}
                >
                    Incoming Stock
                </button>
            </div>

            {/* Search */}
            <div className="relative mt-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search Order ID or Name..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-[#59112e] transition-colors" />
            </div>
         </div>

         {/* Order List */}
         <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafafa]">
            {activeList.map((order) => (
                <div 
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${
                        selectedOrder.id === order.id 
                        ? 'bg-white border-[#59112e] shadow-md ring-1 ring-[#59112e]/10' 
                        : 'bg-white border-transparent hover:border-[#f2d8e4]'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="text-[10px] font-bold text-[#59112e] bg-[#fdf2f6] px-2 py-0.5 rounded border border-[#f2d8e4]">
                                {order.type}
                            </span>
                            <h3 className="font-bold text-[#2d0b16] text-sm mt-1">{order.id}</h3>
                        </div>
                        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                            <Clock size={12}/> {order.eta}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${activeTab === 'sent' ? 'bg-[#59112e]' : 'bg-indigo-600'}`}>
                            {activeTab === 'sent' ? <Package size={16}/> : <Box size={16}/>}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{order.item}</p>
                            <p className="text-xs text-gray-500">{activeTab === 'sent' ? `To: ${order.recipient}` : `From: ${order.supplier}`}</p>
                        </div>
                    </div>

                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#59112e] rounded-full" style={{ width: `${order.progress}%` }}></div>
                    </div>
                </div>
            ))}
         </div>
      </div>

      {/* === RIGHT: MAP & DETAILS AREA === */}
      <div className="flex-1 relative bg-[#eef0f3] overflow-hidden flex flex-col h-full">
         
         {/* Live Map Area */}
         <div className="flex-1 relative">
             <LiveMap order={selectedOrder} />
             
             {/* Overlay Gradient for Text Readability */}
             <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/90 to-transparent pointer-events-none"></div>
             
             {/* Header Overlay */}
             <div className="absolute top-6 left-8 right-8 flex justify-between items-start z-10">
                 <div>
                     <h2 className="text-3xl font-bold text-[#2d0b16] drop-shadow-sm tracking-tight">Live Tracking</h2>
                     <p className="text-sm text-[#6b4c59] font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Updated just now
                     </p>
                 </div>
                 <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white/50">
                     <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Status</p>
                     <p className="text-lg font-bold text-[#59112e]">{selectedOrder.status}</p>
                 </div>
             </div>
         </div>

         {/* Bottom Details Panel (Floating) */}
         <div className="absolute bottom-8 left-8 right-8 z-20 flex gap-6 items-end pointer-events-none">
             
             {/* Driver Card */}
             <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                key={selectedOrder.id}
                className="bg-white/95 backdrop-blur-md p-5 rounded-[24px] shadow-2xl border border-white/50 w-80 pointer-events-auto"
             >
                 <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                         <User size={24} />
                     </div>
                     <div>
                         <h3 className="font-bold text-[#2d0b16]">{selectedOrder.driver.name}</h3>
                         <div className="flex items-center gap-2 text-xs text-gray-500">
                             <span className="flex items-center gap-0.5 text-amber-500 font-bold"><span className="text-xs">★</span> {selectedOrder.driver.rating}</span>
                             <span>•</span>
                             <span>{selectedOrder.driver.vehicle}</span>
                         </div>
                     </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                     <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#f2d8e4] text-[#2d0b16] text-xs font-bold hover:bg-[#fdf2f6] transition-colors">
                         <Phone size={14} /> Call Driver
                     </button>
                     <button 
                        onClick={() => setShowChat(!showChat)}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-bold transition-colors shadow-lg ${
                            showChat ? 'bg-[#450d24]' : 'bg-[#59112e] hover:bg-[#450d24]'
                        }`}
                     >
                         <MessageSquare size={14} /> Chat
                     </button>
                 </div>
             </motion.div>

             {/* Timeline Card */}
             <div className="flex-1 bg-white/95 backdrop-blur-md p-6 rounded-[24px] shadow-2xl border border-white/50 pointer-events-auto min-h-[180px] flex flex-col justify-center">
                 <div className="flex justify-between items-center relative">
                     {/* Horizontal Line */}
                     <div className="absolute top-[14px] left-0 right-0 h-0.5 bg-gray-100 -z-10"></div>
                     <div 
                        className="absolute top-[14px] left-0 h-0.5 bg-[#59112e] -z-10 transition-all duration-1000"
                        style={{ width: `${selectedOrder.progress}%` }}
                     ></div>

                     {selectedOrder.timeline.map((step, idx) => (
                         <div key={idx} className="flex flex-col items-center gap-3">
                             <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 transition-colors duration-500 ${
                                 step.done 
                                 ? 'bg-[#59112e] border-white text-white shadow-md' 
                                 : 'bg-white border-gray-100 text-gray-300'
                             }`}>
                                 {step.done ? <CheckCircle2 size={14} /> : <Circle size={10} />}
                             </div>
                             <div className="text-center">
                                 <p className={`text-xs font-bold ${step.done ? 'text-[#2d0b16]' : 'text-gray-400'}`}>{step.event}</p>
                                 <p className="text-[10px] text-gray-400 font-medium">{step.time}</p>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>

         </div>

         {/* Chat Overlay Component */}
         <AnimatePresence>
            {showChat && (
                <ChatOverlay 
                    target={selectedOrder} 
                    onClose={() => setShowChat(false)} 
                />
            )}
         </AnimatePresence>

      </div>

    </div>
  );
};

export default TrackingPanel;