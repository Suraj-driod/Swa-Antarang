import { Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import PublicNavbar from '../../components/ui/PublicNavbar';
import Navbar from '../../components/ui/Navbar';
import { roleNavMap } from '../../config/navItems';

const roleBrandSub = {
  merchant: 'Merchant OS',
  driver: 'Driver Hub',
  customer: 'Shop Local',
};

export default function PublicLayout() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-dvh bg-white">
      {isAuthenticated ? (
        <Navbar
          items={roleNavMap[user.role] || []}
          brandTitle="Swa-Antarang"
          brandSub={roleBrandSub[user.role] || 'Platform'}
        />
      ) : (
        <PublicNavbar />
      )}
      <main className={isAuthenticated ? 'pt-20' : ''}>
        <Outlet />
      </main>
    </div>
  );
}
