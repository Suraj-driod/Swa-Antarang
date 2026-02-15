import { supabase } from './supabaseClient';

// ── Get merchant profile by user id ──

export async function getMerchantProfile(userId) {
    const { data, error } = await supabase
        .from('merchant_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

// ── Update merchant profile ──

export async function updateMerchantProfile(merchantProfileId, updates) {
    const { data, error } = await supabase
        .from('merchant_profiles')
        .update(updates)
        .eq('id', merchantProfileId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ── Get driver profile by user id ──

export async function getDriverProfile(userId) {
    const { data, error } = await supabase
        .from('driver_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

// ── Update driver profile ──

export async function updateDriverProfile(driverProfileId, updates) {
    const { data, error } = await supabase
        .from('driver_profiles')
        .update(updates)
        .eq('id', driverProfileId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ── Get user profile ──

export async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data;
}

// ── Update user profile ──

export async function updateProfile(userId, updates) {
    const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
    if (error) throw error;
    return data;
}
