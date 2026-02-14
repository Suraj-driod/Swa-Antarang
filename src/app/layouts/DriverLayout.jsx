import { Outlet } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar';
import {
    LayoutDashboard,
    ClipboardList,
    Clock,
} from 'lucide-react';

const driverNavItems = [
    { to: '/driver/DashboardDelivery', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/driver/DashboardOrders', icon: ClipboardList, label: 'Orders' },
    { to: '/driver/DashboardHistory', icon: Clock, label: 'History' },
];

export default function DriverLayout() {
    return (
        <div className="flex flex-col min-h-dvh bg-gray-50">
            <Navbar items={driverNavItems} brandTitle="Swa-Antarang" brandSub="Driver Hub" />
            <main className="flex-1 pt-20 pb-20 md:pb-4 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
