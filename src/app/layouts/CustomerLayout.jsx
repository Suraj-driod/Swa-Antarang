import { Outlet } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar';
import {
    Home,
    ShoppingBag,
    Clock,
} from 'lucide-react';

const customerNavItems = [
    { to: '/customer/CustomerApp', icon: Home, label: 'Browse Products' },
    { to: '/customer/CustomerApp?view=cart', icon: ShoppingBag, label: 'My Cart' },
    { to: '/customer/CustomerApp?view=tracking', icon: Clock, label: 'Orders & Tracking' },
];

export default function CustomerLayout() {
    return (
        <div className="flex flex-col min-h-dvh bg-gray-50">
            <Navbar items={customerNavItems} brandTitle="Swa-Antarang" brandSub="Shop Local" />
            <main className="flex-1 pt-20 pb-20 md:pb-4 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
