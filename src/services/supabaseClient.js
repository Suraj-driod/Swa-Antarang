import { createClient } from "@supabase/supabase-js";

const STORAGE_KEY = "swa-antarang-auth";

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            storage: window.localStorage,
            persistSession: true,
            storageKey: STORAGE_KEY,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    }
);

// Nuclear cleanup — wipe all Supabase auth traces from storage
export function nukeAuthStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // storage access denied — nothing to clean
    }
}

export { STORAGE_KEY };
