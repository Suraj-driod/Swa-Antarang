import { Outlet } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar';
import {
    LayoutDashboard,
    Package,
    Radio,
    MessageSquare,
    MapPin,
} from 'lucide-react';

const merchantNavItems = [
    { to: '/merchant/Dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/merchant/Inventory', icon: Package, label: 'Inventory' },
    { to: '/merchant/Propogation', icon: Radio, label: 'Propagate' },
    { to: '/merchant/Requests', icon: MessageSquare, label: 'Requests', badge: true },
    { to: '/merchant/Track', icon: MapPin, label: 'Track' },
];

export default function MerchantLayout() {
    return (
        <div className="flex flex-col min-h-dvh bg-gray-50">
            <Navbar items={merchantNavItems} brandTitle="Swa-Antarang" brandSub="Merchant OS" />
            <main className="flex-1 pt-20 pb-20 md:pb-4 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
