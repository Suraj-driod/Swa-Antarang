import { supabase } from './supabaseClient';

// Find or create a 1:1 conversation between two merchants
export async function getOrCreateConversation(merchantA, merchantB, contextItem = '') {
    const [a, b] = [merchantA, merchantB].sort();

    let { data: existing } = await supabase
        .from('merchant_conversations')
        .select('*')
        .eq('participant_a', a)
        .eq('participant_b', b)
        .maybeSingle();

    if (existing) return existing;

    // Check reverse just in case
    ({ data: existing } = await supabase
        .from('merchant_conversations')
        .select('*')
        .eq('participant_a', b)
        .eq('participant_b', a)
        .maybeSingle());

    if (existing) return existing;

    const { data, error } = await supabase
        .from('merchant_conversations')
        .insert({ participant_a: a, participant_b: b, context_item: contextItem })
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Get all conversations for a merchant, with the other party's name resolved
export async function getMyConversations(merchantProfileId) {
    const { data, error } = await supabase
        .from('merchant_conversations')
        .select('*')
        .or(`participant_a.eq.${merchantProfileId},participant_b.eq.${merchantProfileId}`)
        .order('updated_at', { ascending: false });
    if (error) throw error;

    const otherIds = [...new Set(data.map(c =>
        c.participant_a === merchantProfileId ? c.participant_b : c.participant_a
    ))];

    if (otherIds.length === 0) return [];

    const { data: profiles } = await supabase
        .from('merchant_profiles')
        .select('id, business_name')
        .in('id', otherIds);

    const nameMap = {};
    (profiles || []).forEach(p => { nameMap[p.id] = p.business_name; });

    return data.map(c => {
        const otherId = c.participant_a === merchantProfileId ? c.participant_b : c.participant_a;
        return { ...c, otherMerchantId: otherId, otherName: nameMap[otherId] || 'Unknown' };
    });
}

// Get all messages in a conversation
export async function getMessages(conversationId) {
    const { data, error } = await supabase
        .from('merchant_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
}

// Send a message and update conversation timestamp + preview
export async function sendMessage(conversationId, senderMerchantId, content) {
    const { data, error } = await supabase
        .from('merchant_messages')
        .insert({ conversation_id: conversationId, sender_id: senderMerchantId, content })
        .select()
        .single();
    if (error) throw error;

    await supabase
        .from('merchant_conversations')
        .update({ updated_at: new Date().toISOString(), last_message: content })
        .eq('id', conversationId);

    return data;
}

// Realtime subscription — returns an unsubscribe function
export function subscribeToMessages(conversationId, callback) {
    const channel = supabase
        .channel(`messages:${conversationId}`)
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'merchant_messages',
            filter: `conversation_id=eq.${conversationId}`,
        }, (payload) => callback(payload.new))
        .subscribe();

    return () => supabase.removeChannel(channel);
}
