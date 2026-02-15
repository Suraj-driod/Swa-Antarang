import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  CreditCard,
  Smartphone,
  Banknote,
  LocateFixed,
  ChevronLeft,
  Shield,
  Eye,
  Truck,
  CalendarDays,
  Hash,
  ChevronDown,
  IndianRupee,
} from "lucide-react";
import RouteMap from "../../components/map/TradeMap";

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
  incrementItem,
  decrementItem,
  onCheckout,
  orderStatus,
  setShowQR,
  orderComplete,
}) => {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

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
            : `${totalItems} Items added`}
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
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-700 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#59112e] font-bold">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => decrementItem(item.id)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#59112e] hover:text-[#59112e] transition-colors active:scale-95"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-slate-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementItem(item.id)}
                        className="w-7 h-7 rounded-lg bg-[#59112e] flex items-center justify-center text-white hover:bg-[#450d24] transition-colors active:scale-95"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
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
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 bg-white ${step.completed || orderComplete
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

// --- MY CART PAGE (Full Checkout Flow) ---
const MyCartPage = ({
  cart,
  removeFromCart,
  incrementItem,
  decrementItem,
  onBackToShop,
  onPlaceOrder,
}) => {
  const [step, setStep] = useState("review"); // review | address | payment
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
  });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState("");

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const deliveryFee = total > 2000 ? 0 : 99;
  const grandTotal = total + deliveryFee;

  const handleConfirmAddress = () => {
    setStep("payment");
  };

  const handlePlaceOrder = () => {
    const orderNum = "SA-" + Math.floor(1000 + Math.random() * 9000);
    setPlacedOrderNumber(orderNum);
    const orderData = {
      id: Date.now(),
      orderNumber: orderNum,
      items: [...cart],
      subtotal: total,
      deliveryFee,
      grandTotal,
      paymentMethod: selectedPayment,
      address: { ...address },
      placedAt: new Date().toISOString(),
      status: "placed", // placed | packed | out_for_delivery | delivered
    };
    if (onPlaceOrder) onPlaceOrder(orderData);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
          className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-xl shadow-emerald-200/50"
        >
          <CheckCircle2 size={64} className="text-emerald-600" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="text-4xl mb-4">🎉</p>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Order Placed Successfully!</h2>
          <div className="inline-block bg-slate-100 px-4 py-2 rounded-full mb-3">
            <p className="text-slate-600 font-bold text-sm">Order #{placedOrderNumber}</p>
          </div>
          <p className="text-base text-slate-400 mb-10">
            {selectedPayment === "cod" ? "Pay on delivery" : "Payment confirmed"} • Estimated delivery in 2-4 days
          </p>
          <button
            onClick={onBackToShop}
            className="px-10 py-4 bg-[#59112e] text-white rounded-2xl font-bold text-base shadow-xl shadow-[#59112e]/25 hover:bg-[#450d24] hover:scale-105 transition-all"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-10 bg-white/80 backdrop-blur-sm py-5 px-8 rounded-2xl border border-slate-100 shadow-sm">
        {[
          { key: "review", label: "Cart", icon: ShoppingBag },
          { key: "address", label: "Address", icon: MapPin },
          { key: "payment", label: "Payment", icon: CreditCard },
        ].map((s, i) => (
          <React.Fragment key={s.key}>
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${step === s.key
                  ? "bg-[#59112e] text-white border-[#59112e] shadow-lg shadow-[#59112e]/25 scale-110"
                  : ["review", "address", "payment"].indexOf(step) > i
                    ? "bg-[#59112e] text-white border-[#59112e]"
                    : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}
              >
                {["review", "address", "payment"].indexOf(step) > i ? <CheckCircle2 size={18} /> : <s.icon size={16} />}
              </div>
              <span className={`text-sm font-bold hidden sm:inline transition-colors ${step === s.key ? "text-[#59112e]" : "text-slate-400"}`}>{s.label}</span>
            </div>
            {i < 2 && <div className={`w-12 sm:w-24 h-[3px] rounded-full transition-colors duration-300 ${["review", "address", "payment"].indexOf(step) > i ? "bg-[#59112e]" : "bg-slate-200"}`} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: CART REVIEW */}
        {step === "review" && (
          <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center gap-4 mb-8">
              <button onClick={onBackToShop} className="p-2.5 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100 hover:shadow-sm">
                <ChevronLeft size={22} className="text-slate-600" />
              </button>
              <h2 className="text-2xl font-bold text-slate-800">My Cart</h2>
              <span className="text-sm text-[#59112e] font-bold bg-[#fdf2f6] px-3 py-1.5 rounded-full border border-[#f2d8e4]">{totalItems} items</span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#fdf2f6] to-[#f2d8e4] flex items-center justify-center">
                  <ShoppingBag size={40} className="text-[#59112e]/40" />
                </div>
                <h3 className="text-xl font-bold text-slate-600 mb-2">Your cart is empty</h3>
                <p className="text-sm text-slate-400 mb-8 max-w-xs mx-auto">Browse our products and add items to get started with your order</p>
                <button onClick={onBackToShop} className="px-8 py-3.5 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#59112e]/20 hover:bg-[#450d24] hover:scale-105 transition-all">
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-5 gap-8">
                {/* Cart Items */}
                <div className="md:col-span-3 space-y-4">
                  {cart.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-5 items-center hover:shadow-md hover:border-[#f2d8e4] transition-all group"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-[#fdf2f6] to-[#f8e8ef] rounded-2xl flex items-center justify-center text-4xl shrink-0 group-hover:scale-105 transition-transform shadow-sm">{item.image}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-[#59112e]/60 font-bold uppercase tracking-wider mb-0.5">{item.category}</p>
                        <h4 className="font-bold text-slate-800 text-base truncate mb-1">{item.name}</h4>
                        <p className="text-[#59112e] font-bold text-base">₹{item.price} <span className="text-slate-400 font-medium text-xs">/{item.unit}</span></p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button onClick={() => decrementItem(item.id)} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#59112e] hover:text-[#59112e] hover:bg-[#fdf2f6] transition-all active:scale-90">
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center text-base font-bold text-slate-800">{item.quantity}</span>
                        <button onClick={() => incrementItem(item.id)} className="w-10 h-10 rounded-xl bg-[#59112e] flex items-center justify-center text-white hover:bg-[#450d24] shadow-md shadow-[#59112e]/20 transition-all active:scale-90">
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-right shrink-0 w-24">
                        <p className="font-bold text-slate-800 text-lg">₹{item.price * item.quantity}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2.5 text-slate-300 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50">
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
                    <div className="bg-gradient-to-r from-[#59112e] to-[#7a1b42] px-7 py-5">
                      <h3 className="font-bold text-white text-lg">Order Summary</h3>
                      <p className="text-white/60 text-xs mt-0.5">{totalItems} items in your cart</p>
                    </div>
                    <div className="p-7">
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold text-slate-700">₹{total}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Delivery Fee</span><span className={`font-bold ${deliveryFee === 0 ? "text-emerald-600" : "text-slate-700"}`}>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span></div>
                        {deliveryFee === 0 && <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-2 rounded-xl"><CheckCircle2 size={14} /> Free delivery on orders above ₹2000</div>}
                        <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-center">
                          <span className="font-bold text-slate-800 text-base">Total</span>
                          <span className="text-2xl font-bold text-[#59112e]">₹{grandTotal}</span>
                        </div>
                      </div>
                      <button onClick={() => setStep("address")} disabled={cart.length === 0} className="w-full mt-6 py-4 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#59112e]/20 hover:bg-[#450d24] hover:scale-[1.02] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all flex items-center justify-center gap-2">
                        Proceed to Address <ChevronRight size={16} />
                      </button>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <Shield size={14} className="text-slate-400" />
                        <span className="text-xs text-slate-400 font-medium">Secure checkout</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 2: ADDRESS */}
        {step === "address" && (
          <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setStep("review")} className="p-2.5 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100 hover:shadow-sm"><ChevronLeft size={22} className="text-slate-600" /></button>
              <h2 className="text-2xl font-bold text-slate-800">Delivery Address</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Map Card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-72 bg-slate-100 relative overflow-hidden">
                  <iframe
                    title="Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=73.80%2C18.49%2C73.90%2C18.55&layer=mapnik"
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
                    <div className="w-10 h-10 bg-[#59112e] rounded-full flex items-center justify-center shadow-xl shadow-[#59112e]/40 animate-bounce">
                      <MapPin size={20} className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <button className="w-full py-3.5 bg-[#fdf2f6] text-[#59112e] rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 border border-[#f2d8e4] hover:bg-[#59112e] hover:text-white hover:shadow-lg hover:shadow-[#59112e]/20 transition-all">
                    <LocateFixed size={18} /> Use My Current Location
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2.5">Or fill in the address manually</p>
                </div>
              </div>

              {/* Address Form */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
                <h3 className="font-bold text-slate-800 text-lg mb-5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#fdf2f6] flex items-center justify-center">
                    <MapPin size={16} className="text-[#59112e]" />
                  </div>
                  Add Address
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Full Name</label>
                    <input type="text" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} placeholder="Enter your full name" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:border-[#59112e] focus:bg-white focus:shadow-sm transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Phone Number</label>
                    <input type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="10-digit mobile number" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:border-[#59112e] focus:bg-white focus:shadow-sm transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Address</label>
                    <textarea value={address.addressLine} onChange={(e) => setAddress({ ...address, addressLine: e.target.value })} placeholder="House/Flat No, Building, Street, Area" rows={3} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:border-[#59112e] focus:bg-white focus:shadow-sm transition-all resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">City</label>
                      <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:border-[#59112e] focus:bg-white focus:shadow-sm transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Pincode</label>
                      <input type="text" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} placeholder="6-digit pincode" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:border-[#59112e] focus:bg-white focus:shadow-sm transition-all" />
                    </div>
                  </div>
                </div>
                <button onClick={handleConfirmAddress} className="w-full mt-7 py-4 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#59112e]/20 hover:bg-[#450d24] hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  Confirm Address & Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: PAYMENT */}
        {step === "payment" && (
          <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setStep("address")} className="p-2.5 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100 hover:shadow-sm"><ChevronLeft size={22} className="text-slate-600" /></button>
              <h2 className="text-2xl font-bold text-slate-800">Payment Method</h2>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-3 space-y-4">
                {[
                  { id: "cod", icon: Banknote, label: "Cash on Delivery", desc: "Pay when your order arrives at your doorstep", tag: "No extra charges" },
                  { id: "upi", icon: Smartphone, label: "Pay with UPI", desc: "GPay, PhonePe, Paytm & more", tag: "Instant" },
                  { id: "card", icon: CreditCard, label: "Credit / Debit Card", desc: "Visa, Mastercard, Rupay accepted", tag: "Secure" },
                ].map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full p-6 rounded-2xl border-2 flex items-center gap-5 text-left transition-all ${selectedPayment === method.id
                      ? "border-[#59112e] bg-[#fdf2f6] shadow-lg shadow-[#59112e]/10"
                      : "border-slate-100 bg-white hover:border-[#f2d8e4] hover:shadow-md"
                      }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedPayment === method.id ? "bg-[#59112e] text-white shadow-lg shadow-[#59112e]/20" : "bg-slate-50 text-slate-500"
                      } transition-all`}>
                      <method.icon size={26} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-slate-800 text-base">{method.label}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedPayment === method.id ? "bg-[#59112e]/10 text-[#59112e]" : "bg-slate-100 text-slate-400"}`}>{method.tag}</span>
                      </div>
                      <p className="text-sm text-slate-400">{method.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPayment === method.id ? "border-[#59112e]" : "border-slate-300"
                      }`}>
                      {selectedPayment === method.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full bg-[#59112e]" />}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Payment Summary */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
                  <div className="bg-gradient-to-r from-[#59112e] to-[#7a1b42] px-7 py-5">
                    <h3 className="font-bold text-white text-lg">Payment Summary</h3>
                    <p className="text-white/60 text-xs mt-0.5">Final step</p>
                  </div>
                  <div className="p-7">
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold text-slate-700">₹{total}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Delivery</span><span className={`font-bold ${deliveryFee === 0 ? "text-emerald-600" : "text-slate-700"}`}>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span></div>
                      <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-center">
                        <span className="font-bold text-slate-800 text-base">Total</span>
                        <span className="text-2xl font-bold text-[#59112e]">₹{grandTotal}</span>
                      </div>
                    </div>
                    <button onClick={handlePlaceOrder} disabled={!selectedPayment} className="w-full mt-6 py-4 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#59112e]/20 hover:bg-[#450d24] hover:scale-[1.02] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:hover:scale-100 transition-all">
                      {selectedPayment === "cod" ? "Place Order" : "Pay ₹" + grandTotal}
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Shield size={14} className="text-slate-400" />
                      <span className="text-xs text-slate-400 font-medium">100% Secure Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- ORDERS & TRACKING PAGE ---
const OrdersTrackingPage = ({ orders, onBackToShop }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeliveryQR, setShowDeliveryQR] = useState(false);

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "placed": return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Order Placed", dot: "bg-amber-500" };
      case "packed": return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "Packed", dot: "bg-blue-500" };
      case "out_for_delivery": return { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", label: "Out for Delivery", dot: "bg-violet-500" };
      case "delivered": return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Delivered", dot: "bg-emerald-500" };
      default: return { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", label: "Processing", dot: "bg-slate-400" };
    }
  };

  const getTimeline = (order) => {
    const placedTime = formatTime(order.placedAt);
    const steps = [
      { status: "Order Placed", time: placedTime, completed: true },
      { status: "Packed & Ready", time: "—", completed: ["packed", "out_for_delivery", "delivered"].includes(order.status) },
      { status: "Out for Delivery", time: "—", completed: ["out_for_delivery", "delivered"].includes(order.status) },
      { status: "Delivered", time: "—", completed: order.status === "delivered" },
    ];
    return steps;
  };

  // Detail view for a selected order
  if (selectedOrder) {
    const order = selectedOrder;
    const sc = getStatusColor(order.status);
    const timeline = getTimeline(order);
    const totalItems = order.items.reduce((a, i) => a + i.quantity, 0);

    // Delivery location for RouteMap - simulate near Pune
    const deliveryPoint = {
      id: 1,
      lat: 18.52 + Math.random() * 0.02,
      lng: 73.85 + Math.random() * 0.02,
      address: order.address?.addressLine || "Delivery Address",
      priority: true,
    };
    const driverLoc = { lat: 18.515, lng: 73.845 };

    return (
      <>
        <div className="max-w-6xl mx-auto px-4 md:px-10 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setSelectedOrder(null)} className="p-2.5 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100 hover:shadow-sm">
              <ChevronLeft size={22} className="text-slate-600" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Order #{order.orderNumber}</h2>
              <p className="text-sm text-slate-400">{formatDate(order.placedAt)} at {formatTime(order.placedAt)}</p>
            </div>
            <span className={`ml-auto text-xs font-bold px-3 py-1.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
              {sc.label}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* LEFT: Map + Timeline */}
            <div className="space-y-6">
              {/* Live Map */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-80 relative">
                  <RouteMap
                    driverLocation={driverLoc}
                    deliveryPoints={[deliveryPoint]}
                    showDefaultPanel={false}
                  />
                  {/* Status overlay */}
                  <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50 flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-700">Live Tracking</span>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gradient-to-r from-[#fdf2f6] to-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#59112e] flex items-center justify-center">
                    <Truck size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Delivery Partner on the way</p>
                    <p className="text-xs text-slate-400">Estimated arrival: 15-20 mins</p>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 text-lg mb-5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#fdf2f6] flex items-center justify-center">
                    <Clock size={16} className="text-[#59112e]" />
                  </div>
                  Order Timeline
                </h3>
                <div className="relative pl-5 space-y-6">
                  <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-slate-100"></div>
                  {timeline.map((step, idx) => (
                    <div key={idx} className="relative z-10 flex gap-4 items-start">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${step.completed
                        ? "border-[#59112e] bg-[#59112e]"
                        : "border-slate-200 bg-white"
                        }`}>
                        {step.completed && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <div className="flex-1 pb-1">
                        <p className={`text-sm font-bold ${step.completed ? "text-slate-800" : "text-slate-400"}`}>
                          {step.status}
                        </p>
                        <p className="text-xs text-slate-400">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Show QR Button */}
              <button
                onClick={() => setShowDeliveryQR(true)}
                className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:border-[#f2d8e4] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#59112e] to-[#7a1b42] flex items-center justify-center shadow-lg shadow-[#59112e]/20 group-hover:scale-105 transition-transform">
                  <QrCode size={22} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-slate-800 text-sm">Show Delivery QR</h4>
                  <p className="text-xs text-slate-400">Show this code to your delivery partner</p>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-[#59112e] transition-colors" />
              </button>
            </div>

            {/* RIGHT: Product List + Address + Summary */}
            <div className="space-y-6">
              {/* Products */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#59112e] to-[#7a1b42] px-7 py-5">
                  <h3 className="font-bold text-white text-lg">Order Items</h3>
                  <p className="text-white/60 text-xs mt-0.5">{totalItems} items in this order</p>
                </div>
                <div className="p-6 space-y-4">
                  {order.items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-4 items-center p-4 bg-slate-50 rounded-xl hover:bg-[#fdf2f6] transition-colors"
                    >
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm">{item.image}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-[#59112e]/60 font-bold uppercase tracking-wider mb-0.5">{item.category}</p>
                        <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-bold text-slate-800 text-base shrink-0">₹{item.price * item.quantity}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              {order.address?.addressLine && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-[#59112e]" /> Delivery Address
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-slate-700">{order.address.fullName}</p>
                    <p className="text-sm text-slate-500 mt-1">{order.address.addressLine}</p>
                    <p className="text-sm text-slate-500">{order.address.city} - {order.address.pincode}</p>
                    <p className="text-xs text-slate-400 mt-1">📞 {order.address.phone}</p>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                  <IndianRupee size={16} className="text-[#59112e]" /> Payment Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold text-slate-700">₹{order.subtotal}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Delivery Fee</span><span className={`font-bold ${order.deliveryFee === 0 ? "text-emerald-600" : "text-slate-700"}`}>{order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}</span></div>
                  <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-base">Total</span>
                    <span className="text-xl font-bold text-[#59112e]">₹{order.grandTotal}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                    <span className="capitalize">{order.paymentMethod === "cod" ? "💵 Cash on Delivery" : order.paymentMethod === "upi" ? "📱 Paid via UPI" : "💳 Paid via Card"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Modal Overlay */}
        <AnimatePresence>
          {showDeliveryQR && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-[#2d0b16]/60 backdrop-blur-md"
              onClick={() => setShowDeliveryQR(false)}
            >
              <motion.div
                initial={{ scale: 0.85, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 30 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setShowDeliveryQR(false)}
                  className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/40 text-white z-20 transition-colors"
                >
                  <X size={16} />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-br from-[#59112e] to-[#7a1b42] p-8 text-center pt-10 pb-16 relative overflow-hidden">
                  <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 bg-rose-500/20 rounded-full blur-xl"></div>
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                    <QrCode size={28} className="text-white" />
                  </div>
                  <h2 className="text-white text-xl font-bold relative z-10">Secure Delivery</h2>
                  <p className="text-white/70 text-xs relative z-10 mt-1">Show this code to your delivery partner</p>
                </div>

                {/* QR Code Card */}
                <div className="relative -mt-10 bg-white mx-6 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center">
                  <div className="w-56 h-56 bg-white rounded-xl flex items-center justify-center mb-4 relative overflow-hidden border-2 border-slate-100 shadow-inner">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SWA-ANTARANG-ORDER-${order.orderNumber}-${order.id}`}
                      alt="Delivery QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                  <div className="bg-slate-50 px-4 py-2 rounded-full mb-2">
                    <p className="text-xs text-slate-600 font-bold">Order #{order.orderNumber}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-4">Scan to verify & complete delivery</p>
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <Shield size={12} />
                    <span className="text-[10px] font-bold">Encrypted & Secure</span>
                  </div>
                </div>
                <div className="h-6"></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Order list view
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBackToShop} className="p-2.5 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100 hover:shadow-sm">
          <ChevronLeft size={22} className="text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Orders & Tracking</h2>
          <p className="text-sm text-slate-400">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#fdf2f6] to-[#f2d8e4] flex items-center justify-center">
            <Package size={40} className="text-[#59112e]/40" />
          </div>
          <h3 className="text-xl font-bold text-slate-600 mb-2">No orders yet</h3>
          <p className="text-sm text-slate-400 mb-8 max-w-xs mx-auto">Place your first order and track its delivery right here</p>
          <button onClick={onBackToShop} className="px-8 py-3.5 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#59112e]/20 hover:bg-[#450d24] hover:scale-105 transition-all">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.slice().reverse().map((order, idx) => {
            const sc = getStatusColor(order.status);
            const totalItems = order.items.reduce((a, i) => a + i.quantity, 0);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#f2d8e4] transition-all overflow-hidden group"
              >
                <div className="p-6 flex flex-col md:flex-row md:items-center gap-5">
                  {/* Order Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fdf2f6] to-[#f8e8ef] flex items-center justify-center shrink-0 shadow-sm">
                      <Package size={24} className="text-[#59112e]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 text-base">#{order.orderNumber}</h3>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border} flex items-center gap-1`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                          {sc.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><CalendarDays size={12} /> {formatDate(order.placedAt)}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(order.placedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-medium">Items</p>
                      <p className="font-bold text-slate-700 text-sm">{totalItems}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-medium">Total</p>
                      <p className="font-bold text-[#59112e] text-base">₹{order.grandTotal}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-medium">Payment</p>
                      <p className="font-bold text-slate-700 text-xs uppercase">{order.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Track Button */}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="shrink-0 px-5 py-3 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#59112e]/20 hover:bg-[#450d24] hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Eye size={16} /> Track Order
                  </button>
                </div>

                {/* Item previews strip */}
                <div className="px-6 pb-4">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {order.items.slice(0, 5).map((item) => (
                      <div key={item.id} className="w-10 h-10 bg-[#fdf2f6] rounded-lg flex items-center justify-center text-lg shrink-0 border border-[#f2d8e4]">{item.image}</div>
                    ))}
                    {order.items.length > 5 && (
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">+{order.items.length - 5}</div>
                    )}
                    <span className="text-xs text-slate-400 font-medium ml-2 truncate">
                      {order.items.map(i => i.name).join(", ")}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CustomerApp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentView = searchParams.get("view"); // null | 'cart' | 'tracking'

  const [activeTab, setActiveTab] = useState("home"); // Mobile Tab State: 'home', 'cart', 'tracking'
  const [desktopView, setDesktopView] = useState("cart"); // Desktop Right Panel: 'cart', 'tracking'
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleOrderPlaced = (orderData) => {
    setOrders((prev) => [...prev, orderData]);
    setCart([]); // Clear cart after order is placed
  };

  // Responsive: If on mobile and switching tabs, sync logic
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "cart") setDesktopView("cart");
    if (tab === "tracking") setDesktopView("tracking");
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const incrementItem = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementItem = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === productId);
      if (item && item.quantity <= 1) {
        return prevCart.filter((i) => i.id !== productId);
      }
      return prevCart.map((i) =>
        i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const placeOrder = () => {
    navigate("/customer/CustomerApp?view=cart");
  };

  const goBackToShop = () => {
    navigate("/customer/CustomerApp");
  };

  // If view=cart, render the full My Cart checkout page
  if (currentView === "cart") {
    return (
      <div className="min-h-screen bg-[#f8f9fa] font-outfit">
        <MyCartPage
          cart={cart}
          removeFromCart={removeFromCart}
          incrementItem={incrementItem}
          decrementItem={decrementItem}
          onBackToShop={goBackToShop}
          onPlaceOrder={handleOrderPlaced}
        />
      </div>
    );
  }

  // If view=tracking, render the Orders & Tracking page
  if (currentView === "tracking") {
    return (
      <div className="min-h-screen bg-[#f8f9fa] font-outfit">
        <OrdersTrackingPage
          orders={orders}
          onBackToShop={goBackToShop}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-outfit flex flex-col">

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col md:flex-row relative">
        {/* PRODUCT GRID (Scrollable Center) */}
        <div
          className={`flex-1 p-6 md:p-10 ${activeTab !== "home" ? "hidden md:block" : "block"}`}
        >
          {/* Mobile Header */}
          <div className="md:hidden flex justify-between items-center mb-6 bg-[#f8f9fa] py-2">
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



          {/* Search & Filter */}
          <div className="flex gap-4 mb-8 bg-[#f8f9fa] pb-2">
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
              md:w-[400px] bg-white border-l border-slate-100 md:sticky md:top-20 md:h-[calc(100vh-5rem)] z-30
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
            incrementItem={incrementItem}
            decrementItem={decrementItem}
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
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
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
