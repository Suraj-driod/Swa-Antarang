import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  LogOut,
  Bell
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';

const Navbar = ({ items = [], brandTitle = 'Swa-Antarang', brandSub = 'Platform' }) => {
  const [hoveredTab, setHoveredTab] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Build full current URL string (pathname + search) for comparison
  const currentFullPath = location.pathname + location.search;

  const handleLogout = () => {
    logout();
    navigate('/ui/Login', { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 pointer-events-none bg-gradient-to-b from-gray-50 via-gray-50/95 to-gray-50/0">

      {/* --- LEFT: BRAND ISLAND --- */}
      <div className="pointer-events-auto">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-[#fbcfe8] px-4 py-2.5 rounded-full shadow-[0_4px_20px_-4px_rgba(89,17,46,0.08)] ring-1 ring-white/50 group cursor-pointer transition-all hover:scale-[1.02]">
          <div className="relative">
            <div className="absolute inset-0 bg-[#59112e] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#59112e] to-[#9d174d] flex items-center justify-center text-white shadow-md relative z-10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
          </div>
          <div className="pr-1">
            <h1 className="text-sm font-bold text-[#2d0b16] leading-none tracking-tight">{brandTitle}</h1>
            <p className="text-[10px] text-[#9d174d] font-medium tracking-wide opacity-80">{brandSub}</p>
          </div>
        </div>
      </div>

      {/* --- CENTER: NAVIGATION CAPSULE --- */}
      <nav className="pointer-events-auto hidden md:block">
        <div className="flex items-center gap-1 p-1.5 bg-white/70 backdrop-blur-2xl border border-[#f2d8e4] rounded-full shadow-[0_8px_32px_-8px_rgba(89,17,46,0.1)] ring-1 ring-white/60">
          {items.map((item) => {
            const isActive = currentFullPath === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onMouseEnter={() => setHoveredTab(item.to)}
                onMouseLeave={() => setHoveredTab(null)}
                className="relative px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all duration-300"
              >
                {/* Active Pill (Burgundy) */}
                {isActive && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 bg-[#59112e] rounded-full shadow-lg shadow-[#59112e]/20"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}

                {/* Hover Pill (Soft Pink) */}
                <AnimatePresence>
                  {hoveredTab === item.to && !isActive && (
                    <motion.div
                      layoutId="hoverPill"
                      className="absolute inset-0 bg-[#fdf2f6] border border-[#fbcfe8] rounded-full -z-10"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={`relative z-10 ${isActive ? 'text-white' : 'text-[#6b4c59] hover:text-[#59112e]'}`} />
                <span className={`relative z-10 ${isActive ? 'text-white' : 'text-[#6b4c59] hover:text-[#59112e]'}`}>{item.label}</span>

                {/* Notification Badge */}
                {item.badge && !isActive && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white relative z-10"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* --- MOBILE: BOTTOM NAVIGATION --- */}
      <nav className="pointer-events-auto fixed bottom-0 left-0 right-0 md:hidden bg-white/80 backdrop-blur-xl border-t border-[#f2d8e4] shadow-[0_-4px_20px_-4px_rgba(89,17,46,0.06)] z-50">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {items.map((item) => {
            const isActive = currentFullPath === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]"
              >
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#59112e]/10' : ''}`}>
                  <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} className={isActive ? 'text-[#59112e]' : 'text-gray-400'} />
                </div>
                <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-[#59112e]' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* --- RIGHT: ACTION CLUSTER --- */}
      <div className="pointer-events-auto flex items-center gap-3">

        {/* Notifications */}
        <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl border border-[#f2d8e4] flex items-center justify-center text-[#6b4c59] hover:text-[#59112e] hover:bg-[#fdf2f6] transition-all shadow-sm group">
          <div className="relative">
            <Bell size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
          </div>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 bg-white/80 backdrop-blur-xl border border-[#f2d8e4] rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#fdf2f6] to-[#fbcfe8] flex items-center justify-center text-[#59112e] border border-white">
            <User size={16} strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-[#59112e] hidden sm:block pr-2 capitalize">{user?.role || 'Guest'}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-full bg-[#59112e] text-white flex items-center justify-center shadow-lg shadow-[#59112e]/20 hover:scale-105 hover:bg-[#450d24] transition-all"
        >
          <LogOut size={16} />
        </button>

      </div>

    </header>
  );
};

export default Navbar;