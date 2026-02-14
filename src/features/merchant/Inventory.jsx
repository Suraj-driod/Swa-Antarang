import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Bot, 
  FileSpreadsheet, 
  MessageSquare, 
  Send, 
  Paperclip,
  ArrowUpRight,
  User
} from 'lucide-react';

// --- MOCK DATA ---
const RAW_ITEMS = [
  { id: 1, name: "Teak Wood Planks", sku: "RW-001", stock: 450, unit: "pcs", status: "In Stock", supplier: "Global Timber Co." },
  { id: 2, name: "Industrial Steel Rods", sku: "MT-882", stock: 24, unit: "tons", status: "Low Stock", supplier: "MetalWorks Inc." },
  { id: 3, name: "Cotton Fabric Rolls", sku: "TX-104", stock: 120, unit: "rolls", status: "In Stock", supplier: "FabriTex" },
  { id: 4, name: "Polyurethane Foam", sku: "CH-552", stock: 0, unit: "sheets", status: "Out of Stock", supplier: "ChemSynth" },
  { id: 5, name: "Aluminum Fasteners", sku: "HD-992", stock: 5000, unit: "box", status: "In Stock", supplier: "FastenUp" },
];

const LISTED_ITEMS = [
  { id: 1, name: "Ergonomic Office Chair", sku: "PRD-101", price: "$120.00", stock: 15, platform: "Amazon", views: "1.2k" },
  { id: 2, name: "Minimalist Study Table", sku: "PRD-205", price: "$240.50", stock: 8, platform: "Shopify", views: "850" },
  { id: 3, name: "Velvet Sofa Set", sku: "PRD-330", price: "$899.00", stock: 2, platform: "Wayfair", views: "3.4k" },
  { id: 4, name: "Wooden Dining Table", sku: "PRD-412", price: "$550.00", stock: 12, platform: "In-Store", views: "N/A" },
];

// --- COMPONENTS ---

const StatusBadge = ({ status }) => {
  // Using generic color names that Tailwind maps to theme colors if configured, 
  // or standard colors that compliment burgundy well.
  const styles = {
    "In Stock": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Low Stock": "bg-amber-50 text-amber-700 border-amber-100",
    "Out of Stock": "bg-rose-50 text-rose-700 border-rose-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const ChatMessage = ({ msg }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex gap-3 mb-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
  >
    {/* Avatar */}
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm ${msg.sender === 'ai' ? 'bg-gradient-to-br from-primary to-[#851e45] text-white' : 'bg-[#fdf2f6] text-primary'}`}>
      {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
    </div>
    
    {/* Bubble */}
    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
      msg.sender === 'ai' 
        ? 'bg-white border border-[#f2d8e4] text-main rounded-tl-none' 
        : 'bg-primary text-white rounded-tr-none shadow-primary/20'
    }`}>
      {msg.content}
      {msg.attachment && (
        <div className="mt-2 p-2 bg-white/10 rounded-lg flex items-center gap-2 border border-white/10">
            <FileSpreadsheet size={16} className="text-white"/>
            <span className="text-xs font-medium text-white">{msg.attachment}</span>
        </div>
      )}
    </div>
  </motion.div>
);

const InventoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('raw'); // 'raw' | 'listed'
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', content: "Hi there! 👋 I'm your Inventory Assistant. You can upload an Excel sheet or paste a WhatsApp message to update stock instantly." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const newMsg = { id: Date.now(), sender: 'user', content: inputValue };
    setChatMessages(prev => [...prev, newMsg]);
    setInputValue("");

    // Simulate AI processing
    setTimeout(() => {
        setChatMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            sender: 'ai', 
            content: "I've parsed that message. Updating 50 units of 'Teak Wood' and marking 'Steel Rods' as received. 📦✅" 
        }]);
    }, 1500);
  };

  const handleQuickAction = (type) => {
      if (type === 'excel') {
          const userMsg = { id: Date.now(), sender: 'user', content: "Importing Q1_Inventory.xlsx...", attachment: "Q1_Inventory.xlsx" };
          setChatMessages(prev => [...prev, userMsg]);
          setTimeout(() => {
            setChatMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                sender: 'ai', 
                content: "File processed! Added 124 new SKUs to your Raw Materials inventory." 
            }]);
        }, 2000);
      }
  };

  return (
    // Outer Container: Used theme variable 'primary-soft' for background tint
    <div className="min-h-screen bg-[#fdf2f6]/50 font-outfit p-4 md:p-6 flex flex-col md:flex-row gap-6 text-main">
      
      {/* ==============================================
          LEFT PANEL: MAIN DASHBOARD (70%)
      ============================================== */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-[#f2d8e4] overflow-hidden flex flex-col"
      >
        
        {/* --- Header & Toggle --- */}
        <div className="p-6 border-b border-[#f2d8e4]/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Inventory</h1>
            <p className="text-soft text-sm">Manage your supply chain & listings</p>
          </div>

          {/* THE TOGGLE - Centered & Animated */}
          <div className="bg-[#fdf2f6] p-1.5 rounded-full flex relative border border-[#f2d8e4]">
             <motion.div 
                className="absolute top-1.5 bottom-1.5 bg-white rounded-full shadow-sm z-0"
                initial={false}
                animate={{ 
                    x: activeTab === 'raw' ? 0 : '100%',
                    width: '50%'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
             />
             <button 
                onClick={() => setActiveTab('raw')}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'raw' ? 'text-primary' : 'text-soft hover:text-primary'}`}
             >
                <div className="flex items-center gap-2">
                    <Package size={16} />
                    Raw Items
                </div>
             </button>
             <button 
                onClick={() => setActiveTab('listed')}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'listed' ? 'text-primary' : 'text-soft hover:text-primary'}`}
             >
                <div className="flex items-center gap-2">
                    <ShoppingCart size={16} />
                    Listed Items
                </div>
             </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
             <button className="p-2.5 rounded-xl bg-[#fdf2f6] text-primary/70 hover:bg-primary hover:text-white transition-colors">
                <Search size={20} />
             </button>
             <button className="p-2.5 rounded-xl bg-[#fdf2f6] text-primary/70 hover:bg-primary hover:text-white transition-colors">
                <Filter size={20} />
             </button>
          </div>
        </div>

        {/* --- Content Grid --- */}
        <div className="p-6 flex-1 overflow-y-auto bg-[#fafafa]">
           <AnimatePresence mode="wait">
             {activeTab === 'raw' ? (
                <motion.div 
                    key="raw"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid gap-3"
                >
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-soft/60 uppercase tracking-wider">
                        <div className="col-span-4">Item Name</div>
                        <div className="col-span-2">SKU</div>
                        <div className="col-span-2">Quantity</div>
                        <div className="col-span-3">Status</div>
                        <div className="col-span-1"></div>
                    </div>
                    
                    {RAW_ITEMS.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-white p-4 rounded-2xl border border-[#f2d8e4]/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group">
                            <div className="col-span-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#fdf2f6] text-primary flex items-center justify-center font-bold">
                                    {item.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-main">{item.name}</div>
                                    <div className="text-xs text-soft">{item.supplier}</div>
                                </div>
                            </div>
                            <div className="col-span-2 text-sm font-mono text-soft/80">{item.sku}</div>
                            <div className="col-span-2 font-bold text-main">{item.stock} <span className="text-xs font-normal text-soft">{item.unit}</span></div>
                            <div className="col-span-3">
                                <StatusBadge status={item.status} />
                            </div>
                            <div className="col-span-1 text-right">
                                <button className="p-2 hover:bg-[#fdf2f6] rounded-lg text-soft hover:text-primary transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </motion.div>
             ) : (
                <motion.div 
                    key="listed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {LISTED_ITEMS.map((item) => (
                         <div key={item.id} className="bg-white p-5 rounded-2xl border border-[#f2d8e4]/50 shadow-sm hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group relative overflow-hidden">
                             {/* Decorative highlight */}
                             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -mr-10 -mt-10"></div>
                             
                             <div className="flex justify-between items-start mb-4 relative">
                                 <div className="w-12 h-12 rounded-xl bg-[#fdf2f6] text-primary flex items-center justify-center border border-[#f2d8e4]">
                                     <ShoppingCart size={22} />
                                 </div>
                                 <span className="text-xs font-bold px-2 py-1 bg-[#fafafa] rounded-lg text-soft border border-[#f0f0f0]">{item.platform}</span>
                             </div>
                             
                             <h3 className="font-bold text-lg text-main mb-1">{item.name}</h3>
                             <p className="text-sm text-soft mb-4 font-mono">{item.sku}</p>
                             
                             <div className="flex items-center justify-between pt-4 border-t border-[#f2d8e4]/30">
                                 <div>
                                     <div className="text-xs text-soft">Price</div>
                                     <div className="font-bold text-primary">{item.price}</div>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-xs text-soft">Stock Level</div>
                                     <div className={`font-bold ${item.stock < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>{item.stock} units</div>
                                 </div>
                             </div>
                             
                             <button className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                 <ArrowUpRight size={18} />
                             </button>
                         </div>
                    ))}
                </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>

      {/* ==============================================
          RIGHT PANEL: AI ASSISTANT (30%)
      ============================================== */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        // Changed background to white with a warm pink border/shadow tint
        className="w-full md:w-[380px] bg-white rounded-[2rem] border border-[#f2d8e4] flex flex-col shadow-xl shadow-primary/5 overflow-hidden relative"
      >
        {/* Decorative Background for Chat Header - using Primary Gradient */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#fdf2f6] to-transparent pointer-events-none"></div>

        {/* Header */}
        <div className="p-6 pb-4 relative z-10">
            <div className="flex items-center gap-3 mb-1">
                {/* AI Icon - now matches theme gradient */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#851e45] flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <Bot size={22} />
                </div>
                <div>
                    <h2 className="font-bold text-main">Inventory AI</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs text-emerald-600 font-medium">Online</span>
                    </div>
                </div>
            </div>
            
            {/* Quick Import Actions - Colored to match theme */}
            <div className="grid grid-cols-2 gap-2 mt-4">
                <button 
                    onClick={() => handleQuickAction('excel')}
                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-[#f2d8e4] shadow-sm hover:border-primary/30 hover:shadow-md transition-all group"
                >
                    {/* Excel Icon Container */}
                    <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileSpreadsheet size={16} />
                    </div>
                    <span className="text-xs font-semibold text-soft group-hover:text-primary">Excel Import</span>
                </button>
                <button 
                     onClick={() => { setInputValue("Copied from WhatsApp: Received 200 chairs from Zenith"); }}
                     className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-[#f2d8e4] shadow-sm hover:border-primary/30 hover:shadow-md transition-all group"
                >
                    {/* WhatsApp Icon Container */}
                    <div className="w-8 h-8 rounded-full bg-[#fdf2f6] text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare size={16} />
                    </div>
                    <span className="text-xs font-semibold text-soft group-hover:text-primary">WhatsApp Msg</span>
                </button>
            </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
             {chatMessages.map(msg => (
                 <ChatMessage key={msg.id} msg={msg} />
             ))}
             <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-[#f2d8e4]/50">
            <div className="relative">
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type or paste inventory data..."
                    className="w-full bg-[#fafafa] border border-[#f2d8e4] text-main text-sm rounded-xl pl-4 pr-12 py-3.5 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-soft/60"
                />
                <button 
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-lg hover:bg-[#4a0e26] transition-colors shadow-md shadow-primary/20"
                >
                    <Send size={16} />
                </button>
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
                <button className="text-soft hover:text-primary transition-colors">
                    <Paperclip size={16} />
                </button>
                <span className="text-[10px] text-soft/70">AI processes natural language & files</span>
            </div>
        </div>

      </motion.div>

    </div>
  );
};

export default InventoryDashboard;