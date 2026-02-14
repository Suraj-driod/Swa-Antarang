import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Home,
  User,
  Clock,
  MapPin,
  Navigation,
  QrCode,
  CheckCircle2,
  Plus,
  Minus,
  ChevronRight,
  Package,
  Trash2,
  ScanLine,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";

// --- MOCK DATA ---

const PRODUCTS = [
  {
    id: 1,
    name: "Teak Wood Planks",
    price: 4200,
    category: "Raw Material",
    image: "🪵",
    stock: 12,
    unit: "bundle",
  },
  {
    id: 2,
    name: "Industrial Fasteners",
    price: 850,
    category: "Hardware",
    image: "🔩",
    stock: 450,
    unit: "box",
  },
  {
    id: 3,
    name: "Cotton Fabric Roll",
    price: 1200,
    category: "Textile",
    image: "🧵",
    stock: 5,
    unit: "roll",
    lowStock: true,
  },
  {
    id: 4,
    name: "Varnish Grade-A",
    price: 350,
    category: "Chemicals",
    image: "🛢️",
    stock: 20,
    unit: "can",
  },
  {
    id: 5,
    name: "Heavy Duty Glue",
    price: 150,
    category: "Adhesives",
    image: "🧴",
    stock: 50,
    unit: "bottle",
  },
  {
    id: 6,
    name: "Safety Gloves",
    price: 450,
    category: "Safety",
    image: "🧤",
    stock: 100,
    unit: "pair",
  },
];

const ORDER_TIMELINE = [
  { status: "Order Placed", time: "10:30 AM", completed: true },
  { status: "Packed", time: "10:45 AM", completed: true },
  { status: "Out for Delivery", time: "11:15 AM", completed: true },
  { status: "Arrived", time: "11:40 AM", completed: false }, // Active step
];

// --- COMPONENTS ---

// 1. Product Card
const ProductCard = ({ product, onAdd }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative group transition-all hover:shadow-md hover:border-[#f2d8e4]"
  >
    <div className="h-40 bg-[#fdf2f6] rounded-xl flex items-center justify-center text-5xl mb-4 group-hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#59112e]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {product.image}
    </div>

    {product.lowStock && (
      <span className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm animate-pulse z-10">
        Low Stock
      </span>
    )}

    <div className="mb-2">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        {product.category}
      </p>
      <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight truncate">
        {product.name}
      </h3>
    </div>

    <div className="flex items-center justify-between mt-auto">
      <div>
        <span className="text-lg font-bold text-[#59112e]">
          ₹{product.price}
        </span>
        <span className="text-[10px] text-slate-400 font-medium ml-1">
          /{product.unit}
        </span>
      </div>
      <button
        onClick={() => onAdd(product)}
        className="w-9 h-9 rounded-xl bg-[#59112e] text-white flex items-center justify-center shadow-lg shadow-[#59112e]/20 hover:bg-[#450d24] transition-colors active:scale-95"
      >
        <Plus size={18} />
      </button>
    </div>
  </motion.div>
);

// 2. QR Code Modal
const QRCodeModal = ({ onClose, onScanSuccess }) => {
  const [scanning, setScanning] = useState(false);

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      onScanSuccess();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2d0b16]/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/10 rounded-full hover:bg-black/20 text-white z-20"
        >
          <X size={16} />
        </button>

        <div className="bg-[#59112e] p-8 text-center pt-10 pb-16 relative overflow-hidden">
          <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 bg-rose-500/20 rounded-full blur-xl"></div>
          <h2 className="text-white text-xl font-bold relative z-10">
            Secure Delivery
          </h2>
          <p className="text-white/70 text-xs relative z-10 mt-1">
            Show this code to your delivery partner
          </p>
        </div>

        <div className="relative -mt-10 bg-white mx-6 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center">
          {!scanning ? (
            <>
              <div
                className="w-56 h-56 bg-slate-900 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden group cursor-pointer border-4 border-white shadow-sm"
                onClick={handleSimulateScan}
              >
                <div className="absolute inset-0 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Example')] bg-cover opacity-90 mix-blend-screen"></div>
                <ScanLine
                  size={48}
                  className="text-white animate-pulse relative z-10"
                />
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Order #8821
              </p>
              <button
                onClick={handleSimulateScan}
                className="mt-6 w-full py-3 bg-[#fdf2f6] text-[#59112e] font-bold rounded-xl text-xs hover:bg-[#59112e] hover:text-white transition-colors border border-[#f2d8e4]"
              >
                Simulate Driver Scan
              </button>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 animate-bounce">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Verified!</h3>
              <p className="text-slate-500 text-sm mt-2">
                Inventory deducted & Order Completed.
              </p>
            </div>
          )}
        </div>
        <div className="h-6"></div>
      </motion.div>
    </motion.div>
  );
};

// 3. Cart & Tracking Sidebar (Right Panel)
const SidePanel = ({
  activeView,
  cart,
  removeFromCart,
  onCheckout,
  orderStatus,
  setShowQR,
  orderComplete,
}) => {
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-100">
      {/* Header */}
      <div className="p-6 border-b border-slate-50">
        <h2 className="text-xl font-bold text-slate-800">
          {activeView === "tracking" ? "Live Tracking" : "Your Cart"}
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          {activeView === "tracking"
            ? "Order #8821"
            : `${cart.length} Items added`}
        </p>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeView === "cart" ? (
          <>
            {cart.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <ShoppingBag
                  size={48}
                  className="mx-auto mb-3 text-slate-300"
                />
                <p className="text-sm font-bold text-slate-400">
                  Your cart is empty
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-700">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#59112e] font-bold">
                        ₹{item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Tracking View
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="h-48 bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#59112e_1px,transparent_1px)] bg-[length:16px_16px]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Navigation
                  className="text-[#59112e] animate-pulse"
                  size={32}
                />
              </div>
              <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-[#59112e] shadow-sm">
                12 mins away
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-4 space-y-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-100"></div>
              {ORDER_TIMELINE.map((step, idx) => (
                <div key={idx} className="relative z-10 flex gap-4">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 bg-white ${
                      step.completed || orderComplete
                        ? "border-[#59112e]"
                        : "border-slate-200"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${step.completed || orderComplete ? "bg-[#59112e]" : "bg-transparent"}`}
                    ></div>
                  </div>
                  <div>
                    <p
                      className={`text-xs font-bold ${step.completed || orderComplete ? "text-slate-800" : "text-slate-400"}`}
                    >
                      {step.status}
                    </p>
                    <p className="text-[10px] text-slate-400">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer - Fixed */}
      <div className="p-6 border-t border-slate-50 bg-white">
        {activeView === "cart" ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-[#59112e]">
                ₹{total}
              </span>
            </div>
            <button
              onClick={onCheckout}
              disabled={cart.length === 0}
              className="w-full py-3.5 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#59112e]/20 hover:bg-[#450d24] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all"
            >
              Place Order & Pay
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowQR(true)}
            className="w-full py-3.5 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#59112e]/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <QrCode size={18} /> Show Delivery QR
          </button>
        )}
      </div>
    </div>
  );
};

const CustomerApp = () => {
  const [activeTab, setActiveTab] = useState("home"); // Mobile Tab State: 'home', 'cart', 'tracking'
  const [desktopView, setDesktopView] = useState("cart"); // Desktop Right Panel: 'cart', 'tracking'
  const [cart, setCart] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Responsive: If on mobile and switching tabs, sync logic
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "cart") setDesktopView("cart");
    if (tab === "tracking") setDesktopView("tracking");
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const placeOrder = () => {
    // Simulate API Call
    setTimeout(() => {
      if (window.innerWidth < 1024) {
        setActiveTab("tracking");
      } else {
        setDesktopView("tracking");
      }
      // Note: In a real app we wouldn't clear cart immediately if tracking is a separate order history
      // But for this demo flow:
      // setCart([]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-outfit flex flex-col md:flex-row">
      {/* --- DESKTOP SIDEBAR (Navigation) --- */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-[#59112e] rounded-lg flex items-center justify-center text-white font-bold">
            SM
          </div>
          <span className="font-bold text-slate-800 text-lg">
            SupplierMatch
          </span>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => handleTabChange("home")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === "home" ? "bg-[#fdf2f6] text-[#59112e]" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
          >
            <Home size={18} /> Browse Products
          </button>
          <button
            onClick={() => handleTabChange("cart")} // Only relevant for highlighting, content is in right panel
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${desktopView === "cart" && activeTab !== "home" ? "bg-[#fdf2f6] text-[#59112e]" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
          >
            <ShoppingBag size={18} /> My Cart
            {cart.length > 0 && (
              <span className="ml-auto bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                {cart.length}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabChange("tracking")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${desktopView === "tracking" ? "bg-[#fdf2f6] text-[#59112e]" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
          >
            <Clock size={18} /> Orders & Tracking
          </button>
        </nav>

        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600">
            <User size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Acme Corp</p>
            <p className="text-[10px] text-slate-400">Pro Member</p>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col md:flex-row relative">
        {/* PRODUCT GRID (Scrollable Center) */}
        <div
          className={`flex-1 p-6 md:p-10 overflow-y-auto h-screen ${activeTab !== "home" ? "hidden md:block" : "block"}`}
        >
          {/* Mobile Header */}
          <div className="md:hidden flex justify-between items-center mb-6 sticky top-0 bg-[#f8f9fa] z-20 py-2">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Location
              </p>
              <div className="flex items-center gap-1 text-[#59112e] font-bold text-sm">
                <MapPin size={14} /> Pune, IN <ChevronRight size={14} />
              </div>
            </div>
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
              <User size={16} className="text-slate-600" />
            </div>
          </div>

          {/* Banner */}
          <div className="h-40 md:h-48 bg-gradient-to-r from-[#59112e] to-[#9d174d] rounded-[32px] mb-10 relative overflow-hidden flex items-center px-8 md:px-12 shadow-2xl shadow-[#59112e]/20">
            <div className="relative z-10 text-white">
              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide mb-3 inline-block">
                Flash Sale
              </span>
              <h2 className="font-bold text-2xl md:text-3xl mb-1">
                Restock Your Inventory
              </h2>
              <p className="text-sm text-white/80 mb-4 max-w-xs">
                Get up to 20% off on bulk Hardware orders today.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 text-[10rem] opacity-10 rotate-12">
              📦
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-4 mb-8 sticky top-14 md:top-0 z-10 bg-[#f8f9fa] pb-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search materials..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-sm font-medium outline-none focus:border-[#59112e] shadow-sm transition-colors"
              />
            </div>
            <button className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#59112e] hover:border-[#59112e] transition-colors shadow-sm">
              <Menu size={20} />
            </button>
          </div>

          {/* Grid */}
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Featured Products
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 pb-24 md:pb-0">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL (Desktop: Fixed / Mobile: Full Screen Overlay for Cart/Tracking) */}
        <div
          className={`
              md:w-[400px] bg-white border-l border-slate-100 h-screen sticky top-0 z-30
              ${activeTab === "home" ? "hidden md:block" : "fixed inset-0 md:static block"}
          `}
        >
          {/* Mobile Back Button (Only shows when overlaid) */}
          <div className="md:hidden p-4 border-b border-slate-50 flex items-center gap-2">
            <button
              onClick={() => setActiveTab("home")}
              className="p-2 -ml-2 hover:bg-slate-50 rounded-full"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <span className="font-bold text-slate-800">Back to Shop</span>
          </div>

          <SidePanel
            activeView={window.innerWidth < 768 ? activeTab : desktopView}
            cart={cart}
            removeFromCart={removeFromCart}
            onCheckout={placeOrder}
            orderStatus={ORDER_TIMELINE}
            setShowQR={setShowQR}
            orderComplete={orderComplete}
          />
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-40 pb-safe">
        <button
          onClick={() => handleTabChange("home")}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "home" ? "text-[#59112e]" : "text-slate-400"}`}
        >
          <Home size={24} strokeWidth={activeTab === "home" ? 2.5 : 2} />
          {activeTab === "home" && (
            <span className="w-1 h-1 rounded-full bg-[#59112e]"></span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => handleTabChange("cart")}
            className="w-14 h-14 bg-[#59112e] rounded-full text-white flex items-center justify-center shadow-lg shadow-[#59112e]/30 -mt-8 border-4 border-[#f8f9fa] active:scale-95 transition-transform"
          >
            <ShoppingBag size={24} />
          </button>
          {cart.length > 0 && (
            <span className="absolute top-[-25px] right-0 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
              {cart.length}
            </span>
          )}
        </div>

        <button
          onClick={() => handleTabChange("tracking")}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "tracking" ? "text-[#59112e]" : "text-slate-400"}`}
        >
          <Clock size={24} strokeWidth={activeTab === "tracking" ? 2.5 : 2} />
          {activeTab === "tracking" && (
            <span className="w-1 h-1 rounded-full bg-[#59112e]"></span>
          )}
        </button>
      </div>

      {/* --- QR MODAL OVERLAY --- */}
      <AnimatePresence>
        {showQR && (
          <QRCodeModal
            onClose={() => setShowQR(false)}
            onScanSuccess={() => {
              setShowQR(false);
              setOrderComplete(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerApp;
