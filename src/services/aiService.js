const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

// ── System prompts per role ──
const ROLE_CONTEXTS = {
    merchant: `You are Swa-Antarang AI Assistant for merchants. You help with:
- Managing inventory (adding products, updating stock, pricing)
- Understanding order status and delivery tracking
- Route optimization tips (deliveries, ONDC logistics)
- B2B propagation and requests
- Business insights and analytics
Keep answers concise, helpful, and relevant to Indian SMB commerce. Use ₹ for currency.`,

    driver: `You are Swa-Antarang AI Assistant for delivery drivers. You help with:
- Understanding delivery routes and navigation
- Order pickup and delivery procedures
- QR code scanning for delivery verification
- Managing delivery status updates
- Traffic and route optimization tips
Keep answers brief and practical for someone on the road.`,

    customer: `You are Swa-Antarang AI Assistant for customers. You help with:
- Finding products and browsing inventory
- Understanding order status and tracking
- Placing orders and managing cart
- Delivery estimates and tracking
- General shopping assistance
Keep answers friendly, helpful, and concise.`,
};

// ── Chat with Gemini ──
export async function chatWithGemini(messages, role = 'customer') {
    try {
        const systemPrompt = ROLE_CONTEXTS[role] || ROLE_CONTEXTS.customer;

        // Build conversation contents
        const contents = [];

        // Add system instruction as first user message context
        contents.push({
            role: 'user',
            parts: [{ text: `System context: ${systemPrompt}\n\nNow respond to the following conversation naturally.` }],
        });
        contents.push({
            role: 'model',
            parts: [{ text: 'Understood! I\'m the Swa-Antarang AI assistant. How can I help you today?' }],
        });

        // Add conversation history
        for (const msg of messages) {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            });
        }

        const res = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
            }),
        });

        const data = await res.json();

        if (data.candidates && data.candidates.length > 0) {
            const text = data.candidates[0].content?.parts?.[0]?.text;
            return text || 'I couldn\'t generate a response. Please try again.';
        }

        if (data.error) {
            console.error('Gemini API error:', data.error);
            return `Sorry, I encountered an error: ${data.error.message || 'Unknown error'}`;
        }

        return 'I couldn\'t generate a response. Please try again.';
    } catch (err) {
        console.error('Gemini chat error:', err);
        return 'Sorry, I\'m having trouble connecting. Please check your internet connection and try again.';
    }
}

// ── Process Excel inventory data with Gemini ──
export async function processExcelInventory(sheetData, targetType = 'raw') {
    const schemaRaw = `{ "name": string, "sku": string|null, "stock": number, "unit": string (default "pcs"), "supplier_name": string|null }`;
    const schemaListed = `{ "name": string, "sku": string|null, "price": number, "stock": number, "unit": string (default "pcs"), "platform": string|null, "category": string|null }`;

    const schema = targetType === 'raw' ? schemaRaw : schemaListed;
    const tableName = targetType === 'raw' ? 'inventory_raw (Raw Materials)' : 'inventory_listed (Listed Products)';

    const prompt = `You are an inventory data parser. Given this spreadsheet data (JSON array of row objects), extract ALL items and return them as a JSON array for ${tableName}.

Output schema per item: ${schema}

Column mapping rules:
- Any column with "item", "name", "product", "material", "raw", "listed" in its header → "name"
- "qty", "quantity", "amount", "count" → "stock"  
- "rate", "cost", "mrp", "price" → "price" (strip ₹/$/Rs symbols, number only)
- "vendor", "supplier" → "supplier_name"
- "sku", "code", "id" → "sku"
- "unit" → "unit"
- "platform" → "platform"
- "category", "type" → "category"

SKU rule: If no SKU column exists in input, generate a random SKU for each item in format "SKU-XXXXX" where X is uppercase alphanumeric (e.g. "SKU-A8F3K"). Every item MUST have a sku value.

IMPORTANT: Return ONLY a raw JSON array. No markdown, no backticks, no explanation. Example: [{"name":"Nails","sku":"SKU-R9K2M","stock":100,"unit":"pcs"}]

Input data:
${JSON.stringify(sheetData)}`;

    const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 8192,
            },
        }),
    });

    const data = await res.json();
    console.log('[Excel AI] Gemini raw response:', data);

    if (data.error) {
        throw new Error(`Gemini API: ${data.error.message || JSON.stringify(data.error)}`);
    }

    if (data.candidates && data.candidates.length > 0) {
        let text = data.candidates[0].content?.parts?.[0]?.text || '[]';
        console.log('[Excel AI] Gemini text:', text);
        // Strip markdown code fences if present
        text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        try {
            return JSON.parse(text);
        } catch (parseErr) {
            console.error('[Excel AI] JSON parse failed on:', text);
            throw new Error(`AI returned invalid JSON: ${text.slice(0, 200)}`);
        }
    }

    throw new Error('No response from Gemini AI');
}

// ── Enhance product description with AI ──
export async function enhanceProductDescription(productName, category) {
    try {
        const prompt = `Write a short, compelling 2-line product description for an Indian marketplace listing:
Product: ${productName}
Category: ${category || 'General'}
Keep it professional, highlight quality, and use simple English. No emojis.`;

        const res = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 200,
                },
            }),
        });

        const data = await res.json();
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content?.parts?.[0]?.text || '';
        }
        return '';
    } catch (err) {
        console.error('Product description error:', err);
        return '';
    }
}
