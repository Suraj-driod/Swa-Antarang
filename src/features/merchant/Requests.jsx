import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  User, 
  Box, 
  MapPin, 
  Clock, 
  Check, 
  X, 
  Building2, 
  ShoppingBag,
  Globe,
  Bike,
  PackageCheck,
  ChevronRight,
  Filter,
  Search,
  Bot, 
  Sparkles, 
  Send, 
  Paperclip, 
  CornerDownLeft
} from 'lucide-react';

// --- MOCK DATA ---

const B2B_REQUESTS = [
  { 
    id: 101, 
    buyer: "Urban Furnishings Ltd.", 
    type: "Broadcast Response", 
    item: "Teak Wood Planks", 
    qty: "500 Units", 
    offer: "$4,200", 
    distance: "12 km", 
    time: "2h ago",
    tags: ["Bulk", "Verified"] 
  },
  { 
    id: 102, 
    buyer: "BuildRight Construction", 
    type: "Direct Request", 
    item: "Steel Fasteners", 
    qty: "2000 Units", 
    offer: "$950", 
    distance: "45 km", 
    time: "5h ago",
    tags: ["Urgent"] 
  },
  { 
    id: 103, 
    buyer: "HomeDecor Studio", 
    type: "Negotiation", 
    item: "Cotton Fabric Rolls", 
    qty: "50 Rolls", 
    offer: "$1,100", 
    distance: "8 km", 
    time: "1d ago",
    tags: ["Repeat Buyer"] 
  }
];

const B2C_REQUESTS = [
  { 
    id: 201, 
    buyer: "Sarah Jenkins", 
    type: "Online Order", 
    item: "Ergonomic Chair", 
    qty: "1 Unit", 
    offer: "$120.00", 
    distance: "5.2 km", 
    time: "15m ago",
    avatar: "S"
  },
  { 
    id: 202, 
    buyer: "Mike Ross", 
    type: "Online Order", 
    item: "Study Table (Minimalist)", 
    qty: "1 Unit", 
    offer: "$240.50", 
    distance: "3.1 km", 
    time: "1h ago",
    avatar: "M"
  }
];

// --- COMPONENTS ---

// 1. Delivery Selection Option Card
const DeliveryOption = ({ icon: Icon, title, desc, delay, cost, selected, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 text-left group relative overflow-hidden ${
      selected 
        ? 'border-[#59112e] bg-[#fdf2f6]' 
        : 'border-gray-100 bg-white hover:border-[#59112e]/30 hover:shadow-md'
    }`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
        selected ? 'bg-[#59112e] text-white' : 'bg-gray-50 text-gray-500 group-hover:text-[#59112e] group-hover:bg-[#fdf2f6]'
    }`}>
      <Icon size={24} />
    </div>
    
    <div className="flex-1">
        <h4 className={`font-bold text-sm ${selected ? 'text-[#59112e]' : 'text-[#2d0b16]'}`}>{title}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>

    <div className="text-right">
        <p className="text-xs font-bold text-[#59112e]">{cost}</p>
        <p className="text-[10px] text-gray-400">{delay}</p>
    </div>

    {selected && (
        <div className="absolute top-2 right-2 text-[#59112e]">
            <div className="bg-[#59112e] text-white rounded-full p-0.5">
                <Check size={10} strokeWidth={4} />
            </div>
        </div>
    )}
  </button>
);

// 2. Chat Message Bubble
const ChatBubble = ({ msg }) => (
    <div className={`flex gap-3 mb-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'ai' ? 'bg-gradient-to-br from-[#59112e] to-[#851e45] text-white' : 'bg-white border border-[#f2d8e4] text-[#59112e]'}`}>
            {msg.sender === 'ai' ? <Sparkles size={14} /> : <User size={14} />}
        </div>
        <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
            msg.sender === 'ai' 
            ? 'bg-white border border-[#f2d8e4] text-[#2d0b16] rounded-tl-none' 
            : 'bg-[#59112e] text-white rounded-tr-none shadow-[#59112e]/20'
        }`}>
            {msg.content}
        </div>
    </div>
);

const RequestsPanel = () => {
  const [activeTab, setActiveTab] = useState('b2b'); // 'b2b' | 'b2c'
  const [selectedRequest, setSelectedRequest] = useState(null); // For modal
  const [deliveryType, setDeliveryType] = useState(null); // 'own' | 'ondc' | 'forward'
  
  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
      { id: 1, sender: 'ai', content: "Hello! I've analyzed your incoming requests. You have 3 high-value B2B offers pending. Shall I summarize the best margins?" }
  ]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      setMessages(prev => [...prev, { id: Date.now(), sender: 'user', content: chatInput }]);
      setChatInput("");
      setTimeout(() => {
          setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', content: "I'm processing that request against your inventory levels..." }]);
      }, 1000);
  };

  const handleAccept = (req) => {
    setSelectedRequest(req);
    setDeliveryType(null); // Reset selection
  };

  const confirmOrder = () => {
      alert(`Order confirmed with ${deliveryType}`);
      setSelectedRequest(null);
  };

  return (
    // FIX: Added 'pt-20' (padding-top) to push content below the fixed Navbar
    <div className="h-screen bg-[#f8f9fa] font-outfit text-[#2d0b16] flex flex-col md:flex-row overflow-hidden pt-20">
      
      {/* === LEFT: MAIN REQUESTS LIST (65%) === */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fafafa]">
        
        {/* Header */}
        <div className="h-24 px-8 border-b border-[#f2d8e4] bg-white flex items-center justify-between shrink-0 shadow-sm z-10">
            <div>
                <h1 className="text-3xl font-bold text-[#59112e]">Incoming Requests</h1>
                <p className="text-sm text-[#6b4c59] mt-1">Manage orders and broadcast responses</p>
            </div>

            <div className="flex gap-3">
                <button className="w-10 h-10 rounded-xl bg-[#fdf2f6] text-[#59112e] flex items-center justify-center border border-[#f2d8e4] hover:bg-[#59112e] hover:text-white transition-colors">
                    <Search size={20} />
                </button>
                <button className="w-10 h-10 rounded-xl bg-[#fdf2f6] text-[#59112e] flex items-center justify-center border border-[#f2d8e4] hover:bg-[#59112e] hover:text-white transition-colors">
                    <Filter size={20} />
                </button>
            </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 pt-6 pb-2 shrink-0">
            <div className="bg-[#fdf2f6] p-1.5 rounded-xl inline-flex border border-[#f2d8e4]">
                <button 
                    onClick={() => setActiveTab('b2b')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                        activeTab === 'b2b' ? 'bg-white text-[#59112e] shadow-sm' : 'text-[#6b4c59] hover:text-[#59112e]'
                    }`}
                >
                    <Building2 size={16} />
                    B2B Requests
                    <span className="bg-[#59112e] text-white text-[10px] px-1.5 py-0.5 rounded-md ml-1">3</span>
                </button>
                <button 
                    onClick={() => setActiveTab('b2c')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                        activeTab === 'b2c' ? 'bg-white text-[#59112e] shadow-sm' : 'text-[#6b4c59] hover:text-[#59112e]'
                    }`}
                >
                    <ShoppingBag size={16} />
                    Consumer Orders
                    <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-md ml-1">2</span>
                </button>
            </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-8 pb-10 pt-4">
            <motion.div 
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 max-w-4xl"
            >
                {(activeTab === 'b2b' ? B2B_REQUESTS : B2C_REQUESTS).map((req) => (
                    <motion.div 
                        key={req.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-5 rounded-[20px] border border-[#f2d8e4]/60 shadow-sm hover:shadow-md hover:border-[#59112e]/20 transition-all group"
                    >
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            
                            {/* Icon / Avatar */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 ${
                                activeTab === 'b2b' ? 'bg-[#fdf2f6] text-[#59112e]' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                                {activeTab === 'b2b' ? <Building2 size={24} /> : req.avatar}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg text-[#2d0b16] truncate">{req.buyer}</h3>
                                    {req.tags && req.tags.map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md font-medium uppercase tracking-wide">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-[#6b4c59] flex items-center gap-4">
                                    <span className="font-medium text-[#2d0b16]">{req.item}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>{req.qty}</span>
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><MapPin size={12}/> {req.distance}</span>
                                    <span className="flex items-center gap-1"><Clock size={12}/> {req.time}</span>
                                </div>
                            </div>

                            {/* Price & Actions */}
                            <div className="flex flex-row md:flex-col items-center md:items-end gap-4 w-full md:w-auto justify-between">
                                <div className="text-right">
                                    <span className="text-xs text-[#6b4c59] font-medium block">Offer Price</span>
                                    <span className="text-xl font-bold text-[#59112e]">{req.offer}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-xl border border-gray-200 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                                        <X size={20} />
                                    </button>
                                    <button 
                                        onClick={() => handleAccept(req)}
                                        className="h-10 px-5 bg-[#59112e] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#59112e]/20 hover:bg-[#450d24] hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        <Check size={16} strokeWidth={3} /> Accept
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>

      </div>

      {/* === RIGHT: AI ASSISTANT SIDEBAR (35%) === */}
      <div className="w-full md:w-[400px] bg-white border-l border-[#f2d8e4] flex flex-col z-20 shadow-[-10px_0_40px_rgba(0,0,0,0.02)] h-full">
          
          {/* AI Header */}
          <div className="p-6 border-b border-[#f2d8e4] bg-white relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#fdf2f6] to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#59112e] to-[#851e45] flex items-center justify-center text-white shadow-lg shadow-[#59112e]/20">
                      <Bot size={22} />
                  </div>
                  <div>
                      <h2 className="font-bold text-[#2d0b16]">Order Assistant</h2>
                      <div className="flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Active</span>
                      </div>
                  </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf2f6] border border-[#f2d8e4] rounded-lg text-xs font-bold text-[#59112e] whitespace-nowrap hover:bg-[#59112e] hover:text-white transition-colors">
                      <Sparkles size={12}/> Analyze Bulk
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#f2d8e4] rounded-lg text-xs font-medium text-[#6b4c59] whitespace-nowrap hover:border-[#59112e] transition-colors">
                      Draft Replies
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#f2d8e4] rounded-lg text-xs font-medium text-[#6b4c59] whitespace-nowrap hover:border-[#59112e] transition-colors">
                      Logistics Help
                  </button>
              </div>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#fafafa]">
              {messages.map(msg => (
                  <ChatBubble key={msg.id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#f2d8e4] shrink-0">
              <div className="relative">
                  <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about orders, delivery, or pricing..." 
                      className="w-full bg-[#fdf2f6] border border-[#f2d8e4] text-[#2d0b16] text-sm rounded-2xl py-3.5 pl-4 pr-12 outline-none focus:border-[#59112e] focus:bg-white transition-all placeholder:text-[#6b4c59]/50"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button className="p-1.5 text-[#6b4c59] hover:text-[#59112e] transition-colors">
                          <Paperclip size={16} />
                      </button>
                      <button 
                          onClick={handleSendMessage}
                          className="p-2 bg-[#59112e] text-white rounded-xl shadow-md hover:bg-[#450d24] transition-colors"
                      >
                          <CornerDownLeft size={16} />
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* === LOGISTICS MODAL === */}
      <AnimatePresence>
        {selectedRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedRequest(null)}
                    className="absolute inset-0 bg-[#2d0b16]/30 backdrop-blur-sm"
                />

                {/* Modal Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10"
                >
                    {/* Modal Header */}
                    <div className="bg-[#fdf2f6] p-6 border-b border-[#f2d8e4]">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-[#59112e]">Confirm Delivery</h2>
                                <p className="text-xs text-[#6b4c59] mt-1">Select how you want to ship this order.</p>
                            </div>
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="w-8 h-8 rounded-full bg-white text-[#59112e] flex items-center justify-center hover:bg-rose-100 transition-colors shadow-sm"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        
                        {/* Order Summary Strip */}
                        <div className="mt-4 bg-white p-3 rounded-xl border border-[#f2d8e4]/50 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#59112e] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                    {activeTab === 'b2b' ? 'B' : 'C'}
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-[#2d0b16]">{selectedRequest.item}</p>
                                    <p className="text-xs text-gray-500">{selectedRequest.qty} • {selectedRequest.distance}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-[#59112e]">{selectedRequest.offer}</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Options */}
                    <div className="p-6 space-y-3">
                        <DeliveryOption 
                            icon={Bike}
                            title="Own Deliveryman"
                            desc="Use your internal fleet."
                            cost="Free"
                            delay="~45 mins"
                            selected={deliveryType === 'own'}
                            onClick={() => setDeliveryType('own')}
                        />
                        <DeliveryOption 
                            icon={Globe}
                            title="ONDC Network"
                            desc="Assign to open network rider."
                            cost="$2.50"
                            delay="~30 mins"
                            selected={deliveryType === 'ondc'}
                            onClick={() => setDeliveryType('ondc')}
                        />
                        <DeliveryOption 
                            icon={Truck}
                            title="Forward Logistics"
                            desc="3PL Partner (Dunzo, Shadowfax)."
                            cost="$4.00"
                            delay="~20 mins"
                            selected={deliveryType === 'forward'}
                            onClick={() => setDeliveryType('forward')}
                        />
                    </div>

                    {/* Footer Action */}
                    <div className="p-6 pt-0">
                        <button 
                            disabled={!deliveryType}
                            onClick={confirmOrder}
                            className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                                deliveryType 
                                ? 'bg-[#59112e] text-white shadow-[#59112e]/20 hover:scale-[1.02] hover:bg-[#450d24]' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                        >
                            <span>Confirm & Ship</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>

                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default RequestsPanel;