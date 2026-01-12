
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
    try {
        const { apiKey } = await req.json();

        if (!apiKey) {
            return Response.json({ success: false, error: 'Missing API Key' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Note: listModels is on the generic API class or model manager?
        // The SDK might not expose listModels directly on the main instance easily in older versions, 
        // but let's try the standard way or just hardcode if SDK is limited. 
        // Actually, the SDK *does* allow it via modelManager but often it's simpler to just try standard ones 
        // if listing fails. 
        // Wait, for browser/node SDK:
        // const models = await genAI.getGenerativeModel({ model: "..." }); (No list method here)
        // We might need to use the REST API directly for listing models if the SDK is minimal.

        // Using REST API for listing models to be safe and thorough
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Failed to fetch models');
        }

        const data = await response.json();
        // Filter for models that support 'generateContent'
        const models = data.models
            .filter(m => m.supportedGenerationMethods.includes('generateContent'))
            .map(m => m.name.replace('models/', '')); // distinct id

        return Response.json({ success: true, models });

    } catch (error) {
        console.error("List Models Error:", error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
