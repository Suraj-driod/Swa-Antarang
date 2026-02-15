import { supabase } from './supabaseClient';

// ── B2B Requests ──

export async function getB2bRequestsAsBuyer(merchantProfileId) {
    const { data, error } = await supabase
        .from('b2b_requests')
        .select('*, merchant_profiles!seller_merchant_id(business_name, lat, lng)')
        .eq('buyer_merchant_id', merchantProfileId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

export async function getB2bRequestsAsSeller(merchantProfileId) {
    const { data, error } = await supabase
        .from('b2b_requests')
        .select('*, merchant_profiles!buyer_merchant_id(business_name, lat, lng)')
        .eq('seller_merchant_id', merchantProfileId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

export async function createB2bRequest(buyerMerchantId, payload) {
    const { data, error } = await supabase
        .from('b2b_requests')
        .insert({
            buyer_merchant_id: buyerMerchantId,
            seller_merchant_id: payload.sellerMerchantId || null,
            item_ref: payload.itemRef,
            quantity: payload.quantity,
            offer_amount: payload.offerAmount || null,
            type: payload.type || 'direct',
        })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function updateB2bRequestStatus(requestId, status) {
    const { data, error } = await supabase
        .from('b2b_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', requestId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ── Refill Requests ──

export async function createRefillRequest(requesterMerchantId, inventoryRawId, quantity, supplierMerchantId = null) {
    const { data, error } = await supabase
        .from('refill_requests')
        .insert({
            requester_merchant_id: requesterMerchantId,
            supplier_merchant_id: supplierMerchantId,
            inventory_raw_id: inventoryRawId,
            quantity,
        })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getRefillRequests(merchantProfileId) {
    const { data, error } = await supabase
        .from('refill_requests')
        .select('*, inventory_raw(name, sku)')
        .eq('requester_merchant_id', merchantProfileId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}
