import { supabase } from './supabaseClient';

// ── Create Order (customer side) ──

export async function createOrder(merchantProfileId, customerId, items, shippingAddress, totalAmount) {
    // Insert order
    const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
            merchant_id: merchantProfileId,
            customer_id: customerId,
            type: 'b2c',
            status: 'pending',
            total_amount: totalAmount,
            shipping_address: shippingAddress,
        })
        .select()
        .single();
    if (orderErr) throw orderErr;

    // Insert order items
    const orderItems = items.map(item => ({
        order_id: order.id,
        inventory_listed_id: item.inventory_listed_id || null,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
    }));

    const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItems);
    if (itemsErr) throw itemsErr;

    return order;
}

// ── Merchant: get orders ──

export async function getOrdersByMerchant(merchantProfileId) {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*), profiles!customer_id(full_name, email, phone)')
        .eq('merchant_id', merchantProfileId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

// ── Customer: get own orders ──

export async function getMyOrders(customerId) {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*), merchant_profiles!merchant_id(business_name)')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

// ── Get single order status ──

export async function getOrderStatus(orderId) {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*), deliveries(*)')
        .eq('id', orderId)
        .single();
    if (error) throw error;
    return data;
}

// ── Merchant: confirm order (triggers inventory deduction via DB trigger) ──

export async function confirmOrder(orderId) {
    const { data, error } = await supabase
        .from('orders')
        .update({ status: 'confirmed', updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ── Merchant: set logistics type and assign ──

export async function setLogistics(orderId, logisticsType, driverProfileId = null) {
    const updates = {
        logistics_type: logisticsType,
        updated_at: new Date().toISOString(),
    };
    if (driverProfileId) updates.assigned_driver_id = driverProfileId;

    const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();
    if (error) throw error;

    // Auto-create delivery record when own_driver assigned
    if (logisticsType === 'own_driver' && driverProfileId) {
        await supabase.from('deliveries').insert({
            order_id: orderId,
            driver_id: driverProfileId,
            status: 'pending',
        });
    }

    return data;
}

// ── Cancel order ──

export async function cancelOrder(orderId) {
    const { data, error } = await supabase
        .from('orders')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ── Lookup order by QR code (used by driver scan) ──

export async function getOrderByQrCode(qrCode) {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*), merchant_profiles!merchant_id(business_name)')
        .eq('qr_code', qrCode)
        .single();
    if (error) throw error;
    return data;
}
