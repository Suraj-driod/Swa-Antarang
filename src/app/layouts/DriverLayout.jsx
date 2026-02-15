import { Outlet } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar';
import { driverNavItems } from '../../config/navItems';

export default function DriverLayout() {
    return (
        <div className="flex flex-col min-h-dvh bg-gray-50">
            <Navbar items={driverNavItems} brandTitle="Swa-Antarang" brandSub="Driver Hub" />
            <main className="flex-1 pt-20 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
