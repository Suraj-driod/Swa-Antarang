import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  MapPin,
  Clock,
  Navigation,
  MessageSquare,
  Phone,
  CheckCircle2,
  Send,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

import ChatWidget from "./components/ChatWidget";
import { useAuth } from '../../app/providers/AuthContext';
import { getAssignedDeliveries, markPickedUp, markInTransit } from '../../services/deliveryService';
import { getOpenOndcRequests, acceptOndcRequest } from '../../services/logisticsService';

// --- Negotiation Panel ---
const NegotiationPanel = ({ basePrice, onCancel, onSubmit }) => {
  const [askPrice, setAskPrice] = useState(basePrice);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-[#fdf2f6] border-t border-[#f2d8e4] overflow-hidden"
    >
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-[#59112e] uppercase tracking-wider">
            Counter Offer
          </span>
          <span className="text-sm text-slate-500 font-medium">
            Base: ₹{basePrice}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setAskPrice((prev) => Math.max(basePrice, prev - 10))}
            className="w-10 h-10 rounded-xl bg-white border border-[#f2d8e4] text-[#59112e] font-bold shadow-sm hover:bg-rose-50 flex items-center justify-center text-lg"
          >
            −
          </button>

          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#59112e] font-bold text-base">
              ₹
            </div>
            <input
              type="number"
              value={askPrice}
              onChange={(e) => setAskPrice(Number(e.target.value))}
              className="w-full h-10 pl-8 pr-3 rounded-xl border border-[#f2d8e4] text-center font-bold text-slate-800 text-base outline-none focus:border-[#59112e] focus:ring-1 focus:ring-[#59112e]/20"
            />
          </div>

          <button
            onClick={() => setAskPrice((prev) => prev + 10)}
            className="w-10 h-10 rounded-xl bg-white border border-[#f2d8e4] text-[#59112e] font-bold shadow-sm hover:bg-rose-50 flex items-center justify-center text-lg"
          >
            +
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-[#f2d8e4] text-slate-500 font-bold text-sm hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(askPrice)}
            className="flex-1 py-2.5 rounded-xl bg-[#59112e] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:bg-[#450d24] transition-colors"
          >
            Send <Send size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const DeliveryOrders = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("requests");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeOrders, setActiveOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContact, setChatContact] = useState(null);

  // Fetch assigned deliveries + ONDC open requests
  useEffect(() => {
    if (!user?.driverProfileId) return;
    getAssignedDeliveries(user.driverProfileId).then(data => {
      setActiveOrders(data.map(d => ({
        id: d.id,
        orderId: d.order_id,
        shop: d.orders?.merchant_profiles?.business_name || 'Merchant',
        customer: d.orders?.shipping_address?.fullName || 'Customer',
        address: d.orders?.shipping_address?.addressLine || '-',
        status: d.status === 'pending' ? 'Pickup Pending' : d.status === 'picked_up' ? 'Picked Up' : 'In Transit',
        price: `₹${Number(d.orders?.total_amount || 0).toFixed(0)}`,
        distance: '-',
        time: '-',
        items: d.orders?.order_items?.map(i => i.product_name).join(', ') || '-',
        contactName: d.orders?.shipping_address?.fullName || '-',
      })));
    }).catch(console.error);

    getOpenOndcRequests().then(data => {
      setRequests(data.map(r => ({
        id: r.id,
        shop: r.orders?.merchant_profiles?.business_name || 'Merchant',
        address: r.orders?.merchant_profiles?.address || '-',
        offer: Number(r.cost_slab || 0),
        distance: 0,
        tags: ['ONDC'],
        negotiating: false,
        contactName: '-',
      })));
    }).catch(console.error);
  }, [user?.driverProfileId]);

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

  const getFilteredRequests = () => {
    let data = [...requests];
    if (activeFilter === "High Pay") data.sort((a, b) => b.offer - a.offer);
    if (activeFilter === "Shortest") data.sort((a, b) => a.distance - b.distance);
    return data;
  };

  const openChat = (order) => {
    setChatContact({
      name: order.contactName || order.shop,
      shop: order.shop,
      avatar: (order.contactName || order.shop).charAt(0),
      orderId: order.id,
      pay: order.price || `₹${order.offer}`,
    });
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-outfit">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8">

        {/* --- HEADER --- */}
        <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-slate-100 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Orders
              </h1>
              <p className="text-sm md:text-base text-slate-500 font-medium mt-1">
                Manage deliveries & incoming offers
              </p>
            </div>
            <button className="w-11 h-11 bg-[#fdf2f6] rounded-xl flex items-center justify-center text-[#59112e] shadow-sm border border-[#f2d8e4] hover:bg-[#59112e] hover:text-white transition-colors">
              <SlidersHorizontal size={20} />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1.5 bg-slate-50 rounded-xl border border-slate-100 relative mb-5">
            <motion.div
              layout
              className="absolute top-1.5 bottom-1.5 bg-white rounded-lg shadow-sm border border-slate-200 z-0"
              initial={false}
              animate={{
                left: activeTab === "active" ? "6px" : "50%",
                width: "calc(50% - 6px)",
              }}
            />
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors ${activeTab === "active" ? "text-[#59112e]" : "text-slate-400"
                }`}
            >
              My Tasks ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors ${activeTab === "requests" ? "text-[#59112e]" : "text-slate-400"
                }`}
            >
              New Requests ({REQUESTS.length})
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {["All", "High Pay", "Shortest", "Urgent"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${activeFilter === filter
                    ? "bg-[#59112e] text-white border-[#59112e] shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-[#59112e] hover:text-[#59112e]"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <AnimatePresence mode="wait">
          {/* TAB 1: ACTIVE ORDERS */}
          {activeTab === "active" && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.1)] transition-shadow"
                >
                  {/* Vertical Status Line */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#59112e]"></div>

                  <div className="flex justify-between items-start mb-4 pl-4">
                    <span className="bg-[#fdf2f6] text-[#59112e] text-xs font-bold px-3 py-1 rounded-lg border border-[#f2d8e4]">
                      {order.status}
                    </span>
                    <span className="text-slate-400 text-sm font-bold flex items-center gap-1.5">
                      <Clock size={14} /> {order.time}
                    </span>
                  </div>

                  <div className="pl-4 mb-5">
                    <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">
                      {order.shop}
                    </h3>
                    <div className="flex items-start gap-2 text-sm text-slate-500">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                      <p className="leading-snug">{order.address}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pl-4 mb-5">
                    <span className="text-2xl font-bold text-[#59112e]">{order.price}</span>
                    <span className="text-sm text-slate-400 ml-2 font-medium">{order.distance}</span>
                  </div>

                  <div className="flex gap-2 pl-4">
                    <button
                      onClick={() => { }}
                      className="flex-1 py-3 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:bg-[#450d24] transition-colors"
                    >
                      <Navigation size={16} /> Navigate
                    </button>
                    <button
                      onClick={() => alert(`Calling ${order.contactName}...`)}
                      className="w-11 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center border border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                    >
                      <Phone size={18} />
                    </button>
                    <button
                      onClick={() => openChat(order)}
                      className="w-11 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center border border-slate-100 hover:bg-[#fdf2f6] hover:text-[#59112e] hover:border-[#f2d8e4] transition-colors"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 2: REQUESTS */}
          {activeTab === "requests" && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {getFilteredRequests().map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] overflow-hidden transition-all hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.1)] flex flex-col"
                >
                  <div className="p-5 lg:p-6 flex-1 flex flex-col">
                    {/* Tags & Price */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2 flex-wrap">
                        {req.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border border-slate-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase">Offer</p>
                        <p className="text-2xl font-bold text-[#59112e]">₹{req.offer}</p>
                      </div>
                    </div>

                    {/* Shop Info */}
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{req.shop}</h3>

                    {/* Address */}
                    <div className="flex items-start gap-2.5 text-sm text-slate-500 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-[#59112e]" />
                      <p className="leading-snug font-medium">{req.address}</p>
                    </div>

                    {/* Route Stats */}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-500">
                      <span>{req.distance} km</span>
                      <span className="text-[#59112e]">
                        ₹{Math.round(req.offer / req.distance)}/km
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {!req.negotiating ? (
                    <div className="p-4 pt-0 flex gap-2">
                      <button
                        onClick={() => alert(`Calling ${req.contactName}...`)}
                        className="w-11 py-3 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
                      >
                        <Phone size={18} />
                      </button>
                      <button
                        onClick={() => openChat(req)}
                        className="w-11 py-3 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 hover:text-[#59112e] hover:border-[#f2d8e4] hover:bg-[#fdf2f6] transition-colors"
                      >
                        <MessageSquare size={18} />
                      </button>
                      <button
                        onClick={() => toggleNegotiation(req.id)}
                        className="flex-1 py-3 rounded-xl font-bold text-sm border border-slate-200 text-slate-500 hover:text-[#59112e] hover:border-[#59112e] transition-colors"
                      >
                        Negotiate
                      </button>
                      <button className="flex-[1.5] py-3 bg-[#59112e] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#450d24] transition-colors">
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

      {/* Chat Widget */}
      <ChatWidget
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        contact={chatContact}
      />
    </div>
  );
};

export default DeliveryOrders;