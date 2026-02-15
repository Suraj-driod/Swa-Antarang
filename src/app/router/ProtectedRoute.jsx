import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    // If still loading AND no user, show spinner (initial load)
    // If user exists, render even if loading (allows faster transitions)
    if (loading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdf2f6]">
                <div className="w-10 h-10 border-4 border-[#59112e] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/ui/Login" replace />;
    }

    return <Outlet />;
}
