import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

// Load profile + merchant/driver profile id for the authenticated user
async function loadProfile(userId) {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !profile) return null;

    let merchantProfileId = null;
    let driverProfileId = null;

    if (profile.role === 'merchant') {
        const { data } = await supabase
            .from('merchant_profiles')
            .select('id')
            .eq('user_id', userId)
            .single();
        merchantProfileId = data?.id ?? null;
    } else if (profile.role === 'driver') {
        const { data } = await supabase
            .from('driver_profiles')
            .select('id')
            .eq('user_id', userId)
            .single();
        driverProfileId = data?.id ?? null;
    }

    return {
        id: profile.id,
        role: profile.role,
        email: profile.email,
        fullName: profile.full_name,
        phone: profile.phone,
        avatarUrl: profile.avatar_url,
        merchantProfileId,
        driverProfileId,
    };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        // 1. Explicit initial session check — getSession() is synchronous with localStorage,
        //    so it won't miss the window like onAuthStateChange INITIAL_SESSION can.
        const initSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (cancelled) return;

                if (session?.user) {
                    const profile = await loadProfile(session.user.id);
                    if (!cancelled) setUser(profile);
                }
            } catch (err) {
                console.error('Initial session check failed:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        initSession();

        // 2. Listen for subsequent auth changes (login, logout, token refresh).
        //    Skip INITIAL_SESSION since getSession() above handles it.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (cancelled || event === 'INITIAL_SESSION') return;

                if (session?.user) {
                    try {
                        const profile = await loadProfile(session.user.id);
                        if (!cancelled) setUser(profile);
                    } catch (err) {
                        console.error('Profile load on auth change failed:', err);
                        if (!cancelled) setUser(null);
                    }
                } else {
                    if (!cancelled) setUser(null);
                }
            }
        );

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        // Clear any stale session before attempting fresh login
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
            await supabase.auth.signOut();
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Load profile directly — don't rely on onAuthStateChange race
        if (data.session?.user) {
            const profile = await loadProfile(data.session.user.id);
            setUser(profile);
        }

        return data;
    };

    const signUp = async (email, password, metadata = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: metadata },
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
