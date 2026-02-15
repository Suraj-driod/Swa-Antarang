import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';

export default function RoleRoute({ allowedRole }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdf2f6]">
                <div className="w-10 h-10 border-4 border-[#59112e] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user || user.role !== allowedRole) {
        return <Navigate to="/ui/Login" replace />;
    }

    return <Outlet />;
}
