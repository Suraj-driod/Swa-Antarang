import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Navigation,
  Phone,
  MessageSquare,
} from "lucide-react";

import ChatWidget from "./components/ChatWidget";

// --- MOCK DATA ---

const HISTORY_DATA = [
  {
    id: "ORD-9921",
    date: "Today, Feb 14",
    shop: "Acme Supplies Hub",
    address: "Unit 402, Urban Tech Park, Hinjewadi Phase 1",
    amount: "₹120.50",
    distance: "4.2 km",
    status: "Delivered",
    contactName: "Rajesh Kumar",
    timeline: {
      received: "10:30 AM",
      started: "10:35 AM",
      delivered: "10:58 AM",
    },
  },
  {
    id: "ORD-9920",
    date: "Today, Feb 14",
    shop: "Fresh Foods Market",
    address: "Flat 12, Green Valley Apts, Baner",
    amount: "₹0.00",
    distance: "1.2 km",
    status: "Cancelled",
    reason: "Customer unreachable",
    contactName: "Sarah Jenkins",
    timeline: {
      received: "09:15 AM",
      started: "09:20 AM",
      delivered: null,
    },
  },
  {
    id: "ORD-9918",
    date: "Yesterday, Feb 13",
    shop: "Tech World",
    address: "Shop 5, Phoenix Mall, Viman Nagar",
    amount: "₹85.00",
    distance: "3.5 km",
    status: "Delivered",
    contactName: "Amit Patel",
    timeline: {
      received: "04:00 PM",
      started: "04:10 PM",
      delivered: "04:45 PM",
    },
  },
  {
    id: "ORD-9915",
    date: "Yesterday, Feb 13",
    shop: "City Library",
    address: "Central Campus, Pune University",
    amount: "₹45.00",
    distance: "2.1 km",
    status: "Delivered",
    contactName: "Priya Sharma",
    timeline: {
      received: "02:00 PM",
      started: "02:05 PM",
      delivered: "02:25 PM",
    },
  },
];

const DeliveryHistory = () => {
  const [filter, setFilter] = useState("All");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContact, setChatContact] = useState(null);

  const filteredData = HISTORY_DATA.filter((item) => {
    if (filter === "All") return true;
    return item.status === filter;
  });

  const openChat = (order) => {
    setChatContact({
      name: order.contactName || order.shop,
      shop: order.shop,
      avatar: (order.contactName || order.shop).charAt(0),
      orderId: order.id,
      pay: order.amount,
    });
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-outfit">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8">

        {/* --- HEADER & SUMMARY --- */}
        <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-slate-100 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              Trip History
            </h1>
            <button className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center text-slate-500 hover:text-[#59112e] hover:bg-[#fdf2f6] transition-colors shadow-sm">
              <Calendar size={24} />
            </button>
          </div>

          {/* Earnings Summary Card */}
          <div className="bg-gradient-to-r from-[#59112e] to-[#9d174d] rounded-2xl p-6 lg:p-8 text-white shadow-xl shadow-[#59112e]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12"></div>

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <p className="text-white/80 text-sm font-semibold mb-1">
                  Total Earnings (Feb)
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">₹12,450</h2>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-white/80 text-sm font-semibold mb-1">
                  Total Trips
                </p>
                <h2 className="text-2xl lg:text-3xl font-bold">142</h2>
              </div>
            </div>
          </div>
        </div>

        {/* --- FILTER TABS --- */}
        <div className="mb-8">
          <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-fit">
            {["All", "Delivered", "Cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${filter === tab
                    ? "bg-[#59112e] text-white shadow-md"
                    : "text-slate-500 hover:text-[#59112e] hover:bg-slate-50"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- HISTORY GRID --- */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredData.map((order) => (
              <motion.div
                layout
                key={order.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] relative group hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.1)] transition-shadow"
              >
                {/* Status Badge & Date */}
                <div className="flex justify-between items-center mb-5">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${order.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}
                  >
                    {order.status === "Delivered" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    {order.status}
                  </span>
                  <span className="text-sm text-slate-500 font-bold">
                    {order.date}
                  </span>
                </div>

                {/* Shop & Amount */}
                <div className="flex justify-between items-start mb-4">
                  <div className="pr-4">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Pickup From
                    </p>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">
                      {order.shop}
                    </h3>
                  </div>
                  <span
                    className={`text-2xl font-bold ${order.status === "Cancelled" ? "text-slate-300 line-through" : "text-[#59112e]"
                      }`}
                  >
                    {order.amount}
                  </span>
                </div>

                {/* Delivery Address */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5 flex gap-3 items-start">
                  <div className="mt-0.5 text-slate-400">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Delivered To
                    </p>
                    <p className="text-sm text-slate-700 font-semibold leading-snug">
                      {order.address}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative pl-4 space-y-4 mb-5">
                  <div className="absolute left-[7px] top-2 bottom-4 w-[2px] bg-slate-200"></div>

                  <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white"></div>
                      <span className="text-sm font-medium text-slate-500">Received</span>
                    </div>
                    <span className="text-sm font-bold text-slate-600">{order.timeline.received}</span>
                  </div>

                  <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400 ring-4 ring-white"></div>
                      <span className="text-sm font-medium text-slate-500">Started</span>
                    </div>
                    <span className="text-sm font-bold text-slate-600">{order.timeline.started}</span>
                  </div>

                  <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ring-4 ring-white ${order.status === "Delivered" ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                      ></div>
                      <span
                        className={`text-sm font-bold ${order.status === "Delivered" ? "text-emerald-700" : "text-rose-600"
                          }`}
                      >
                        {order.status === "Delivered" ? "Delivered" : "Cancelled"}
                      </span>
                    </div>
                    {order.timeline.delivered && (
                      <span className="text-sm font-bold text-slate-900">
                        {order.timeline.delivered}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: Distance + Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Navigation size={14} /> {order.distance}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Calling ${order.contactName}...`)}
                      className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
                      title="Call"
                    >
                      <Phone size={16} />
                    </button>
                    <button
                      onClick={() => openChat(order)}
                      className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#59112e] hover:border-[#f2d8e4] hover:bg-[#fdf2f6] transition-all"
                      title="Chat"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <History size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No trips found</h3>
            <p className="text-slate-400 text-base font-medium mt-1">
              Try changing the filter to see more.
            </p>
          </div>
        )}
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

export default DeliveryHistory;
