import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  User,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';

const Navbar = ({ items = [], brandTitle = 'Swa-Antarang', brandSub = 'Platform' }) => {
  const [hoveredTab, setHoveredTab] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // FIX: Use only pathname. Ignoring location.search ensures the active tab 
  // stays stable even if the page adds query parameters (e.g. ?id=101)
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/ui/Login', { replace: true });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 md:py-5 pointer-events-none bg-gradient-to-b from-gray-50 via-gray-50/95 to-gray-50/0">

        {/* --- LEFT: BRAND ISLAND --- */}
        <div className="pointer-events-auto">
          <Link to="/" className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-[#fbcfe8] px-4 py-2.5 rounded-full shadow-[0_4px_20px_-4px_rgba(89,17,46,0.08)] ring-1 ring-white/50 group cursor-pointer transition-all hover:scale-[1.02]">
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
          </Link>
        </div>

        {/* --- CENTER: NAVIGATION CAPSULE (Desktop) --- */}
        <nav className="pointer-events-auto hidden md:block">
          {/* LayoutGroup ensures shared transitions work across the specific group ID */}
          <LayoutGroup id="navbar-pill-group">
            <div className="flex items-center gap-1 p-1.5 bg-white/70 backdrop-blur-2xl border border-[#f2d8e4] rounded-full shadow-[0_8px_32px_-8px_rgba(89,17,46,0.1)] ring-1 ring-white/60">
              {items.map((item) => {
                // FIX: Check against currentPath (pathname only)
                const isActive = currentPath === item.to;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onMouseEnter={() => setHoveredTab(item.to)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className="relative px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all duration-300"
                  >
                    {isActive && (
                      <motion.div
                        layout // FIX: 'layout' prop is essential for smooth position changes
                        layoutId="navPill"
                        className="absolute inset-0 bg-[#59112e] rounded-full shadow-lg shadow-[#59112e]/20"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}

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

                    {item.badge && !isActive && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white relative z-10"></span>
                    )}
                  </Link>
                );
              })}
            </div>
          </LayoutGroup>
        </nav>

        {/* --- RIGHT: ACTION CLUSTER --- */}
        <div className="pointer-events-auto flex items-center gap-2 md:gap-3">

          {/* Notifications */}
          <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl border border-[#f2d8e4] flex items-center justify-center text-[#6b4c59] hover:text-[#59112e] hover:bg-[#fdf2f6] transition-all shadow-sm group">
            <div className="relative">
              <Bell size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
            </div>
          </button>

          {/* Profile */}
          <div className="hidden sm:flex items-center gap-2 pl-2 pr-1.5 py-1.5 bg-white/80 backdrop-blur-xl border border-[#f2d8e4] rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#fdf2f6] to-[#fbcfe8] flex items-center justify-center text-[#59112e] border border-white">
              <User size={16} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-[#59112e] pr-2 capitalize">{user?.role || 'Guest'}</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-[#59112e] text-white flex items-center justify-center shadow-lg shadow-[#59112e]/20 hover:scale-105 hover:bg-[#450d24] transition-all"
          >
            <LogOut size={16} />
          </button>

          {/* Hamburger Menu Button (Mobile only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl border border-[#f2d8e4] flex items-center justify-center text-[#59112e] shadow-sm hover:bg-[#fdf2f6] transition-all"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              className="fixed top-20 left-4 right-4 z-50 md:hidden bg-white/95 backdrop-blur-xl rounded-2xl border border-[#f2d8e4] shadow-2xl shadow-[#59112e]/10 overflow-hidden"
            >
              <nav className="p-3 space-y-1">
                {items.map((item) => {
                  const isActive = currentPath === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${isActive
                        ? 'bg-[#59112e] text-white shadow-md shadow-[#59112e]/20'
                        : 'text-slate-600 hover:bg-[#fdf2f6] hover:text-[#59112e]'
                        }`}
                    >
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      <span>{item.label}</span>
                      {item.badge && !isActive && (
                        <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Profile Section */}
              <div className="sm:hidden border-t border-[#f2d8e4] p-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fdf2f6]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#59112e] to-[#9d174d] flex items-center justify-center text-white border border-white/20">
                    <User size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2d0b16] capitalize">{user?.role || 'Guest'}</p>
                    <p className="text-xs text-[#6b4c59]">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;