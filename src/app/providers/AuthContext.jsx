import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, nukeAuthStorage } from '../../services/supabaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

// Fetch profile + role-specific sub-profile id
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
    const mountedRef = useRef(true);

    // Local-only signout — no network call, just clear storage + state
    const cleanSession = useCallback(async () => {
        try { await supabase.auth.signOut({ scope: 'local' }); } catch { /* swallow */ }
        nukeAuthStorage();
        if (mountedRef.current) setUser(null);
    }, []);

    // ── Bootstrap: restore + validate session on mount ──
    useEffect(() => {
        mountedRef.current = true;

        const bootstrap = async () => {
            try {
                // 1. Read session from localStorage (no network call in v2)
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    // Nothing stored — fresh visitor
                    return;
                }

                // 2. Validate with the server — this refreshes expired tokens automatically
                const { data: { user: authUser }, error: userError } =
                    await supabase.auth.getUser();

                if (!mountedRef.current) return;

                if (userError || !authUser) {
                    // Token is truly dead — nuke everything
                    await cleanSession();
                    return;
                }

                // 3. Token valid — hydrate profile
                const profile = await loadProfile(authUser.id);
                if (!mountedRef.current) return;

                if (profile) {
                    setUser(profile);
                } else {
                    await cleanSession();
                }
            } catch (err) {
                console.warn('Auth bootstrap failed:', err.message);
                if (mountedRef.current) {
                    nukeAuthStorage();
                    setUser(null);
                }
            } finally {
                if (mountedRef.current) setLoading(false);
            }
        };

        // Safety: if bootstrap hangs >10s, force loading off so the user isn't stuck
        const safetyTimer = setTimeout(() => {
            if (mountedRef.current) setLoading(false);
        }, 10000);

        bootstrap().finally(() => clearTimeout(safetyTimer));

        // Listen for auth events AFTER bootstrap
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mountedRef.current) return;
                if (event === 'INITIAL_SESSION') return;

                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    return;
                }

                if (event === 'TOKEN_REFRESHED' && session?.user) {
                    try {
                        console.log('🔄 Token refreshed, updating profile cache');
                        const profile = await loadProfile(session.user.id);
                        if (mountedRef.current) {
                            if (profile) setUser(profile);
                            else await cleanSession();
                        }
                    } catch (err) {
                        console.error('❌ Profile refresh failed:', err.message);
                        if (mountedRef.current) await cleanSession();
                    }
                }
            }
        );

        return () => {
            mountedRef.current = false;
            subscription.unsubscribe();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Login: clear stale session first, then sign in ──
    const login = useCallback(async (email, password) => {
        // Manually clear Supabase auth cookies to prevent ghost cookies interfering with new login
        document.cookie = 'sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'sb-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Kill any stale/expired session globally to prevent conflicts
        try {
            const { data: { session: existing } } = await supabase.auth.getSession();
            if (existing) {
                await supabase.auth.signOut({ scope: 'global' });
                nukeAuthStorage();
            }
        } catch { /* safe to ignore */ }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            nukeAuthStorage();
            throw error;
        }

        const profile = await loadProfile(data.session.user.id);
        if (!profile) {
            await cleanSession();
            throw new Error('Profile not found. Please sign up first.');
        }

        setUser(profile);
        return { ...data, profile };
    }, [cleanSession]);

    // ── Sign Up ──
    const signUp = useCallback(async (email, password, metadata = {}) => {
        // Clear any stale session first
        try {
            const { data: { session: existing } } = await supabase.auth.getSession();
            if (existing) {
                await supabase.auth.signOut({ scope: 'local' });
                nukeAuthStorage();
            }
        } catch { /* safe to ignore */ }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: metadata },
        });
        if (error) throw error;

        if (data.session?.user) {
            await new Promise(r => setTimeout(r, 800));
            const profile = await loadProfile(data.session.user.id);
            if (profile) setUser(profile);
        }

        return data;
    }, []);

    // ── Logout ──
    const logout = useCallback(async () => {
        setUser(null);
        try { await supabase.auth.signOut(); } catch { /* swallow */ }
        nukeAuthStorage();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
