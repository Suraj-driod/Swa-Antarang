import { supabase } from './supabaseClient';

/**
 * Get the public URL for a product image stored in the 'product-images' bucket.
 * @param {string} imagePath - The path/filename inside the bucket, e.g. "rice-1kg.jpg"
 * @returns {string|null} Public URL or null if no path provided
 */
export function getProductImageUrl(imagePath) {
    if (!imagePath) return null;
    const { data } = supabase.storage.from('product-images').getPublicUrl(imagePath);
    return data?.publicUrl || null;
}

/**
 * Upload a product image to the 'product-images' bucket.
 * @param {File} file - The image file to upload
 * @param {string} fileName - Desired file name/path in the bucket
 * @returns {Promise<{url: string|null, error: Error|null}>}
 */
export async function uploadProductImage(file, fileName) {
    const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
        });
    if (error) return { url: null, error };
    return { url: getProductImageUrl(data.path), error: null };
}

/**
 * Get the public URL for an avatar image.
 * @param {string} imagePath - Path inside the 'avatars' bucket
 * @returns {string|null}
 */
export function getAvatarUrl(imagePath) {
    if (!imagePath) return null;
    const { data } = supabase.storage.from('avatars').getPublicUrl(imagePath);
    return data?.publicUrl || null;
}
