import { verifyAuth } from '@/lib/authMiddleware';

/**
 * Basic content scraper to extract text from a URL
 */
async function fetchUrlContent(url) {
    try {
        console.log(`Fetching content from: ${url}`);
        const response = await fetch(url, { 
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' 
            },
            next: { revalidate: 0 } 
        });
        
        if (!response.ok) {
            console.error(`Failed to fetch ${url}: ${response.statusText}`);
            return '';
        }
        
        const html = await response.text();
        
        // Remove scripts, styles, and other non-content tags
        let text = html
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<nav[\s\S]*?<\/nav>/gi, '')
            .replace(/<footer[\s\S]*?<\/footer>/gi, '')
            .replace(/<header[\s\S]*?<\/header>/gi, '');

        // Extract text from paragraph and header tags mainly
        const matches = text.match(/<(p|h1|h2|h3|h4|h5|h6|li)[\s\S]*?>([\s\S]*?)<\/\1>/gi);
        if (matches) {
            text = matches
                .map(m => m.replace(/<[^>]+>/g, ' ').trim())
                .filter(m => m.length > 20) // Filter out noise
                .join('\n\n');
        } else {
            // Fallback: strip all tags
            text = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        }
        
        return text.substring(0, 8000); // Limit per site
    } catch (e) {
        console.error(`Scraping Error for ${url}:`, e);
        return '';
    }
}

/**
 * Calls Groq API for AI Synthesis
 */
async function synthesizeWithGroq(sources, groqKey) {
    const combinedContent = sources
        .map((s, i) => `--- SOURCE ${i+1} ---\nLink: ${s.url}\nContent: ${s.content}`)
        .join('\n\n');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { 
                    role: 'system', 
                    content: 'You are a professional tech blogger. Your job is to take multiple research sources and synthesize them into ONE high-quality, professional blog post in Markdown format. Ensure the narrative is cohesive and not just a collection of summaries. Always return valid JSON only.' 
                },
                { 
                    role: 'user', 
                    content: `
                    TASK: Synthesize the following source materials into a single comprehensive blog post.
                    
                    SOURCES:
                    ${combinedContent.substring(0, 15000)} // Safety limit
                    
                    REQUIREMENTS:
                    1. "title": Catchy, SEO-optimized title.
                    2. "slug": URL-friendly slug.
                    3. "excerpt": Catchy 1-2 sentence summary.
                    4. "category": Choose best fit (e.g., AI, Cybersecurity, Tech News).
                    5. "content": Full blog post in Markdown. Use H1 for title, H2 for sections. 
                    6. "coverImage": Suggest a high-quality free image URL (Unsplash/Picsum). Use picsum.photos/seed/[keyword]/1280/720 format.
                    
                    RETURN VALID JSON ONLY.
                    ` 
                }
            ],
            temperature: 0.7,
            max_tokens: 8000,
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Groq API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    
    try {
        return JSON.parse(content);
    } catch (e) {
        let jsonStr = content.replace(/```json/gi, '').replace(/```/g, '').trim();
        const firstOpen = jsonStr.indexOf('{');
        const lastClose = jsonStr.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose !== -1) {
            jsonStr = jsonStr.substring(firstOpen, lastClose + 1);
        }
        return JSON.parse(jsonStr);
    }
}

export async function POST(req) {
    try {
        const authResult = await verifyAuth(req);
        if (authResult.error) {
            return Response.json({ success: false, error: authResult.error }, { status: authResult.status });
        }

        const { links } = await req.json();
        
        if (!links || !Array.isArray(links) || links.length === 0) {
            return Response.json({ success: false, error: 'At least one link is required' }, { status: 400 });
        }

        const groqKey = (process.env.GROQ_API_KEY || '').replace(/['"]/g, '').trim();
        if (!groqKey) {
            return Response.json({ success: false, error: 'GROQ_API_KEY is not configured' }, { status: 500 });
        }

        // 1. Fetch content from all links concurrently
        console.log(`Starting multi-source fetch for ${links.length} links...`);
        const fetchResults = await Promise.all(
            links.map(async (url) => {
                const content = await fetchUrlContent(url);
                return { url, content };
            })
        );

        const validSources = fetchResults.filter(s => s.content.length > 100);
        if (validSources.length === 0) {
            return Response.json({ success: false, error: 'Could not extract enough content from the provided links.' }, { status: 400 });
        }

        // 2. Synthesize with Groq
        console.log(`Synthesizing blog from ${validSources.length} valid sources...`);
        const genData = await synthesizeWithGroq(validSources, groqKey);

        const finalBlogData = {
            ...genData,
            isAI: true,
            tags: ['AI', genData.category || 'Technology'],
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            createdAt: new Date().toISOString()
        };

        return Response.json({ success: true, data: finalBlogData });

    } catch (error) {
        console.error('Multi-Link Generation Error:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
