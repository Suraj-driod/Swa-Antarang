import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Radio, 
  Inbox, 
  Map, 
  Navigation, 
  LogOut, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  User,
  HelpCircle
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'inventory', label: 'Inventory', icon: LayoutDashboard },
  { id: 'propagation', label: 'Propagation', icon: Radio },
  { id: 'requests', label: 'Requests', icon: Inbox, badge: 3 },
  { id: 'route', label: 'Route Optimizer', icon: Map },
  { id: 'track', label: 'Live Tracking', icon: Navigation },
];

const Sidebar = ({ activePage = 'inventory', onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <motion.aside 
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 88 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-screen sticky top-0 bg-[#fdf2f6]/90 backdrop-blur-xl border-r border-[#f2d8e4] flex flex-col justify-between z-40 shadow-[4px_0_24px_rgba(89,17,46,0.02)]"
    >
      {/* --- HEADER --- */}
      <div className="p-6 flex items-center justify-between relative">
        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#59112e] to-[#851e45] flex items-center justify-center text-white shadow-lg shadow-[#59112e]/20 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="whitespace-nowrap"
              >
                <h1 className="text-lg font-bold text-[#2d0b16] tracking-tight">SupplierMatch</h1>
                <p className="text-[10px] text-[#6b4c59] font-medium uppercase tracking-wider">Merchant Console</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle (Absolute to overlap border) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-white border border-[#f2d8e4] rounded-full flex items-center justify-center text-[#6b4c59] hover:text-[#59112e] hover:border-[#59112e] transition-colors shadow-sm z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 px-4 space-y-2 mt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`relative w-full flex items-center rounded-xl transition-all duration-300 group ${
                isCollapsed ? 'justify-center py-3' : 'px-4 py-3.5'
              } ${isActive ? 'text-white' : 'text-[#6b4c59] hover:text-[#59112e]'}`}
            >
              {/* Active Background */}
              {isActive && (
                <motion.div
                  layoutId="activeSidebarItem"
                  className="absolute inset-0 bg-[#59112e] shadow-[0_4px_12px_-2px_rgba(89,17,46,0.3)] rounded-xl z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Hover Background */}
              <AnimatePresence>
                {hoveredItem === item.id && !isActive && (
                  <motion.div
                    layoutId="hoverSidebarItem"
                    className="absolute inset-0 bg-white border border-[#f2d8e4] rounded-xl -z-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <div className="relative z-10">
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : ''} />
                {/* Notification Badge (Only shown if collapsed) */}
                {isCollapsed && item.badge && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#fdf2f6]"></span>
                )}
              </div>

              {/* Label & Badge */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-3 relative z-10 flex-1 flex items-center justify-between overflow-hidden whitespace-nowrap"
                  >
                    <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#59112e]/10 text-[#59112e]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Tooltip for Collapsed State */}
              {isCollapsed && hoveredItem === item.id && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 20 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute left-full top-1/2 -translate-y-1/2 bg-[#2d0b16] text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-50 ml-2"
                >
                  {item.label}
                  {/* Arrow */}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-[#2d0b16]"></div>
                </motion.div>
              )}
            </button>
          );
        })}
      </nav>

      {/* --- FOOTER: PROFILE & SETTINGS --- */}
      <div className="p-4 space-y-2">
        
        {/* Support Link */}
        <button className={`flex items-center gap-3 w-full p-3 rounded-xl text-[#6b4c59] hover:bg-white hover:text-[#59112e] transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
          <HelpCircle size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Support</span>}
        </button>

        {/* Profile Card */}
        <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#f2d8e4] shadow-sm relative overflow-hidden group cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}>
          {/* Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdf2f6] to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative z-10 w-9 h-9 rounded-lg bg-[#59112e] flex items-center justify-center text-white shrink-0">
            <User size={18} />
          </div>
          
          {!isCollapsed && (
            <div className="relative z-10 flex-1 min-w-0">
              <p className="text-sm font-bold text-[#2d0b16] truncate">Acme Corp</p>
              <p className="text-[10px] text-[#6b4c59] truncate">admin@acme.com</p>
            </div>
          )}

          {!isCollapsed && (
            <button className="relative z-10 p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-500 transition-colors">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>

    </motion.aside>
  );
};

export default Sidebar;