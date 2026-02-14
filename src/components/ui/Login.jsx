import React, { useState } from 'react';
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

// 1. BACKGROUND PATTERN: "Delivery Man Only" (Kept as is)
const deliveryMenPattern = `data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2359112e' fill-opacity='0.05'%3E%3Ccircle cx='75' cy='25' r='5'/%3E%3Cpath d='M72 32h6v12h-6z'/%3E%3Crect x='78' y='32' width='10' height='10' rx='1'/%3E%3Cpath d='M75 44v14h-4v-14h4zm6 0v14h4v-14h-4z'/%3E%3C/g%3E%3C/svg%3E`;

// 2. NEW HEADER PATTERN: "Map Pin and Stuff"
// Replaced the truck pattern with Map Pins and small location dots.
const cardMapPattern = `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' fill='%2359112e' fill-opacity='0.08'/%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%2359112e' fill-opacity='0.08'/%3E%3C/svg%3E`;

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
    // Outer Background - Using the Delivery Men pattern
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 font-outfit relative"
      style={{
        backgroundColor: 'var(--color-primary-soft)',
        backgroundImage: `radial-gradient(circle at 50% 0%, #ffffffaa, transparent), url("${deliveryMenPattern}")`,
        backgroundBlendMode: 'multiply'
      }}
    >

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