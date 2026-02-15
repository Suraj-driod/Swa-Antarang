import { supabase } from './supabaseClient';

// ── Driver: get assigned deliveries ──

export async function getAssignedDeliveries(driverProfileId) {
    const { data, error } = await supabase
        .from('deliveries')
        .select(`
            id, status, pickup_at, updated_at, gps_log, driver_id, order_id,
            orders!order_id (
                id, type, status, total_amount, shipping_address,
                merchant_profiles!merchant_id (id, business_name, address, lat, lng),
                order_items!order_id (id, product_name, quantity, unit_price)
            )
        `)
        .eq('driver_id', driverProfileId)
        .neq('status', 'delivered')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching assigned deliveries:', error);
        throw error;
    }
    return data;
}

export async function getDeliveryHistory(driverProfileId) {
    const { data, error } = await supabase
        .from('deliveries')
        .select(`
            id, status, delivered_at, updated_at, gps_log, driver_id, order_id,
            orders!order_id (
                id, type, status, total_amount,
                merchant_profiles!merchant_id (id, business_name)
            )
        `)
        .eq('driver_id', driverProfileId)
        .eq('status', 'delivered')
        .order('delivered_at', { ascending: false });
    if (error) {
        console.error('Error fetching delivery history:', error);
        throw error;
    }
    return data;
}

// ── Delivery lifecycle ──

export async function markPickedUp(deliveryId) {
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'picked_up', pickup_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', deliveryId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function markInTransit(deliveryId) {
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'in_transit', updated_at: new Date().toISOString() })
        .eq('id', deliveryId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function markDelivered(deliveryId, qrCode) {
    // Verify QR code matches the order
    const { data: delivery } = await supabase
        .from('deliveries')
        .select('order_id')
        .eq('id', deliveryId)
        .single();

    if (!delivery) throw new Error('Delivery not found');

    const { data: order } = await supabase
        .from('orders')
        .select('qr_code')
        .eq('id', delivery.order_id)
        .single();

    if (!order || order.qr_code !== qrCode) {
        throw new Error('QR code does not match');
    }

    // Mark delivered — DB trigger will also mark order as delivered
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'delivered', delivered_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', deliveryId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ── GPS tracking ──

export async function updateGps(deliveryId, lat, lng) {
    // Append to gps_log jsonb array
    const { data: current } = await supabase
        .from('deliveries')
        .select('gps_log')
        .eq('id', deliveryId)
        .single();

    const log = Array.isArray(current?.gps_log) ? current.gps_log : [];
    log.push({ lat, lng, ts: new Date().toISOString() });

    const { data, error } = await supabase
        .from('deliveries')
        .update({ gps_log: log, updated_at: new Date().toISOString() })
        .eq('id', deliveryId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ── Merchant: get delivery for an order ──

export async function getDeliveryByOrder(orderId) {
    const { data, error } = await supabase
        .from('deliveries')
        .select('*, driver_profiles(user_id, vehicle_type, profiles(full_name, phone))')
        .eq('order_id', orderId)
        .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
}

// ── Driver: verify QR and complete delivery in one step ──

export async function verifyAndCompleteByQR(qrCode, driverProfileId) {
    // 1. Find the order by qr_code
    const { data: order, error: orderErr } = await supabase
        .from('orders')
        .select('id, qr_code, merchant_id, merchant_profiles!merchant_id(business_name)')
        .eq('qr_code', qrCode)
        .single();
    if (orderErr || !order) throw new Error('Invalid QR code — no matching order found');

    // 2. Find the delivery assigned to this driver for this order
    const { data: delivery, error: delErr } = await supabase
        .from('deliveries')
        .select('id, status')
        .eq('order_id', order.id)
        .eq('driver_id', driverProfileId)
        .single();
    if (delErr || !delivery) throw new Error('No delivery assigned to you for this order');
    if (delivery.status === 'delivered') throw new Error('This delivery is already completed');

    // 3. Mark delivered — DB trigger will also update order status
    const { data: updated, error: updateErr } = await supabase
        .from('deliveries')
        .update({
            status: 'delivered',
            delivered_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', delivery.id)
        .select()
        .single();
    if (updateErr) throw updateErr;

    return {
        delivery: updated,
        order,
        merchantName: order.merchant_profiles?.business_name || 'Merchant',
    };
}

