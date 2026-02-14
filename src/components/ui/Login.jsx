import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Truck,
  ShoppingBag,
  Mail,
  Lock,
  User,
  ArrowRight,
  FileText,
  UploadCloud,
  Package,
  Navigation,
  Briefcase,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';

// Custom delivery person SVG icon component
const DeliveryPerson = ({ size = 24, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {/* Head */}
    <circle cx="12" cy="4" r="2.5" />
    {/* Body */}
    <path d="M12 6.5v5" />
    {/* Arms carrying box */}
    <path d="M8 8.5l4 1.5 4-1.5" />
    {/* Box on back */}
    <rect x="14" y="7" width="4" height="3.5" rx="0.5" />
    {/* Legs walking */}
    <path d="M12 11.5l-3 6.5" />
    <path d="M12 11.5l3 6.5" />
    {/* Feet */}
    <path d="M9 18l-1.5 1" />
    <path d="M15 18l1.5 1" />
  </svg>
);

// Doodle icons for background grid
const DOODLE_ICONS = [
  Truck, ShoppingBag, Package, MapPin, Store, DeliveryPerson
];

// Seeded random for consistent layout across renders
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Grid size in pixels for each cell
const CELL_SIZE = 110;

// Generate grid-based doodle items — continuous pattern with per-cell randomness
function generateGridDoodles(cols, rows) {
  const rand = seededRandom(42);
  const doodles = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const jitterX = (rand() - 0.5) * 30;  // ±15px offset within cell
      const jitterY = (rand() - 0.5) * 30;
      doodles.push({
        id: row * cols + col,
        IconComponent: DOODLE_ICONS[Math.floor(rand() * DOODLE_ICONS.length)],
        x: col * CELL_SIZE + CELL_SIZE / 2 + jitterX,
        y: row * CELL_SIZE + CELL_SIZE / 2 + jitterY,
        size: 24 + rand() * 16,              // 24–40px
        rotation: -25 + rand() * 50,         // -25° to +25°
        opacity: 0.12 + rand() * 0.10,       // 0.12–0.22
        animDelay: rand() * 6,
        animDuration: 5 + rand() * 4,        // 5–9s float cycle
        floatY: 4 + rand() * 6,              // 4–10px gentle drift
      });
    }
  }
  return doodles;
}

// Floating doodle background component — grid-based continuous pattern
const DoodleBackground = () => {
  const [dims, setDims] = React.useState({ w: window.innerWidth, h: window.innerHeight });

  React.useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const cols = Math.ceil(dims.w / CELL_SIZE) + 1;
  const rows = Math.ceil(dims.h / CELL_SIZE) + 1;
  const doodles = useMemo(() => generateGridDoodles(cols, rows), [cols, rows]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {doodles.map((d) => {
        const Icon = d.IconComponent;
        return (
          <motion.div
            key={d.id}
            className="absolute"
            style={{
              left: d.x,
              top: d.y,
              rotate: `${d.rotation}deg`,
            }}
            animate={{
              y: [0, -d.floatY, 0],
            }}
            transition={{
              duration: d.animDuration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: d.animDelay,
            }}
          >
            <Icon
              size={d.size}
              strokeWidth={1.2}
              style={{
                color: '#59112e',
                opacity: d.opacity,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

const AuthScreen = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('merchant'); // 'merchant' | 'delivery' | 'customer'
  const [aadhaarFile, setAadhaarFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAadhaarFile(e.target.files[0].name);
    }
  };

  // Form Animation
  const fadeIn = {
    hidden: { opacity: 0, y: 10, height: 0, overflow: 'hidden' },
    visible: { opacity: 1, y: 0, height: 'auto', overflow: 'visible', transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, height: 0, overflow: 'hidden', transition: { duration: 0.2 } }
  };

  // Map UI userType → auth role
  const roleMap = { merchant: 'merchant', delivery: 'driver', customer: 'customer' };

  // Redirect target per role
  const dashboardMap = {
    merchant: '/merchant/Dashboard',
    driver: '/driver/DashboardDelivery',
    customer: '/customer/CustomerApp',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = roleMap[userType];
    login({ id: crypto.randomUUID(), role });
    navigate(dashboardMap[role], { replace: true });
  };

  // Content configuration based on Role
  const roleConfig = {
    merchant: {
      icon: Store,
      title: isLogin ? "Vendor Portal" : "Join as Merchant",
      subtitle: "Manage inventory & connect with buyers.",
      color: "bg-primary",
      placeholder: "Business Name"
    },
    delivery: {
      icon: Truck,
      title: isLogin ? "Driver Login" : "Join the Fleet",
      subtitle: "Route optimization & fast payouts.",
      color: "bg-[#4a1024]",
      placeholder: "Full Name"
    },
    customer: {
      icon: ShoppingBag,
      title: isLogin ? "Customer Login" : "Create Account",
      subtitle: "Browse shops & order locally.",
      color: "bg-[#1a5c3a]",
      placeholder: "Full Name"
    }
  };

  const activeConfig = roleConfig[userType];
  const ActiveIcon = activeConfig.icon;

  return (
    // Outer Background - Randomized doodle scatter
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 font-outfit relative"
      style={{
        backgroundColor: 'var(--color-primary-soft)',
        backgroundImage: `radial-gradient(circle at 50% 0%, #ffffffaa, transparent)`,
      }}
    >
      {/* Scattered doodle icons */}
      <DoodleBackground />

      {/* Main Card - Solid White */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.3 }}
        className="w-full max-w-[460px] bg-white rounded-[2rem] shadow-2xl shadow-[#59112e]/15 border border-white/50 relative overflow-hidden z-10"
      >

        {/* TOP SECTION: Dynamic Visual Identity */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/40 via-primary to-primary/40 z-20"></div>

        {/* Header / Logo Area */}
        <div className="pt-10 pb-6 px-8 text-center relative overflow-hidden">
          {/* Floating Icons decoration */}
          <Package className="absolute top-6 left-8 text-primary/5 rotate-12 z-10" size={40} />
          <MapPin className="absolute top-4 right-8 text-primary/5 -rotate-12 z-10" size={36} />


        </div>

        {/* Dynamic Large Icon */}
        <div className="flex justify-center mb-5 mt-2">
          <motion.div
            key={userType}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className={`w-20 h-20 rounded-3xl ${activeConfig.color} flex items-center justify-center text-white shadow-xl shadow-primary/25 relative`}
          >
            <ActiveIcon size={40} strokeWidth={1.5} />

            {/* Decorative badge */}
            <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
              <div className="w-6 h-6 rounded-lg bg-primary-soft flex items-center justify-center">
                {userType === 'merchant' ? <Package size={14} className="text-primary" /> : <Navigation size={14} className="text-primary" />}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.h1
          key={activeConfig.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-primary tracking-tight relative px-8 text-center"
        >
          {activeConfig.title}
        </motion.h1>

        <motion.p
          key={activeConfig.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-soft font-medium text-sm mt-2 relative px-8 text-center"
        >
          {activeConfig.subtitle}
        </motion.p>

        {/* Role Switcher - 3 Roles */}
        <div className="px-8 mt-2 mb-6">
          <div className="grid grid-cols-3 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 relative font-medium">
            {['merchant', 'delivery', 'customer'].map((type, idx) => (
              <button
                key={type}
                type="button"
                onClick={() => setUserType(type)}
                className={`relative z-10 flex items-center justify-center gap-1.5 py-3 text-xs font-bold rounded-xl transition-colors duration-300 ${userType === type ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {type === 'merchant' ? <Store size={16} /> : type === 'delivery' ? <Truck size={16} /> : <ShoppingBag size={16} />}
                <span className="capitalize">{type === 'delivery' ? 'Driver' : type}</span>
              </button>
            ))}

            {/* Sliding White Background */}
            <motion.div
              layout
              className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100/50"
              initial={false}
              animate={{
                left: userType === 'merchant' ? '6px' : userType === 'delivery' ? 'calc(33.333% + 2px)' : 'calc(66.666% + 0px)',
                width: 'calc(33.333% - 8px)',
              }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
            />
          </div>
        </div>

        {/* Form Inputs */}
        <div className="px-8 pb-10">
          <form className="space-y-4" onSubmit={handleSubmit}>

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary/60 ml-1">
                    {activeConfig.placeholder}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                      {userType === 'merchant' ? <Briefcase size={20} /> : <User size={20} />}
                    </div>
                    <input
                      type="text"
                      placeholder={userType === 'merchant' ? 'Acme Co.' : 'John Doe'}
                      className="w-full bg-gray-50/50 border border-gray-200 text-main font-bold rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:font-medium"
                    />
                  </div>
                </motion.div>
              )}

              <motion.div layout className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-primary/60 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input type="email" placeholder="name@work.com" className="w-full bg-gray-50/50 border border-gray-200 text-main font-bold rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:font-medium" />
                </div>
              </motion.div>

              {!isLogin && (
                <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary/60 ml-1">Identity Proof</label>
                  <div className="relative">
                    <input type="file" id="aadhaar" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="aadhaar" className={`flex items-center justify-between w-full p-3.5 rounded-xl border-2 border-dashed cursor-pointer transition-all ${aadhaarFile ? 'border-primary bg-primary-soft/30' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${aadhaarFile ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <FileText size={18} />
                        </div>
                        <span className={`text-sm font-bold ${aadhaarFile ? 'text-primary' : 'text-gray-500'}`}>
                          {aadhaarFile || "Upload Aadhaar (Front)"}
                        </span>
                      </div>
                      <UploadCloud size={18} className="text-gray-400" />
                    </label>
                  </div>
                </motion.div>
              )}

              <motion.div layout className="space-y-1.5">
                <div className="flex justify-between ml-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary/60">Password</label>
                  {isLogin && <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50/50 border border-gray-200 text-main font-bold rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:font-medium" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Action Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full ${activeConfig.color} text-white font-bold text-lg rounded-2xl py-4 mt-4 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group`}
            >
              <span>{isLogin ? 'Sign In' : 'Continue'}</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </motion.button>

          </form>

          {/* Footer Toggle */}
          <motion.div layout className="mt-6 text-center">
            <p className="text-sm text-gray-500 font-medium">
              {isLogin ? "New here?" : "Have an account?"}
              <button onClick={() => setIsLogin(!isLogin)} className="ml-2 font-bold text-primary hover:underline">
                {isLogin ? 'Create Account' : 'Log In'}
              </button>
            </p>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;