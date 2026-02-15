import { Outlet } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar';
import AIChatbot from '../../components/ui/AIChatbot';
import { customerNavItems } from '../../config/navItems';

export default function CustomerLayout() {
    return (
        <div className="flex flex-col min-h-dvh bg-gray-50">
            <Navbar items={customerNavItems} brandTitle="Swa-Antarang" brandSub="Shop Local" />
            <main className="flex-1 pt-20 pb-20 md:pb-4 overflow-y-auto">
                <Outlet />
            </main>
            <AIChatbot />
        </div>
    );
}
