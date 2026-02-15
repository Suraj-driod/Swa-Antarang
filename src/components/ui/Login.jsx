import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Store, Truck, ShoppingBag, Mail, Lock, User,
    ArrowRight, FileText, UploadCloud, Package,
    Navigation, Briefcase, MapPin
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';

// Delivery person SVG icon
const DeliveryPerson = ({ size = 24, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <circle cx="12" cy="4" r="2.5" />
        <path d="M12 6.5v5" />
        <path d="M8 8.5l4 1.5 4-1.5" />
        <rect x="14" y="7" width="4" height="3.5" rx="0.5" />
        <path d="M12 11.5l-3 6.5" />
        <path d="M12 11.5l3 6.5" />
        <path d="M9 18l-1.5 1" />
        <path d="M15 18l1.5 1" />
    </svg>
);

const DOODLE_ICONS = [Truck, ShoppingBag, Package, MapPin, Store, DeliveryPerson];
const CELL_SIZE = 110;

function seededRandom(seed) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function generateGridDoodles(cols, rows) {
    const rand = seededRandom(42);
    const doodles = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const jitterX = (rand() - 0.5) * 30;
            const jitterY = (rand() - 0.5) * 30;
            doodles.push({
                id: row * cols + col,
                IconComponent: DOODLE_ICONS[Math.floor(rand() * DOODLE_ICONS.length)],
                x: col * CELL_SIZE + CELL_SIZE / 2 + jitterX,
                y: row * CELL_SIZE + CELL_SIZE / 2 + jitterY,
                size: 24 + rand() * 16,
                rotation: -25 + rand() * 50,
                opacity: 0.12 + rand() * 0.10,
                animDelay: rand() * 6,
                animDuration: 5 + rand() * 4,
                floatY: 4 + rand() * 6,
            });
        }
    }
    return doodles;
}

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
                        style={{ left: d.x, top: d.y, rotate: `${d.rotation}deg` }}
                        animate={{ y: [0, -d.floatY, 0] }}
                        transition={{ duration: d.animDuration, repeat: Infinity, ease: 'easeInOut', delay: d.animDelay }}
                    >
                        <Icon size={d.size} strokeWidth={1.2} style={{ color: '#59112e', opacity: d.opacity }} />
                    </motion.div>
                );
            })}
        </div>
    );
};

const DASHBOARD_MAP = {
    merchant: '/merchant/Dashboard',
    driver: '/driver/DashboardDelivery',
    customer: '/customer/CustomerApp',
};

const ROLE_MAP = { merchant: 'merchant', delivery: 'driver', customer: 'customer' };

const ROLE_CONFIG = {
    merchant: {
        icon: Store,
        loginTitle: 'Vendor Portal',
        signupTitle: 'Join as Merchant',
        subtitle: 'Manage inventory & connect with buyers.',
        color: 'bg-primary',
        placeholder: 'Business Name',
    },
    delivery: {
        icon: Truck,
        loginTitle: 'Driver Login',
        signupTitle: 'Join the Fleet',
        subtitle: 'Route optimization & fast payouts.',
        color: 'bg-[#4a1024]',
        placeholder: 'Full Name',
    },
    customer: {
        icon: ShoppingBag,
        loginTitle: 'Customer Login',
        signupTitle: 'Create Account',
        subtitle: 'Browse shops & order locally.',
        color: 'bg-[#1a5c3a]',
        placeholder: 'Full Name',
    },
};

const fadeIn = {
    hidden: { opacity: 0, y: 10, height: 0, overflow: 'hidden' },
    visible: { opacity: 1, y: 0, height: 'auto', overflow: 'visible', transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, height: 0, overflow: 'hidden', transition: { duration: 0.2 } },
};

const AuthScreen = () => {
    const { user, loading, login, signUp } = useAuth();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState('merchant');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameField, setNameField] = useState('');
    const [aadhaarFile, setAadhaarFile] = useState(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Auto-redirect if already authenticated
    React.useEffect(() => {
        if (!loading && user) {
            navigate(DASHBOARD_MAP[user.role] || '/merchant/Dashboard', { replace: true });
        }
    }, [loading, user, navigate]);

    // Clear error when switching modes or changing input
    const clearError = useCallback(() => { if (error) setError(''); }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const role = ROLE_MAP[userType];

        try {
            if (isLogin) {
                const result = await login(email, password);
                // Navigate based on the actual profile role, not the selected tab
                const targetRole = result.profile?.role || role;
                navigate(DASHBOARD_MAP[targetRole], { replace: true });
            } else {
                const metadata = {
                    role,
                    full_name: nameField,
                    ...(userType === 'merchant' && { business_name: nameField }),
                    ...(userType === 'delivery' && { vehicle_type: '' }),
                };
                await signUp(email, password, metadata);
                navigate(DASHBOARD_MAP[role], { replace: true });
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const config = ROLE_CONFIG[userType];
    const title = isLogin ? config.loginTitle : config.signupTitle;
    const ActiveIcon = config.icon;

    // Show spinner while bootstrapping session
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdf2f6]">
                <div className="w-10 h-10 border-4 border-[#59112e] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 font-outfit relative"
            style={{
                backgroundColor: 'var(--color-primary-soft)',
                backgroundImage: 'radial-gradient(circle at 50% 0%, #ffffffaa, transparent)',
            }}
        >
            <DoodleBackground />

            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.3 }}
                className="w-full max-w-[460px] bg-white rounded-[2rem] shadow-2xl shadow-[#59112e]/15 border border-white/50 relative overflow-hidden z-10"
            >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/40 via-primary to-primary/40 z-20" />

                {/* Header decorations */}
                <div className="pt-10 pb-6 px-8 text-center relative overflow-hidden">
                    <Package className="absolute top-6 left-8 text-primary/5 rotate-12 z-10" size={40} />
                    <MapPin className="absolute top-4 right-8 text-primary/5 -rotate-12 z-10" size={36} />
                </div>

                {/* Dynamic icon */}
                <div className="flex justify-center mb-5 mt-2">
                    <motion.div
                        key={userType}
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                        className={`w-20 h-20 rounded-3xl ${config.color} flex items-center justify-center text-white shadow-xl shadow-primary/25 relative`}
                    >
                        <ActiveIcon size={40} strokeWidth={1.5} />
                        <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-6 h-6 rounded-lg bg-primary-soft flex items-center justify-center">
                                {userType === 'merchant'
                                    ? <Package size={14} className="text-primary" />
                                    : <Navigation size={14} className="text-primary" />}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.h1
                    key={`title-${userType}-${isLogin}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-primary tracking-tight px-8 text-center"
                >
                    {title}
                </motion.h1>

                <motion.p
                    key={`sub-${userType}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-soft font-medium text-sm mt-2 px-8 text-center"
                >
                    {config.subtitle}
                </motion.p>

                {/* Role switcher */}
                <div className="px-8 mt-2 mb-6">
                    <div className="grid grid-cols-3 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 relative font-medium">
                        {['merchant', 'delivery', 'customer'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => { setUserType(type); clearError(); }}
                                className={`relative z-10 flex items-center justify-center gap-1.5 py-3 text-xs font-bold rounded-xl transition-colors duration-300 ${userType === type ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {type === 'merchant' ? <Store size={16} /> : type === 'delivery' ? <Truck size={16} /> : <ShoppingBag size={16} />}
                                <span className="capitalize">{type === 'delivery' ? 'Driver' : type}</span>
                            </button>
                        ))}

                        <motion.div
                            layout
                            className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100/50"
                            initial={false}
                            animate={{
                                left: userType === 'merchant' ? '6px' : userType === 'delivery' ? 'calc(33.333% + 2px)' : 'calc(66.666% + 0px)',
                                width: 'calc(33.333% - 8px)',
                            }}
                            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                        />
                    </div>
                </div>

                {/* Form */}
                <div className="px-8 pb-10">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <AnimatePresence mode="popLayout">
                            {/* Name field (signup only) */}
                            {!isLogin && (
                                <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-primary/60 ml-1">
                                        {config.placeholder}
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                            {userType === 'merchant' ? <Briefcase size={20} /> : <User size={20} />}
                                        </div>
                                        <input
                                            type="text"
                                            value={nameField}
                                            onChange={(e) => { setNameField(e.target.value); clearError(); }}
                                            placeholder={userType === 'merchant' ? 'Acme Co.' : 'John Doe'}
                                            className="w-full bg-gray-50/50 border border-gray-200 text-main font-bold rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:font-medium"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Email */}
                            <motion.div layout className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-primary/60 ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); clearError(); }}
                                        placeholder="name@work.com"
                                        className="w-full bg-gray-50/50 border border-gray-200 text-main font-bold rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:font-medium"
                                        required
                                    />
                                </div>
                            </motion.div>

                            {/* Aadhaar upload (signup only) */}
                            {!isLogin && (
                                <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="space-y-1.5 pt-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-primary/60 ml-1">Identity Proof</label>
                                    <div className="relative">
                                        <input type="file" id="aadhaar" className="hidden" onChange={(e) => {
                                            if (e.target.files?.[0]) setAadhaarFile(e.target.files[0].name);
                                        }} />
                                        <label htmlFor="aadhaar" className={`flex items-center justify-between w-full p-3.5 rounded-xl border-2 border-dashed cursor-pointer transition-all ${aadhaarFile ? 'border-primary bg-primary-soft/30' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${aadhaarFile ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    <FileText size={18} />
                                                </div>
                                                <span className={`text-sm font-bold ${aadhaarFile ? 'text-primary' : 'text-gray-500'}`}>
                                                    {aadhaarFile || 'Upload Aadhaar (Front)'}
                                                </span>
                                            </div>
                                            <UploadCloud size={18} className="text-gray-400" />
                                        </label>
                                    </div>
                                </motion.div>
                            )}

                            {/* Password */}
                            <motion.div layout className="space-y-1.5">
                                <div className="flex justify-between ml-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-primary/60">Password</label>
                                    {isLogin && <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); clearError(); }}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50/50 border border-gray-200 text-main font-bold rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:font-medium"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Error display */}
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl px-4 py-3 text-center">
                                {error}
                            </div>
                        )}

                        {/* Submit button */}
                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={{ scale: 1.01, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full ${config.color} text-white font-bold text-lg rounded-2xl py-4 mt-4 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-60`}
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Continue'}</span>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Toggle login/signup */}
                    <motion.div layout className="mt-6 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            {isLogin ? 'New here?' : 'Have an account?'}
                            <button
                                onClick={() => { setIsLogin(!isLogin); clearError(); }}
                                className="ml-2 font-bold text-primary hover:underline"
                            >
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
