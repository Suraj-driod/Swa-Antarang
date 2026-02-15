import { supabase } from './supabaseClient';

// ── Subscribe to delivery completions for a merchant's orders ──

export function subscribeToDeliveryUpdates(merchantProfileId, onDelivered) {
    const channel = supabase
        .channel(`merchant-deliveries-${merchantProfileId}`)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'deliveries',
                filter: `status=eq.delivered`,
            },
            async (payload) => {
                // Fetch order details to check if it belongs to this merchant
                const { data: order } = await supabase
                    .from('orders')
                    .select('*, order_items(*), merchant_profiles!merchant_id(id, business_name)')
                    .eq('id', payload.new.order_id)
                    .single();

                if (order && order.merchant_id === merchantProfileId) {
                    onDelivered({
                        deliveryId: payload.new.id,
                        orderId: payload.new.order_id,
                        deliveredAt: payload.new.delivered_at,
                        order,
                    });
                }
            }
        )
        .subscribe();

    return channel;
}

export function unsubscribeChannel(channel) {
    if (channel) {
        supabase.removeChannel(channel);
    }
}
