import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Providers ---
import { AuthProvider } from '../providers/AuthContext';
import { RoleProvider } from '../providers/RoleContext';

// --- Route Guards ---
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// --- Layouts ---
import PublicLayout from '../layouts/PublicLayout';
import MerchantLayout from '../layouts/MerchantLayout';
import DriverLayout from '../layouts/DriverLayout';
import CustomerLayout from '../layouts/CustomerLayout';

// --- Public Pages ---
import Login from '../../components/ui/Login';
import TradeMap from '../../components/map/TradeMap';
import LandingPage from '../../pages/landing/LandingPage';

// --- Merchant Pages ---
import Dashboard from '../../features/merchant/Dashboard';
import Inventory from '../../features/merchant/Inventory';
import Propogation from '../../features/merchant/Propogation';
import Requests from '../../features/merchant/Requests';
import Track from '../../features/merchant/Track';
import RouteOptimizer from '../../pages/Route';

// --- Driver Pages ---
import DashboardDelivery from '../../features/driver/DashboardDelivery';
import DashboardOrders from '../../features/driver/DeliveryOrders';
import DashboardHistory from '../../features/driver/DeliveryHistory';
import DriverMapsPage from '../../pages/driver/DriverMapsPage';

// --- Customer Pages ---
import CustomerApp from '../../features/customer/CustomerApp';

// --- Profile Page ---
import ProfilePage from '../../pages/profile';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <RoleProvider>
                    <Routes>
                        {/* ─── Public Routes ─── */}
                        <Route element={<PublicLayout />}>
                            <Route path="/" element={<LandingPage />} />
                        </Route>
                        <Route path="/ui/Login" element={<Login />} />
                        <Route path="/map/TradeMap" element={<TradeMap />} />

                        {/* ─── Protected Routes ─── */}
                        <Route element={<ProtectedRoute />}>

                            {/* ── Profile (all roles) ── */}
                            <Route path="/profile" element={<ProfilePage />} />

                            {/* ── Merchant ── */}
                            <Route element={<RoleRoute allowedRole="merchant" />}>
                                <Route element={<MerchantLayout />}>
                                    <Route path="/merchant/Dashboard" element={<Dashboard />} />
                                    <Route path="/merchant/Inventory" element={<Inventory />} />
                                    <Route path="/merchant/Propogation" element={<Propogation />} />
                                    <Route path="/merchant/Requests" element={<Requests />} />
                                    <Route path="/merchant/Track" element={<Track />} />
                                    <Route path="/merchant/Route" element={<RouteOptimizer />} />
                                </Route>
                            </Route>

                            {/* ── Driver ── */}
                            <Route element={<RoleRoute allowedRole="driver" />}>
                                <Route element={<DriverLayout />}>
                                    <Route path="/driver/DashboardDelivery" element={<DashboardDelivery />} />
                                    <Route path="/driver/DashboardOrders" element={<DashboardOrders />} />
                                    <Route path="/driver/DashboardHistory" element={<DashboardHistory />} />
                                    <Route path="/driver/maps" element={<DriverMapsPage />} />
                                </Route>
                            </Route>

                            {/* ── Customer ── */}
                            <Route element={<RoleRoute allowedRole="customer" />}>
                                <Route element={<CustomerLayout />}>
                                    <Route path="/customer/CustomerApp" element={<CustomerApp />} />
                                    {/* Future: */}
                                    {/* <Route path="/customer/orders" element={<Orders />} /> */}
                                    {/* <Route path="/customer/track/:orderId" element={<TrackOrder />} /> */}
                                </Route>
                            </Route>

                        </Route>

                        {/* ─── Catch-all → Landing ─── */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </RoleProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
