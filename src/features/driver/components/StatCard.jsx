import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, color = 'text-[#59112e]', bg = 'bg-[#fdf2f6]', subtitle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-5 lg:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.1)] transition-shadow group"
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${bg} ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon size={22} />
                </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
            {subtitle && (
                <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
            )}
        </motion.div>
    );
};

export default StatCard;
