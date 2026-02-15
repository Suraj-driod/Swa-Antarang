import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building2,
    FileText,
    Shield,
    Star,
    Bike,
    Clock,
    Award,
    ArrowLeft,
    Edit3,
    Camera,
    Car,
    CreditCard,
    BadgeCheck,
    TrendingUp,
    Package,
    Calendar,
    LogOut,
    BarChart3,
} from 'lucide-react';
import { useAuth } from '../app/providers/AuthContext';

// --- MOCK DATA ---
const MERCHANT_MOCK = {
    businessName: 'Acme Supplies',
    address: '42, MG Road, Camp, Pune, Maharashtra - 411001',
    gstin: '27AABCU9603R1ZM',
    businessType: 'Building Materials & Hardware',
    since: 'Jan 2022',
    totalProducts: 148,
    totalOrders: 2840,
    monthlyRevenue: '₹4.2L',
};

const DRIVER_MOCK = {
    vehicleNumber: 'MH-12-AB-1234',
    vehicleType: 'Two-Wheeler (Bike)',
    licenseNumber: 'MH12-2020-0045678',
    licenseExpiry: 'Dec 2028',
    totalTrips: 1240,
    rating: 4.9,
    onTimeRate: '98%',
    experience: '3 years',
    totalEarnings: '₹2.8L',
    zone: 'Pune West',
};

// --- REUSABLE COMPONENTS ---

/** Stat card with colored top accent bar */
const StatCard = ({ value, label, accentColor = 'bg-[#59112e]' }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
    >
        <div className={`h-1 ${accentColor}`}></div>
        <div className="p-4 pt-3 text-center">
            <BarChart3 size={16} className="text-slate-300 mx-auto mb-1.5 group-hover:text-[#59112e] transition-colors" />
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
        </div>
    </motion.div>
);

/** Info tile (grid card style like the reference image) */
const InfoTile = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-100 p-4 hover:border-[#f2d8e4] hover:shadow-sm transition-all group">
        <div className="w-10 h-10 rounded-xl bg-[#fdf2f6] text-[#59112e] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{value || '—'}</p>
        </div>
    </div>
);

/** Privilege / role-detail card with colored label */
const PrivilegeCard = ({ label, value, color = 'text-[#59112e]', bg = 'bg-[#fdf2f6]' }) => (
    <div className={`${bg} rounded-xl p-4 border border-slate-50 hover:shadow-sm transition-all`}>
        <p className={`text-[11px] font-bold ${color} uppercase tracking-wider mb-1`}>{label}</p>
        <p className="text-sm font-semibold text-slate-700">{value}</p>
    </div>
);

// --- MAIN COMPONENT ---

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const role = user?.role || 'merchant';
    const isMerchant = role === 'merchant';
    const isDriver = role === 'driver';
    const isCustomer = role === 'customer';

    const goBack = () => {
        if (isMerchant) navigate('/merchant/Dashboard');
        else if (isDriver) navigate('/driver/DashboardDelivery');
        else navigate(-1);
    };

    const handleLogout = () => {
        logout();
        navigate('/ui/Login', { replace: true });
    };

    // Build stats based on role
    const stats = isMerchant
        ? [
            { value: MERCHANT_MOCK.totalProducts, label: 'Total Products', accent: 'bg-[#59112e]' },
            { value: MERCHANT_MOCK.totalOrders.toLocaleString(), label: 'Total Orders', accent: 'bg-emerald-500' },
            { value: MERCHANT_MOCK.monthlyRevenue, label: 'Monthly Rev.', accent: 'bg-amber-500' },
        ]
        : isDriver
            ? [
                { value: DRIVER_MOCK.totalTrips.toLocaleString(), label: 'Total Trips', accent: 'bg-[#59112e]' },
                { value: DRIVER_MOCK.rating, label: 'Rating', accent: 'bg-emerald-500' },
                { value: DRIVER_MOCK.onTimeRate, label: 'On-Time Rate', accent: 'bg-amber-500' },
            ]
            : [];

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-outfit">

            {/* ── PAGE HEADER ── */}
            <div className="bg-gradient-to-r from-[#59112e] to-[#7a1b42] relative overflow-hidden">
                <div className="absolute top-[-30px] right-[-30px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-20px] left-[40%] w-28 h-28 bg-rose-500/15 rounded-full blur-2xl"></div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 relative z-10">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm font-bold">Back to Dashboard</span>
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">My Profile</h1>
                    <p className="text-white/60 text-sm font-medium mt-1">Manage your personal information and account settings</p>
                </div>
            </div>

            {/* ── TWO-COLUMN LAYOUT ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-20">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">

                    {/* ── LEFT SIDEBAR CARD ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-80 shrink-0"
                    >
                        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden sticky top-24">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center px-6 pt-8 pb-6">
                                {/* Avatar with ring */}
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#fdf2f6] to-[#f2d8e4] flex items-center justify-center ring-4 ring-[#59112e] ring-offset-4 ring-offset-white">
                                        {user?.avatarUrl ? (
                                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <User size={44} className="text-[#59112e]/50" strokeWidth={1.5} />
                                        )}
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-[#59112e] hover:scale-110 transition-transform border-2 border-[#f2d8e4]">
                                        <Camera size={16} />
                                    </button>
                                </div>

                                {/* Name & Role */}
                                <h2 className="text-xl font-bold text-slate-800 mt-5 text-center">
                                    {user?.fullName || (isMerchant ? 'Merchant User' : isDriver ? 'Driver User' : 'Customer')}
                                </h2>
                                <span className="mt-2 bg-gradient-to-r from-[#59112e] to-[#7a1b42] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                                    <BadgeCheck size={13} />
                                    {role}
                                </span>
                                <p className="text-xs text-slate-400 mt-2 font-medium">{user?.email || 'user@example.com'}</p>
                            </div>

                            {/* Divider */}
                            <div className="mx-6 border-t border-slate-100"></div>

                            {/* Actions */}
                            <div className="p-6 space-y-3">
                                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#59112e] to-[#7a1b42] text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#59112e]/20 transition-all active:scale-[0.98]">
                                    <Edit3 size={16} />
                                    Edit Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#f2d8e4] text-[#59112e] py-3 rounded-xl font-bold text-sm hover:bg-[#fdf2f6] transition-all active:scale-[0.98]"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── RIGHT CONTENT AREA ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 min-w-0 space-y-6"
                    >

                        {/* Stats Row */}
                        {stats.length > 0 && (
                            <div className={`grid gap-4 ${stats.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                                {stats.map((stat, idx) => (
                                    <StatCard key={idx} value={stat.value} label={stat.label} accentColor={stat.accent} />
                                ))}
                            </div>
                        )}

                        {/* Personal Details Section */}
                        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#fdf2f6] text-[#59112e] flex items-center justify-center">
                                    <User size={18} />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">Personal Details</h2>
                            </div>
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InfoTile icon={Mail} label="Email Address" value={user?.email || 'user@example.com'} />
                                <InfoTile icon={Phone} label="Phone Number" value={user?.phone || '+91 98765 43210'} />
                                {isMerchant && (
                                    <InfoTile icon={MapPin} label="Business Address" value={MERCHANT_MOCK.address} />
                                )}
                                {isDriver && (
                                    <InfoTile icon={MapPin} label="Active Zone" value={DRIVER_MOCK.zone} />
                                )}
                                {isCustomer && (
                                    <InfoTile icon={MapPin} label="Location" value="Pune, Maharashtra" />
                                )}
                            </div>
                        </div>

                        {/* Role-Specific Details (merchant/driver only) */}
                        {(isMerchant || isDriver) && (
                            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#fdf2f6] text-[#59112e] flex items-center justify-center">
                                        <Shield size={18} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        {isMerchant ? 'Business Details' : 'Driver Details'}
                                    </h2>
                                </div>
                                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {isMerchant && (
                                        <>
                                            <PrivilegeCard label="Company Name" value={MERCHANT_MOCK.businessName} color="text-[#59112e]" bg="bg-[#fdf2f6]" />
                                            <PrivilegeCard label="GSTIN" value={MERCHANT_MOCK.gstin} color="text-violet-600" bg="bg-violet-50" />
                                            <PrivilegeCard label="Company Type" value={MERCHANT_MOCK.businessType} color="text-emerald-600" bg="bg-emerald-50" />
                                            <PrivilegeCard label="Member Since" value={MERCHANT_MOCK.since} color="text-amber-600" bg="bg-amber-50" />
                                        </>
                                    )}
                                    {isDriver && (
                                        <>
                                            <PrivilegeCard label="Vehicle Number" value={DRIVER_MOCK.vehicleNumber} color="text-[#59112e]" bg="bg-[#fdf2f6]" />
                                            <PrivilegeCard label="Vehicle Type" value={DRIVER_MOCK.vehicleType} color="text-violet-600" bg="bg-violet-50" />
                                            <PrivilegeCard label="License Number" value={DRIVER_MOCK.licenseNumber} color="text-emerald-600" bg="bg-emerald-50" />
                                            <PrivilegeCard label="License Expiry" value={DRIVER_MOCK.licenseExpiry} color="text-amber-600" bg="bg-amber-50" />
                                            <PrivilegeCard label="Experience" value={DRIVER_MOCK.experience} color="text-blue-600" bg="bg-blue-50" />
                                            <PrivilegeCard label="Total Earnings" value={DRIVER_MOCK.totalEarnings} color="text-rose-600" bg="bg-rose-50" />
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Quick Actions (merchant/driver only) */}
                        {(isMerchant || isDriver) && (
                            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#fdf2f6] text-[#59112e] flex items-center justify-center">
                                        <FileText size={18} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
                                </div>
                                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { icon: Shield, label: 'Security & Privacy', desc: 'Password, 2FA, sessions', color: 'text-[#59112e]', bg: 'bg-[#fdf2f6]' },
                                        { icon: CreditCard, label: 'Payment Methods', desc: 'UPI, Bank, wallets', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                        { icon: FileText, label: 'Documents', desc: isMerchant ? 'GST returns, invoices' : 'License, RC, insurance', color: 'text-violet-600', bg: 'bg-violet-50' },
                                        { icon: Award, label: 'Achievements', desc: 'Badges & milestones', color: 'text-amber-600', bg: 'bg-amber-50' },
                                    ].map((action, idx) => (
                                        <button
                                            key={idx}
                                            className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-[#f2d8e4] hover:shadow-sm transition-all text-left group"
                                        >
                                            <div className={`w-10 h-10 rounded-xl ${action.bg} ${action.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                                                <action.icon size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-800">{action.label}</p>
                                                <p className="text-[11px] text-slate-400">{action.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                    </motion.div>
                </div>
            </div>
        </div>
    );
}
