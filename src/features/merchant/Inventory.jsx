import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  RotateCw,
  Camera,
  Sparkles,
  X,
  Check,
  Loader2,
  ImagePlus
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '../../app/providers/AuthContext';
import { getRawInventory, getListedInventory, updateRawStock, bulkInsertRawItems, bulkInsertListedItems, updateListedItemImage } from '../../services/inventoryService';
import { getProductImageUrl, uploadProductImage } from '../../services/storageService';
import { processExcelInventory, enhanceProductImage } from '../../services/aiService';

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
    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'ai'
      ? 'bg-white border border-[#f2d8e4] text-slate-800 rounded-tl-none'
      : 'bg-[#59112e] text-white rounded-tr-none shadow-[#59112e]/20'
      }`}>
      {msg.content}
      {msg.attachment && (
        <div className="mt-2 p-2 bg-white/10 rounded-lg flex items-center gap-2 border border-white/10">
          <FileSpreadsheet size={16} className="text-white" />
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
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [excelProcessing, setExcelProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Image upload & enhancement state
  const [uploadingImageFor, setUploadingImageFor] = useState(null); // item id
  const [enhanceModal, setEnhanceModal] = useState(null); // { item, originalUrl, enhancedBase64, enhancedMimeType, loading, error }

  const triggerImageUpload = useCallback((item) => {
    setUploadingImageFor(item.id);
    imageInputRef.current?.click();
  }, []);

  const handleProductImageUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file || !uploadingImageFor) return;
    const itemId = uploadingImageFor;
    const ext = file.name.split('.').pop();
    const fileName = `${user.merchantProfileId}/${itemId}-${Date.now()}.${ext}`;

    try {
      setUploadingImageFor('loading_' + itemId);
      const { url, error } = await uploadProductImage(file, fileName);
      if (error) throw error;
      // Update DB
      await updateListedItemImage(itemId, fileName);
      // Update local state
      setListedItems(prev => prev.map(it =>
        it.id === itemId ? { ...it, imageUrl: url, image_url: fileName } : it
      ));
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploadingImageFor(null);
      e.target.value = '';
    }
  };

  const handleEnhanceImage = async (item) => {
    if (!item.imageUrl) return;
    setEnhanceModal({ item, originalUrl: item.imageUrl, enhancedBase64: null, enhancedMimeType: null, loading: true, error: null });

    try {
      // Fetch image and convert to base64
      const res = await fetch(item.imageUrl);
      const blob = await res.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
      });

      const result = await enhanceProductImage(base64, blob.type || 'image/jpeg');
      setEnhanceModal(prev => ({ ...prev, enhancedBase64: result.base64, enhancedMimeType: result.mimeType, loading: false }));
    } catch (err) {
      console.error('Enhancement failed:', err);
      setEnhanceModal(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  const handleAcceptEnhanced = async () => {
    if (!enhanceModal?.enhancedBase64) return;
    const { item, enhancedBase64, enhancedMimeType } = enhanceModal;
    try {
      setEnhanceModal(prev => ({ ...prev, loading: true }));
      // Convert base64 to file
      const byteChars = atob(enhancedBase64);
      const byteArr = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
      const ext = enhancedMimeType.includes('png') ? 'png' : 'jpg';
      const fileName = `${user.merchantProfileId}/${item.id}-enhanced-${Date.now()}.${ext}`;
      const file = new File([byteArr], fileName, { type: enhancedMimeType });

      const { url, error } = await uploadProductImage(file, fileName);
      if (error) throw error;
      await updateListedItemImage(item.id, fileName);
      setListedItems(prev => prev.map(it =>
        it.id === item.id ? { ...it, imageUrl: url, image_url: fileName } : it
      ));
      setEnhanceModal(null);
    } catch (err) {
      console.error('Failed to save enhanced image:', err);
      setEnhanceModal(prev => ({ ...prev, loading: false, error: 'Failed to save. Try again.' }));
    }
  };

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
      setRawItems((raw || []).map(r => ({
        ...r,
        supplier: r.supplier_name,
        status: STATUS_MAP[r.status] || r.status,
      })));
      setListedItems((listed || []).map(l => ({
        ...l,
        price: `₹${Number(l.price).toFixed(2)}`,
        views: 'N/A',
        imageUrl: getProductImageUrl(l.image_url),
      })));
    }).catch(err => {
      console.error('Failed to load inventory:', err);
      setRawItems([]);
      setListedItems([]);
    })
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
    if (type === 'excel') fileInputRef.current?.click();
  };

  const handleRefill = (item) => {
    const name = typeof item === 'object' && item?.name != null ? item.name : item;
    setInputValue(`Refill request for ${name}...`);
  };

  const handleExcelUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file || !user?.merchantProfileId) return;
    setExcelProcessing(true);
    const fileName = file.name;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'user', content: `Importing ${fileName}...`, attachment: fileName }]);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const firstSheet = wb.Sheets[wb.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(firstSheet);
      const targetType = activeTab === 'raw' ? 'raw' : 'listed';
      const items = await processExcelInventory(sheetData, targetType);
      if (targetType === 'raw') {
        await bulkInsertRawItems(user.merchantProfileId, items);
      } else {
        await bulkInsertListedItems(user.merchantProfileId, items);
      }
      const [raw, listed] = await Promise.all([
        getRawInventory(user.merchantProfileId),
        getListedInventory(user.merchantProfileId),
      ]);
      setRawItems((raw || []).map(r => ({ ...r, supplier: r.supplier_name, status: STATUS_MAP[r.status] || r.status })));
      setListedItems((listed || []).map(l => ({ ...l, price: `₹${Number(l.price).toFixed(2)}`, views: 'N/A', imageUrl: getProductImageUrl(l.image_url) })));
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', content: `File processed! Added ${items.length} items to your ${targetType === 'raw' ? 'Raw Materials' : 'Listed'} inventory.` }]);
    } catch (err) {
      console.error('Excel import error:', err);
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', content: `Import failed: ${err?.message || 'Unknown error'}. Please try again.` }]);
    } finally {
      setExcelProcessing(false);
      e.target.value = '';
    }
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

                {rawItems.length === 0 ? (
                  <div className="col-span-12 text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#fdf2f6] flex items-center justify-center">
                      <Package size={28} className="text-[#59112e]/40" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-500 mb-1">No raw items found</h3>
                    <p className="text-sm text-slate-400">Use the AI Assistant to import inventory data</p>
                  </div>
                ) : (
                  rawItems.map((item) => (
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
                          onClick={() => handleRefill(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf2f6] text-[#59112e] rounded-lg text-xs font-bold hover:bg-[#59112e] hover:text-white transition-colors border border-[#f2d8e4]"
                        >
                          <RotateCw size={14} /> Refill
                        </button>
                        <button className="p-2 hover:bg-[#fdf2f6] rounded-lg text-slate-400 hover:text-[#59112e] transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="listed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Hidden file input for product images */}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProductImageUpload}
                />

                {listedItems.length === 0 ? (
                  <div className="col-span-2 text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#fdf2f6] flex items-center justify-center">
                      <ShoppingCart size={28} className="text-[#59112e]/40" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-500 mb-1">No listed items yet</h3>
                    <p className="text-sm text-slate-400">Items you list for sale will appear here</p>
                  </div>
                ) : (
                  listedItems.map((item) => {
                    const isUploading = uploadingImageFor === 'loading_' + item.id;
                    return (
                      <div key={item.id} className="bg-white rounded-2xl border border-[#f2d8e4]/50 shadow-sm hover:border-[#59112e]/20 hover:shadow-lg hover:shadow-[#59112e]/5 transition-all group relative overflow-hidden">

                        {/* ── Product Image Area ── */}
                        <div className="relative w-full h-44 bg-gradient-to-br from-[#fdf2f6] to-[#f5e6ed] overflow-hidden">
                          {item.imageUrl ? (
                            <>
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                              {/* Hover overlay with actions */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-3 gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); triggerImageUpload(item); }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-700 rounded-lg text-xs font-bold hover:bg-white transition-colors shadow-lg"
                                >
                                  <Camera size={14} /> Change
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEnhanceImage(item); }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg text-xs font-bold hover:from-violet-600 hover:to-purple-700 transition-colors shadow-lg"
                                >
                                  <Sparkles size={14} /> Enhance with AI
                                </button>
                              </div>
                            </>
                          ) : (
                            /* No image – upload placeholder */
                            <div
                              className="w-full h-full flex flex-col items-center justify-center cursor-pointer relative"
                              onClick={() => triggerImageUpload(item)}
                            >
                              {isUploading ? (
                                <Loader2 size={32} className="text-[#59112e]/50 animate-spin" />
                              ) : (
                                <>
                                  <div className="w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center mb-2 border border-[#f2d8e4]">
                                    <ImagePlus size={24} className="text-[#59112e]/40" />
                                  </div>
                                  <span className="text-xs font-semibold text-[#59112e]/40">Add Product Image</span>
                                  {/* Hover CTA */}
                                  <div className="absolute inset-0 bg-[#59112e]/10 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                    <div className="bg-white px-4 py-2.5 rounded-xl shadow-xl text-[#59112e] font-bold text-sm flex items-center gap-2 border border-[#f2d8e4]">
                                      <Camera size={16} /> Upload Image
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}

                          {/* Uploading overlay */}
                          {isUploading && item.imageUrl && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                              <Loader2 size={28} className="text-[#59112e] animate-spin" />
                            </div>
                          )}
                        </div>

                        {/* ── Card Content ── */}
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-slate-800 mb-0.5 truncate">{item.name}</h3>
                              <p className="text-sm text-slate-500 font-mono">{item.sku}</p>
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-[#fafafa] rounded-lg text-slate-500 border border-[#f0f0f0] shrink-0 ml-2">{item.platform}</span>
                          </div>

                          <div className="flex items-center gap-6 pt-3 border-t border-[#f2d8e4]/30">
                            <div>
                              <div className="text-xs text-slate-500">Price</div>
                              <div className="font-bold text-[#59112e]">{item.price}</div>
                            </div>
                            <div className="pl-6 border-l border-[#f2d8e4]">
                              <div className="text-xs text-slate-500">Stock Level</div>
                              <div className={`font-bold ${item.stock < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>{item.stock} units</div>
                            </div>
                          </div>

                          {/* Hover action buttons */}
                          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleRefill(item)}
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
                      </div>
                    );
                  })
                )}

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

          {/* Hidden file input for Excel */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleExcelUpload}
          />

          {/* Quick Import Actions */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => handleQuickAction('excel')}
              disabled={excelProcessing}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-[#f2d8e4] shadow-sm hover:border-[#59112e]/30 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className={`w-8 h-8 rounded-full bg-[#f0fdf4] text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform ${excelProcessing ? 'animate-spin' : ''}`}>
                {excelProcessing ? <RotateCw size={16} /> : <FileSpreadsheet size={16} />}
              </div>
              <span className="text-xs font-semibold text-slate-500 group-hover:text-[#59112e]">
                {excelProcessing ? 'Processing...' : 'Excel Import'}
              </span>
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
          {isAiLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm bg-gradient-to-br from-[#59112e] to-[#851e45] text-white">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-[#f2d8e4] p-3.5 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-[#59112e]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#59112e]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#59112e]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
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
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={excelProcessing}
              className="text-slate-400 hover:text-[#59112e] transition-colors disabled:opacity-50"
            >
              <Paperclip size={16} />
            </button>
            <span className="text-[10px] text-slate-400/70">AI processes natural language & files</span>
          </div>
        </div>

      </motion.div>

      {/* ══════════════════════════════════════════════
          AI IMAGE ENHANCEMENT COMPARISON MODAL
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {enhanceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => !enhanceModal.loading && setEnhanceModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 pb-4 border-b border-[#f2d8e4]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">AI Image Enhancement</h2>
                    <p className="text-xs text-slate-500">{enhanceModal.item?.name}</p>
                  </div>
                </div>
                {!enhanceModal.loading && (
                  <button
                    onClick={() => setEnhanceModal(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {enhanceModal.loading && !enhanceModal.enhancedBase64 ? (
                  /* Loading State */
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                        <Loader2 size={36} className="text-purple-600 animate-spin" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Sparkles size={12} className="text-white" />
                      </div>
                    </div>
                    <p className="mt-5 text-sm font-bold text-slate-700">Enhancing your image with AI...</p>
                    <p className="mt-1 text-xs text-slate-400">Creating a premium e-commerce ready photo</p>
                  </div>
                ) : enhanceModal.error ? (
                  /* Error State */
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
                      <X size={28} className="text-rose-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Enhancement Failed</p>
                    <p className="mt-1 text-xs text-slate-400 text-center max-w-xs">{enhanceModal.error}</p>
                    <button
                      onClick={() => setEnhanceModal(null)}
                      className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  /* Comparison View */
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original</span>
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square">
                          <img src={enhanceModal.originalUrl} alt="Original" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={12} className="text-purple-500" />
                          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">AI Enhanced</span>
                        </div>
                        <div className="rounded-2xl overflow-hidden border-2 border-purple-200 bg-slate-50 aspect-square ring-4 ring-purple-50">
                          <img
                            src={`data:${enhanceModal.enhancedMimeType};base64,${enhanceModal.enhancedBase64}`}
                            alt="Enhanced"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setEnhanceModal(null)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-colors"
                      >
                        <X size={16} /> Keep Original
                      </button>
                      <button
                        onClick={handleAcceptEnhanced}
                        disabled={enhanceModal.loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-purple-200 disabled:opacity-50"
                      >
                        {enhanceModal.loading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                        Use Enhanced
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default InventoryDashboard;