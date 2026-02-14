import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ label, current, target, unit = '₹', color = 'bg-[#59112e]' }) => {
    const percentage = Math.min((current / target) * 100, 100);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 lg:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
            <div className="flex justify-between items-end mb-3">
                <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                    <p className="text-lg lg:text-xl font-bold text-slate-800 mt-0.5">
                        {unit}{current.toLocaleString()} <span className="text-sm font-medium text-slate-400">/ {unit}{target.toLocaleString()}</span>
                    </p>
                </div>
                <span className={`text-sm font-bold ${percentage >= 80 ? 'text-emerald-600' : 'text-[#59112e]'}`}>
                    {Math.round(percentage)}%
                </span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
