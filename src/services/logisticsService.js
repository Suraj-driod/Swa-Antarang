import { supabase } from './supabaseClient';

// ── ONDC Requests ──

export async function createOndcRequest(orderId, merchantProfileId, costSlab) {
    const { data, error } = await supabase
        .from('ondc_requests')
        .insert({
            order_id: orderId,
            merchant_id: merchantProfileId,
            cost_slab: costSlab,
        })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getOpenOndcRequests() {
    // For ONDC drivers to see available requests
    const { data, error } = await supabase
        .from('ondc_requests')
        .select('*, orders(*, merchant_profiles!merchant_id(business_name, address, lat, lng))')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

export async function acceptOndcRequest(requestId, driverProfileId) {
    const { data, error } = await supabase
        .from('ondc_requests')
        .update({ status: 'accepted', driver_id: driverProfileId, updated_at: new Date().toISOString() })
        .eq('id', requestId)
        .select()
        .single();
    if (error) throw error;

    // Also create a delivery record
    if (data) {
        await supabase.from('deliveries').insert({
            order_id: data.order_id,
            driver_id: driverProfileId,
            status: 'pending',
        });
    }

    return data;
}

// ── Forward Logistics ──

export async function createForwardRequest(orderId, merchantProfileId, payload) {
    const { data, error } = await supabase
        .from('forward_logistics')
        .insert({
            order_id: orderId,
            merchant_id: merchantProfileId,
            provider: payload.provider,
            item_type: payload.itemType || null,
            weight_kg: payload.weightKg || null,
            status: 'requested',
        })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getForwardRequests(merchantProfileId) {
    const { data, error } = await supabase
        .from('forward_logistics')
        .select('*, orders(id, status, total_amount)')
        .eq('merchant_id', merchantProfileId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}
