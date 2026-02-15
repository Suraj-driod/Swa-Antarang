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
