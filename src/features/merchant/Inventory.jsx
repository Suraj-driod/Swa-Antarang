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
  User,
  RotateCw
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';
import { getRawInventory, getListedInventory } from '../../services/inventoryService';

// Status map from DB enum to display
const STATUS_MAP = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

// --- COMPONENTS ---

const StatusBadge = ({ status }) => {
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
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm ${msg.sender === 'ai' ? 'bg-gradient-to-br from-[#59112e] to-[#851e45] text-white' : 'bg-[#fdf2f6] text-[#59112e]'}`}>
      {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
    </div>
    
    {/* Bubble */}
    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
      msg.sender === 'ai' 
        ? 'bg-white border border-[#f2d8e4] text-slate-800 rounded-tl-none' 
        : 'bg-[#59112e] text-white rounded-tr-none shadow-[#59112e]/20'
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('raw');
  const [rawItems, setRawItems] = useState([]);
  const [listedItems, setListedItems] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', content: "Hi there! 👋 I'm your Inventory Assistant. You can upload an Excel sheet or paste a WhatsApp message to update stock instantly." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  // Fetch inventory data
  useEffect(() => {
    if (!user?.merchantProfileId) return;
    setLoadingData(true);
    Promise.all([
      getRawInventory(user.merchantProfileId),
      getListedInventory(user.merchantProfileId),
    ]).then(([raw, listed]) => {
      setRawItems(raw.map(r => ({
        ...r,
        supplier: r.supplier_name,
        status: STATUS_MAP[r.status] || r.status,
      })));
      setListedItems(listed.map(l => ({
        ...l,
        price: `$${Number(l.price).toFixed(2)}`,
        views: 'N/A',
      })));
    }).catch(console.error)
      .finally(() => setLoadingData(false));
  }, [user?.merchantProfileId]);

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

  const handleRefill = (itemName) => {
      setInputValue(`Refill request for ${itemName}...`);
  };

  return (
    <div className="min-h-screen bg-[#fdf2f6]/50 font-outfit p-4 md:p-6 pt-24 md:pt-28 flex flex-col md:flex-row gap-6 text-slate-800">
      
      {/* ==============================================
          LEFT PANEL: MAIN DASHBOARD (70%)
      ============================================== */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 bg-white rounded-[2rem] shadow-xl shadow-[#59112e]/5 border border-[#f2d8e4] overflow-hidden flex flex-col h-[calc(100vh-8rem)]"
      >
        
        {/* --- Header & Toggle --- */}
        <div className="p-6 border-b border-[#f2d8e4]/50 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-[#59112e]">Inventory</h1>
            <p className="text-slate-500 text-sm">Manage your supply chain & listings</p>
          </div>

          {/* THE TOGGLE */}
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
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'raw' ? 'text-[#59112e]' : 'text-slate-400 hover:text-[#59112e]'}`}
             >
                <div className="flex items-center gap-2">
                    <Package size={16} />
                    Raw Items
                </div>
             </button>
             <button 
                onClick={() => setActiveTab('listed')}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'listed' ? 'text-[#59112e]' : 'text-slate-400 hover:text-[#59112e]'}`}
             >
                <div className="flex items-center gap-2">
                    <ShoppingCart size={16} />
                    Listed Items
                </div>
             </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
             <button className="p-2.5 rounded-xl bg-[#fdf2f6] text-[#59112e]/70 hover:bg-[#59112e] hover:text-white transition-colors">
                <Search size={20} />
             </button>
             <button className="p-2.5 rounded-xl bg-[#fdf2f6] text-[#59112e]/70 hover:bg-[#59112e] hover:text-white transition-colors">
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
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:grid">
                        <div className="col-span-4">Item Name</div>
                        <div className="col-span-2">SKU</div>
                        <div className="col-span-2">Quantity</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>
                    
                    {rawItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 rounded-2xl border border-[#f2d8e4]/50 shadow-sm hover:shadow-md hover:border-[#59112e]/20 transition-all group">
                            <div className="col-span-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#fdf2f6] text-[#59112e] flex items-center justify-center font-bold shrink-0">
                                    {item.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">{item.name}</div>
                                    <div className="text-xs text-slate-500">{item.supplier}</div>
                                </div>
                            </div>
                            <div className="col-span-2 text-sm font-mono text-slate-500/80 flex items-center gap-2">
                                <span className="md:hidden text-xs font-bold text-slate-400">SKU:</span>
                                {item.sku}
                            </div>
                            <div className="col-span-2 font-bold text-slate-800 flex items-center gap-2">
                                <span className="md:hidden text-xs font-bold text-slate-400">Qty:</span>
                                {item.stock} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <span className="md:hidden text-xs font-bold text-slate-400">Status:</span>
                                <StatusBadge status={item.status} />
                            </div>
                            <div className="col-span-2 text-right hidden md:flex items-center justify-end gap-2">
                                {/* Refill Button */}
                                <button 
                                    onClick={() => handleRefill(item.name)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf2f6] text-[#59112e] rounded-lg text-xs font-bold hover:bg-[#59112e] hover:text-white transition-colors border border-[#f2d8e4]"
                                >
                                    <RotateCw size={14} /> Refill
                                </button>
                                <button className="p-2 hover:bg-[#fdf2f6] rounded-lg text-slate-400 hover:text-[#59112e] transition-colors">
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
                    {listedItems.map((item) => (
                          <div key={item.id} className="bg-white p-5 rounded-2xl border border-[#f2d8e4]/50 shadow-sm hover:border-[#59112e]/20 hover:shadow-lg hover:shadow-[#59112e]/5 transition-all group relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#59112e]/5 to-transparent rounded-bl-full -mr-10 -mt-10"></div>
                             
                             <div className="flex justify-between items-start mb-4 relative">
                                 <div className="w-12 h-12 rounded-xl bg-[#fdf2f6] text-[#59112e] flex items-center justify-center border border-[#f2d8e4]">
                                     <ShoppingCart size={22} />
                                 </div>
                                 <span className="text-xs font-bold px-2 py-1 bg-[#fafafa] rounded-lg text-slate-500 border border-[#f0f0f0]">{item.platform}</span>
                             </div>
                             
                             <h3 className="font-bold text-lg text-slate-800 mb-1">{item.name}</h3>
                             <p className="text-sm text-slate-500 mb-4 font-mono">{item.sku}</p>
                             
                             {/* MODIFIED FOOTER: Aligned to start to prevent button overlap */}
                             <div className="flex items-center gap-6 pt-4 border-t border-[#f2d8e4]/30">
                                 <div>
                                     <div className="text-xs text-slate-500">Price</div>
                                     <div className="font-bold text-[#59112e]">{item.price}</div>
                                 </div>
                                 
                                 {/* Moved Stock to left with divider */}
                                 <div className="pl-6 border-l border-[#f2d8e4]">
                                     <div className="text-xs text-slate-500">Stock Level</div>
                                     <div className={`font-bold ${item.stock < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>{item.stock} units</div>
                                 </div>
                             </div>
                             
                             {/* Refill Button for Cards (Positions unchanged, but now background is clear) */}
                             <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleRefill(item.name)}
                                    className="p-2 bg-[#fdf2f6] text-[#59112e] rounded-lg shadow-md hover:bg-[#59112e] hover:text-white transition-colors border border-[#f2d8e4]"
                                    title="Refill Stock"
                                >
                                    <RotateCw size={18} />
                                </button>
                                <button className="p-2 bg-[#59112e] text-white rounded-lg shadow-lg hover:bg-[#450d24] transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                             </div>
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
        className="w-full md:w-[380px] bg-white rounded-[2rem] border border-[#f2d8e4] flex flex-col shadow-xl shadow-[#59112e]/5 overflow-hidden relative h-[calc(100vh-8rem)]"
      >
        {/* Decorative Background for Chat Header */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#fdf2f6] to-transparent pointer-events-none"></div>

        {/* Header */}
        <div className="p-6 pb-4 relative z-10 shrink-0">
            <div className="flex items-center gap-3 mb-1">
                {/* AI Icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#59112e] to-[#851e45] flex items-center justify-center text-white shadow-lg shadow-[#59112e]/20">
                    <Bot size={22} />
                </div>
                <div>
                    <h2 className="font-bold text-slate-800">Inventory AI</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs text-emerald-600 font-medium">Online</span>
                    </div>
                </div>
            </div>
            
            {/* Quick Import Actions */}
            <div className="grid grid-cols-2 gap-2 mt-4">
                <button 
                    onClick={() => handleQuickAction('excel')}
                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-[#f2d8e4] shadow-sm hover:border-[#59112e]/30 hover:shadow-md transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileSpreadsheet size={16} />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-[#59112e]">Excel Import</span>
                </button>
                <button 
                     onClick={() => { setInputValue("Copied from WhatsApp: Received 200 chairs from Zenith"); }}
                     className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-[#f2d8e4] shadow-sm hover:border-[#59112e]/30 hover:shadow-md transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-[#fdf2f6] text-[#59112e] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare size={16} />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-[#59112e]">WhatsApp Msg</span>
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
        <div className="p-4 bg-white border-t border-[#f2d8e4]/50 shrink-0">
            <div className="relative">
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type or paste inventory data..."
                    className="w-full bg-[#fafafa] border border-[#f2d8e4] text-slate-800 text-sm rounded-xl pl-4 pr-12 py-3.5 outline-none focus:border-[#59112e] focus:bg-white focus:ring-4 focus:ring-[#59112e]/5 transition-all placeholder:text-slate-400/60"
                />
                <button 
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#59112e] text-white rounded-lg hover:bg-[#4a0e26] transition-colors shadow-md shadow-[#59112e]/20"
                >
                    <Send size={16} />
                </button>
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
                <button className="text-slate-400 hover:text-[#59112e] transition-colors">
                    <Paperclip size={16} />
                </button>
                <span className="text-[10px] text-slate-400/70">AI processes natural language & files</span>
            </div>
        </div>

      </motion.div>

    </div>
  );
};

export default InventoryDashboard;