import { supabase } from './supabaseClient';

// ── Raw Inventory ──

export async function getRawInventory(merchantProfileId) {
    const { data, error } = await supabase
        .from('inventory_raw')
        .select('*')
        .eq('merchant_id', merchantProfileId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

export async function upsertRawItem(merchantProfileId, item) {
    const payload = {
        ...item,
        merchant_id: merchantProfileId,
        updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
        .from('inventory_raw')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function deleteRawItem(id) {
    const { error } = await supabase.from('inventory_raw').delete().eq('id', id);
    if (error) throw error;
}

// ── Listed Inventory ──

export async function getListedInventory(merchantProfileId) {
    const { data, error } = await supabase
        .from('inventory_listed')
        .select('*')
        .eq('merchant_id', merchantProfileId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

export async function upsertListedItem(merchantProfileId, item) {
    const payload = {
        ...item,
        merchant_id: merchantProfileId,
        updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
        .from('inventory_listed')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function deleteListedItem(id) {
    const { error } = await supabase.from('inventory_listed').delete().eq('id', id);
    if (error) throw error;
}

// ── Image update ──

export async function updateListedItemImage(itemId, imagePath) {
    const { data, error } = await supabase
        .from('inventory_listed')
        .update({ image_url: imagePath, updated_at: new Date().toISOString() })
        .eq('id', itemId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ── Stock update helpers ──

export async function updateRawStock(itemId, newStock) {
    const status = newStock <= 0 ? 'out_of_stock' : newStock < 10 ? 'low_stock' : 'in_stock';
    const { data, error } = await supabase
        .from('inventory_raw')
        .update({ stock: newStock, status, updated_at: new Date().toISOString() })
        .eq('id', itemId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function updateListedStock(itemId, newStock) {
    const { data, error } = await supabase
        .from('inventory_listed')
        .update({ stock: newStock, updated_at: new Date().toISOString() })
        .eq('id', itemId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ── Bulk inserts (for Excel import) ──

export async function bulkInsertRawItems(merchantProfileId, items) {
    const payload = items.map(item => ({
        merchant_id: merchantProfileId,
        name: item.name,
        sku: item.sku || null,
        stock: parseInt(item.stock) || 0,
        unit: item.unit || 'pcs',
        supplier_name: item.supplier_name || null,
        status: (parseInt(item.stock) || 0) <= 0 ? 'out_of_stock' : (parseInt(item.stock) || 0) < 10 ? 'low_stock' : 'in_stock',
    }));
    const { data, error } = await supabase
        .from('inventory_raw')
        .insert(payload)
        .select();
    if (error) throw error;
    return data;
}

export async function bulkInsertListedItems(merchantProfileId, items) {
    const payload = items.map(item => ({
        merchant_id: merchantProfileId,
        name: item.name,
        sku: item.sku || null,
        price: parseFloat(item.price) || 0,
        stock: parseInt(item.stock) || 0,
        unit: item.unit || 'pcs',
        platform: item.platform || null,
        category: item.category || null,
    }));
    const { data, error } = await supabase
        .from('inventory_listed')
        .insert(payload)
        .select();
    if (error) throw error;
    return data;
}

// Browse listed inventory (for customers — no merchant filter)
export async function browseListedInventory() {
    const { data, error } = await supabase
        .from('inventory_listed')
        .select('*, merchant_profiles(business_name, lat, lng)')
        .gt('stock', 0)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}
