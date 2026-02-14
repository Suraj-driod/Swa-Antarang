import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  MapPin,
  Clock,
  Navigation,
  MessageSquare,
  Phone,
  CheckCircle2,
  X,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Filter,
  Send,
  ChevronDown,
  Box,
  SlidersHorizontal,
  ArrowUp,
} from "lucide-react";

// --- MOCK DATA ---

const ACTIVE_ORDERS = [
  {
    id: "ORD-101",
    shop: "Acme Supplies Hub",
    customer: "Urban Tech Park",
    address: "Unit 402, IT Park, Hinjewadi",
    status: "Pickup Pending",
    price: "₹120",
    distance: "4.2 km",
    time: "Due in 20m",
    items: "Electronics",
  },
  {
    id: "ORD-102",
    shop: "Fresh Foods Market",
    customer: "Green Valley Apts",
    address: "Building C, Flat 401, Baner",
    status: "In Transit",
    price: "₹85",
    distance: "1.5 km",
    time: "Due in 10m",
    items: "Groceries",
  },
];

const REQUESTS = [
  {
    id: "REQ-201",
    shop: "Tech World",
    address: "Shop 12, Phoenix Mall, Viman Nagar",
    offer: 140,
    distance: 5.5,
    tags: ["Bulk", "Heavy"],
    negotiating: false,
  },
  {
    id: "REQ-202",
    shop: "City Library",
    address: "Main Campus, Pune University",
    offer: 60,
    distance: 2.1,
    tags: ["Documents"],
    negotiating: false,
  },
  {
    id: "REQ-203",
    shop: "Hardware Depot",
    address: "Plot 44, Industrial Zone, Chakan",
    offer: 250,
    distance: 12.0,
    tags: ["Heavy", "Urgent"],
    negotiating: false,
  },
  {
    id: "REQ-204",
    shop: "Flower Boutique",
    address: "Rose Villa, Koregaon Park",
    offer: 90,
    distance: 3.2,
    tags: ["Fragile"],
    negotiating: false,
  },
];

// --- COMPONENTS ---

// 1. Negotiation Panel
const NegotiationPanel = ({ basePrice, onCancel, onSubmit }) => {
  const [askPrice, setAskPrice] = useState(basePrice);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-[#fdf2f6] border-t border-[#f2d8e4] overflow-hidden"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-[#59112e] uppercase tracking-wider">
            Counter Offer
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            Base: ₹{basePrice}
          </span>
        </div>

        {/* Price Input Area */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() =>
              setAskPrice((prev) => Math.max(basePrice, prev - 10))
            }
            className="w-8 h-8 rounded-lg bg-white border border-[#f2d8e4] text-[#59112e] font-bold shadow-sm hover:bg-rose-50 flex items-center justify-center"
          >
            -
          </button>

          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#59112e] font-bold text-sm">
              ₹
            </div>
            <input
              type="number"
              value={askPrice}
              onChange={(e) => setAskPrice(Number(e.target.value))}
              className="w-full h-8 pl-6 pr-2 rounded-lg border border-[#f2d8e4] text-center font-bold text-slate-800 text-sm outline-none focus:border-[#59112e]"
            />
          </div>

          <button
            onClick={() => setAskPrice((prev) => prev + 10)}
            className="w-8 h-8 rounded-lg bg-white border border-[#f2d8e4] text-[#59112e] font-bold shadow-sm hover:bg-rose-50 flex items-center justify-center"
          >
            +
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-[#f2d8e4] text-slate-500 font-bold text-xs hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(askPrice)}
            className="flex-1 py-2 rounded-lg bg-[#59112e] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1"
          >
            Send <Send size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const DeliveryOrders = () => {
  const [activeTab, setActiveTab] = useState("requests"); // 'active', 'requests'
  const [activeFilter, setActiveFilter] = useState("All");
  const [requests, setRequests] = useState(REQUESTS);

  const toggleNegotiation = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, negotiating: !req.negotiating } : req,
      ),
    );
  };

  const submitOffer = (id, amount) => {
    alert(`Offer of ₹${amount} sent for Order ${id}`);
    toggleNegotiation(id);
  };

  // Basic Filter Logic
  const getFilteredRequests = () => {
    let data = [...requests];
    if (activeFilter === "High Pay") data.sort((a, b) => b.offer - a.offer);
    if (activeFilter === "Shortest")
      data.sort((a, b) => a.distance - b.distance);
    // Add more logic as needed
    return data;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-outfit pb-24">
      {/* --- HEADER --- */}
      <div className="bg-white p-6 rounded-b-[32px] shadow-sm mb-6 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Orders
            </h1>
            <p className="text-slate-500 font-medium text-xs mt-0.5">
              Manage deliveries & offers
            </p>
          </div>
          <button className="w-10 h-10 bg-[#fdf2f6] rounded-xl flex items-center justify-center text-[#59112e] shadow-sm border border-[#f2d8e4]">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100 relative mb-4">
          <motion.div
            layout
            className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm border border-slate-200 z-0"
            initial={false}
            animate={{
              left: activeTab === "active" ? "4px" : "50%",
              width: "calc(50% - 4px)",
            }}
          />
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2 text-xs font-bold relative z-10 transition-colors ${activeTab === "active" ? "text-[#59112e]" : "text-slate-400"}`}
          >
            My Tasks (2)
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2 text-xs font-bold relative z-10 transition-colors ${activeTab === "requests" ? "text-[#59112e]" : "text-slate-400"}`}
          >
            New Requests (4)
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {["All", "High Pay", "Shortest", "Urgent"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
                activeFilter === filter
                  ? "bg-[#59112e] text-white border-[#59112e]"
                  : "bg-white text-slate-500 border-slate-200 hover:border-[#59112e] hover:text-[#59112e]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTENT AREA (RESPONSIVE GRID) --- */}
      <div className="px-6 pb-12">
        <AnimatePresence mode="wait">
          {/* TAB 1: ACTIVE ORDERS */}
          {activeTab === "active" && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {ACTIVE_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
                >
                  {/* Vertical Status Line */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#59112e]"></div>

                  <div className="flex justify-between items-start mb-3 pl-3">
                    <span className="bg-[#fdf2f6] text-[#59112e] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#f2d8e4]">
                      {order.status}
                    </span>
                    <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                      <Clock size={10} /> {order.time}
                    </span>
                  </div>

                  <div className="pl-3 mb-4">
                    <h3 className="text-sm font-bold text-slate-800 leading-tight mb-1">
                      {order.shop}
                    </h3>
                    <div className="flex items-start gap-2 text-xs text-slate-500">
                      <MapPin size={12} className="mt-0.5 shrink-0" />
                      <p className="leading-snug">{order.address}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pl-3 mt-auto">
                    <button className="flex-1 py-2.5 bg-[#59112e] text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 hover:bg-[#450d24]">
                      <Navigation size={14} /> Navigate
                    </button>
                    <button className="w-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center border border-slate-100 hover:bg-slate-100">
                      <Phone size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 2: REQUESTS (GRID LAYOUT) */}
          {activeTab === "requests" && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {getFilteredRequests().map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md flex flex-col"
                >
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Tags & Price */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {req.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          Offer
                        </p>
                        <p className="text-xl font-bold text-[#59112e]">
                          ₹{req.offer}
                        </p>
                      </div>
                    </div>

                    {/* Shop Info */}
                    <h3 className="text-base font-bold text-slate-800 mb-2">
                      {req.shop}
                    </h3>

                    {/* Address */}
                    <div className="flex items-start gap-2 text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <MapPin
                        size={14}
                        className="mt-0.5 shrink-0 text-[#59112e]"
                      />
                      <p className="leading-snug font-medium">{req.address}</p>
                    </div>

                    {/* Route Stats */}
                    <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>{req.distance} km</span>
                      <span className="text-[#59112e]">
                        ₹{Math.round(req.offer / req.distance)}/km
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {!req.negotiating ? (
                    <div className="p-3 pt-0 flex gap-2">
                      <button
                        onClick={() => toggleNegotiation(req.id)}
                        className="flex-1 py-2.5 rounded-xl font-bold text-xs border border-slate-200 text-slate-500 hover:text-[#59112e] hover:border-[#59112e] transition-colors"
                      >
                        Negotiate
                      </button>
                      <button className="flex-[1.5] py-2.5 bg-[#59112e] text-white rounded-xl font-bold text-xs shadow-md hover:bg-[#450d24] transition-colors">
                        Accept
                      </button>
                    </div>
                  ) : (
                    <NegotiationPanel
                      basePrice={req.offer}
                      onCancel={() => toggleNegotiation(req.id)}
                      onSubmit={(amount) => submitOffer(req.id, amount)}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeliveryOrders;
  