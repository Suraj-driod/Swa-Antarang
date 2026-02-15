import { supabase } from './supabaseClient';

// ── Broadcasts ──

export async function createBroadcast(merchantProfileId, payload) {
    const { data, error } = await supabase
        .from('propagation_broadcasts')
        .insert({
            merchant_id: merchantProfileId,
            item_name: payload.itemName,
            radius_km: payload.radiusKm,
            min_price: payload.minPrice || null,
            max_price: payload.maxPrice || null,
            delivery_days_max: payload.deliveryDaysMax || null,
        })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getMyBroadcasts(merchantProfileId) {
    const { data, error } = await supabase
        .from('propagation_broadcasts')
        .select('*, propagation_responses(count)')
        .eq('merchant_id', merchantProfileId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

export async function closeBroadcast(broadcastId) {
    const { data, error } = await supabase
        .from('propagation_broadcasts')
        .update({ status: 'closed' })
        .eq('id', broadcastId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ── Responses (seller side) ──

export async function getActiveBroadcasts() {
    // Any merchant can see active broadcasts
    const { data, error } = await supabase
        .from('propagation_broadcasts')
        .select('*, merchant_profiles(business_name, lat, lng)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

export async function submitResponse(broadcastId, sellerMerchantId, payload) {
    const { data, error } = await supabase
        .from('propagation_responses')
        .insert({
            broadcast_id: broadcastId,
            seller_merchant_id: sellerMerchantId,
            item_name: payload.itemName,
            price: payload.price,
            delivery_days: payload.deliveryDays || null,
            distance_km: payload.distanceKm || null,
        })
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ── Responses (buyer side — matches for swiping) ──

export async function getResponsesForBroadcast(broadcastId) {
    const { data, error } = await supabase
        .from('propagation_responses')
        .select('*, merchant_profiles!seller_merchant_id(business_name, lat, lng)')
        .eq('broadcast_id', broadcastId)
        .eq('status', 'pending')
        .order('distance_km', { ascending: true });
    if (error) throw error;
    return data;
}

export async function getMatchesForBuyer(merchantProfileId) {
    // All pending responses to this merchant's active broadcasts
    const { data, error } = await supabase
        .from('propagation_responses')
        .select('*, propagation_broadcasts!inner(merchant_id, item_name), merchant_profiles!seller_merchant_id(business_name, lat, lng)')
        .eq('propagation_broadcasts.merchant_id', merchantProfileId)
        .neq('seller_merchant_id', merchantProfileId)
        .eq('status', 'pending')
        .order('distance_km', { ascending: true });
    if (error) throw error;
    return data;
}

export async function acceptResponse(responseId) {
    const { data, error } = await supabase
        .from('propagation_responses')
        .update({ status: 'accepted' })
        .eq('id', responseId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function rejectResponse(responseId) {
    const { data, error } = await supabase
        .from('propagation_responses')
        .update({ status: 'rejected' })
        .eq('id', responseId)
        .select()
        .single();
    if (error) throw error;
    return data;
}
