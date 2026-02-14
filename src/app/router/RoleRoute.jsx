import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';

export default function RoleRoute({ allowedRole }) {
    const { user } = useAuth();

    if (!user || user.role !== allowedRole) {
        return <Navigate to="/ui/Login" replace />;
    }

    return <Outlet />;
}
