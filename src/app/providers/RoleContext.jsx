import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext(null);

export const useRole = () => {
    const ctx = useContext(RoleContext);
    if (!ctx) throw new Error('useRole must be used within RoleProvider');
    return ctx;
};

export function RoleProvider({ children }) {
    const { user } = useAuth();
    const role = user?.role || null;

    const isMerchant = role === 'merchant';
    const isDriver = role === 'driver';
    const isCustomer = role === 'customer';

    return (
        <RoleContext.Provider value={{ role, isMerchant, isDriver, isCustomer }}>
            {children}
        </RoleContext.Provider>
    );
}

export default RoleContext;
