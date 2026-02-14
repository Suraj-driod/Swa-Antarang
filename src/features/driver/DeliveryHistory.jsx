import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Bike,
  ArrowRight,
  Navigation,
} from "lucide-react";

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
    timeline: {
      received: "09:15 AM",
      started: "09:20 AM",
      delivered: null, // Cancelled
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
    timeline: {
      received: "02:00 PM",
      started: "02:05 PM",
      delivered: "02:25 PM",
    },
  },
];

const DeliveryHistory = () => {
  const [filter, setFilter] = useState("All"); // 'All', 'Delivered', 'Cancelled'

  const filteredData = HISTORY_DATA.filter((item) => {
    if (filter === "All") return true;
    return item.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-outfit pb-24">
      {/* --- HEADER & SUMMARY --- */}
      <div className="bg-white p-8 pb-8 rounded-b-[40px] shadow-sm mb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Trip History
          </h1>
          <button className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center text-slate-500 hover:text-[#59112e] hover:bg-[#fdf2f6] transition-colors shadow-sm">
            <Calendar size={24} />
          </button>
        </div>

        {/* Earnings Summary Card */}
        <div className="bg-gradient-to-r from-[#59112e] to-[#9d174d] rounded-[32px] p-8 text-white shadow-xl shadow-[#59112e]/20 relative overflow-hidden">
          {/* Decorative Blur */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12"></div>

          <div className="relative z-10 flex justify-between items-end">
            <div>
              <p className="text-white/80 text-sm font-semibold mb-1">
                Total Earnings (Feb)
              </p>
              <h2 className="text-4xl font-bold tracking-tight">₹12,450</h2>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm font-semibold mb-1">
                Total Trips
              </p>
              <h2 className="text-2xl font-bold">142</h2>
            </div>
          </div>
        </div>
      </div>

      {/* --- FILTER TABS --- */}
      <div className="px-6 mb-8 overflow-x-auto no-scrollbar">
        <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-fit">
          {["All", "Delivered", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                filter === tab
                  ? "bg-[#59112e] text-white shadow-md"
                  : "text-slate-500 hover:text-[#59112e] hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- HISTORY GRID (Responsive Cards) --- */}
      <div className="px-6">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredData.map((order) => (
              <motion.div
                layout
                key={order.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow"
              >
                {/* Status Badge & Date */}
                <div className="flex justify-between items-center mb-5">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                      order.status === "Delivered"
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
                  <span className="text-xs text-slate-500 font-bold">
                    {order.date}
                  </span>
                </div>

                {/* Shop & Amount */}
                <div className="flex justify-between items-start mb-4">
                  <div className="pr-4">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Pickup From
                    </p>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">
                      {order.shop}
                    </h3>
                  </div>
                  <span
                    className={`text-xl font-bold ${order.status === "Cancelled" ? "text-slate-300 line-through" : "text-[#59112e]"}`}
                  >
                    {order.amount}
                  </span>
                </div>

                {/* Delivery Address */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 flex gap-3 items-start">
                  <div className="mt-1 text-slate-400">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Delivered To
                    </p>
                    <p className="text-sm text-slate-700 font-semibold leading-snug">
                      {order.address}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative pl-4 space-y-4 mb-6">
                  {/* Vertical Line */}
                  <div className="absolute left-[7px] top-2 bottom-4 w-[2px] bg-slate-200"></div>

                  {/* Received */}
                  <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white"></div>
                      <span className="text-xs font-medium text-slate-500">
                        Received
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-600">
                      {order.timeline.received}
                    </span>
                  </div>

                  {/* Started */}
                  <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400 ring-4 ring-white"></div>
                      <span className="text-xs font-medium text-slate-500">
                        Started
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-600">
                      {order.timeline.started}
                    </span>
                  </div>

                  {/* Delivered */}
                  <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ring-4 ring-white ${
                          order.status === "Delivered"
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        }`}
                      ></div>
                      <span
                        className={`text-xs font-bold ${
                          order.status === "Delivered"
                            ? "text-emerald-700"
                            : "text-rose-600"
                        }`}
                      >
                        {order.status === "Delivered"
                          ? "Delivered"
                          : "Cancelled"}
                      </span>
                    </div>
                    {order.timeline.delivered && (
                      <span className="text-xs font-bold text-slate-900">
                        {order.timeline.delivered}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: Distance */}
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Navigation size={14} /> Total Distance
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {order.distance}
                  </span>
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
            <h3 className="text-lg font-bold text-slate-700">No trips found</h3>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Try changing the filter to see more.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
