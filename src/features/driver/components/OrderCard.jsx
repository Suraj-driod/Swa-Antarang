import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Navigation, MapPin, ArrowRight, Phone, MessageSquare } from 'lucide-react';

const OrderCard = ({ order, variant = 'priority', onAccept, onViewRoute, onChat, onCall }) => {
    const isPriority = variant === 'priority';

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.1)] transition-all group overflow-hidden"
        >
            {/* Top accent */}
            {isPriority && (
                <div className="h-1 bg-gradient-to-r from-[#59112e] to-[#9d174d]" />
            )}

            <div className="p-5 lg:p-6">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isPriority
                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                            {isPriority ? '🔥 URGENT' : 'STANDARD'}
                        </span>
                        {order.tag && (
                            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                                {order.tag}
                            </span>
                        )}
                    </div>
                    <span className="text-xl lg:text-2xl font-bold text-[#59112e]">{order.pay}</span>
                </div>

                {/* Shop & Customer */}
                <div className="mb-4">
                    <h3 className="text-base lg:text-lg font-bold text-slate-800 mb-1">{order.shop}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span>{order.customer}</span>
                    </div>
                </div>

                {/* Items */}
                <div className="text-sm text-slate-500 mb-4">
                    <span className="font-medium">{order.items}</span>
                </div>

                {/* Footer Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                            <Clock size={14} className={isPriority ? 'text-rose-500' : 'text-slate-400'} />
                            {order.time || order.window}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Navigation size={14} className="text-slate-400" />
                            {order.distance}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Call Button */}
                        {onCall && (
                            <button
                                onClick={onCall}
                                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
                                title="Call"
                            >
                                <Phone size={16} />
                            </button>
                        )}

                        {/* Chat Button */}
                        {onChat && (
                            <button
                                onClick={onChat}
                                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#59112e] hover:border-[#f2d8e4] hover:bg-[#fdf2f6] transition-all"
                                title="Chat"
                            >
                                <MessageSquare size={16} />
                            </button>
                        )}

                        {/* View Route */}
                        {onViewRoute && (
                            <button
                                onClick={onViewRoute}
                                className="text-sm font-semibold text-[#59112e] hover:text-[#450d24] px-3 py-2 rounded-lg hover:bg-[#fdf2f6] transition-colors hidden sm:block"
                            >
                                View Route
                            </button>
                        )}

                        {/* Accept */}
                        <button
                            onClick={onAccept}
                            className="text-sm font-bold text-white bg-[#59112e] hover:bg-[#450d24] px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                        >
                            Accept <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderCard;
