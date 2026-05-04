import { verifyAuth } from '@/lib/authMiddleware';

// ---------------------------------------------------------------------------
// URL VALIDATION — SSRF prevention
// ---------------------------------------------------------------------------

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

function isPrivateIp(hostname) {
    // Reject bare numeric IPv4 (any format: decimal, hex, octal)
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
        const parts = hostname.split('.').map(Number);
        return (
            parts[0] === 10 ||
            parts[0] === 127 ||
            (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
            (parts[0] === 192 && parts[1] === 168) ||
            (parts[0] === 169 && parts[1] === 254) ||
            hostname === '0.0.0.0'
        );
    }
    // Reject IPv6 loopback / link-local
    if (hostname === '::1' || hostname.startsWith('fe80') || hostname.startsWith('[')) return true;
    // Reject well-known internal hostnames
    const blocked = ['localhost', 'metadata.google.internal'];
    return blocked.includes(hostname);
}

function validatePublicUrl(raw) {
    if (!raw || typeof raw !== 'string') {
        return { ok: false, url: null, reason: 'URL must be a non-empty string' };
    }
    let parsed;
    try {
        parsed = new URL(raw);
    } catch {
        return { ok: false, url: null, reason: 'Malformed URL' };
    }
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
        return { ok: false, url: null, reason: 'Only http and https URLs are permitted' };
    }
    if (isPrivateIp(parsed.hostname.toLowerCase())) {
        return { ok: false, url: null, reason: 'Requests to private or internal addresses are not allowed' };
    }
    return { ok: true, url: parsed };
}

// ---------------------------------------------------------------------------
// HTML → plain text extraction
// ---------------------------------------------------------------------------

function stripAllHtml(html) {
    return html
        .replace(/<[^>]*>/g, ' ')   // strip tags FIRST — prevents decoded entities forming new tags
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

// ---------------------------------------------------------------------------
// CONTENT SCRAPER
// ---------------------------------------------------------------------------

async function fetchUrlContent(validatedUrl) {
    // Reconstruct URL from parsed, validated components — never use raw user string.
    const safeUrl = new URL(
        `${validatedUrl.protocol}//${validatedUrl.host}${validatedUrl.pathname}${validatedUrl.search}`
    );
    try {
        const response = await fetch(safeUrl.href, {
            headers: { 'User-Agent': 'PortfolioBot/1.0 (blog-generator; +https://kushyanthpothi.dev)' },
            next: { revalidate: 0 },
            signal: AbortSignal.timeout(10_000)
        });

        if (!response.ok) {
            console.warn(`[fetchUrlContent] HTTP ${response.status} from host: ${validatedUrl.hostname}`);
            return '';
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('text/')) {
            console.warn(`[fetchUrlContent] Skipped non-text content-type: ${contentType}`);
            return '';
        }

        const html = await response.text();
        return stripAllHtml(html).substring(0, 8_000);
    } catch (err) {
        console.error(`[fetchUrlContent] Error fetching ${validatedUrl.hostname}: ${err.message}`);
        return '';
    }
}

// ---------------------------------------------------------------------------
// AI PROVIDERS — NVIDIA (primary) → Groq (fallback)
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT =
    'You are a professional tech blogger. Your job is to take multiple research sources and ' +
    'synthesize them into ONE high-quality, professional blog post in Markdown format. ' +
    'Ensure the narrative is cohesive and not just a collection of summaries. Always return valid JSON only.';

function buildUserPrompt(combinedContent) {
    return `TASK: Synthesize the following source materials into a single comprehensive blog post.

SOURCES:
${combinedContent.substring(0, 15_000)}

REQUIREMENTS:
1. "title": Catchy, SEO-optimized title.
2. "slug": URL-friendly slug.
3. "excerpt": Catchy 1-2 sentence summary.
4. "category": Choose best fit (e.g., AI, Cybersecurity, Tech News).
5. "content": Full blog post in Markdown. Use H1 for title, H2 for sections.
6. "coverImage": Use picsum.photos/seed/[keyword]/1280/720 format.

RETURN VALID JSON ONLY.`;
}

function parseAIContent(content) {
    try {
        return JSON.parse(content);
    } catch {
        let jsonStr = content.replace(/```json/gi, '').replace(/```/g, '').trim();
        const firstOpen = jsonStr.indexOf('{');
        const lastClose = jsonStr.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose !== -1) {
            jsonStr = jsonStr.substring(firstOpen, lastClose + 1);
        }
        return JSON.parse(jsonStr);
    }
}

/**
 * Calls NVIDIA NIM API (OpenAI-compatible).
 * Key is read from the NVIDIA_KEY environment variable.
 */
async function callNvidiaAPI(messages, nvidiaKey) {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${nvidiaKey}`,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            model: 'meta/llama-4-maverick-17b-128e-instruct',
            messages,
            max_tokens: 8000,
            temperature: 1.00,
            top_p: 1.00,
            frequency_penalty: 0.00,
            presence_penalty: 0.00,
            stream: false
        })
    });

    if (!response.ok) {
        await response.text();
        throw new Error(`NVIDIA API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('NVIDIA API returned an empty response');
    return parseAIContent(content);
}

/**
 * Calls Groq API. Used as fallback when NVIDIA is unavailable.
 */
async function callGroqAPI(messages, groqKey) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages,
            temperature: 1,
            max_completion_tokens: 8000,
            top_p: 1,
            stop: null,
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        await response.text();
        throw new Error(`Groq API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Groq API returned an empty response');
    return parseAIContent(content);
}

/**
 * Synthesizes sources into a blog post. Tries NVIDIA first; falls back to Groq.
 */
async function synthesizeWithAI(sources, nvidiaKey, groqKey) {
    const combinedContent = sources
        .map((s, i) => `--- SOURCE ${i + 1} ---\nLink: ${s.url}\nContent: ${s.content}`)
        .join('\n\n');

    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: buildUserPrompt(combinedContent) }
    ];

    if (nvidiaKey) {
        try {
            console.log('[generate-blog-from-links] Using NVIDIA API...');
            return await callNvidiaAPI(messages, nvidiaKey);
        } catch (err) {
            console.warn(`[generate-blog-from-links] NVIDIA failed (${err.message}). Falling back to Groq...`);
        }
    }

    if (!groqKey) {
        throw new Error('NVIDIA API failed and GROQ_API_KEY is not configured.');
    }

    console.log('[generate-blog-from-links] Using Groq API (fallback)...');
    return await callGroqAPI(messages, groqKey);
}

// ---------------------------------------------------------------------------
// ROUTE HANDLER
// ---------------------------------------------------------------------------

const MAX_LINKS = 10;

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

        if (links.length > MAX_LINKS) {
            return Response.json({ success: false, error: `A maximum of ${MAX_LINKS} links is allowed per request` }, { status: 400 });
        }

        const validatedLinks = [];
        for (const raw of links) {
            const { ok, url, reason } = validatePublicUrl(raw);
            if (!ok) {
                return Response.json({ success: false, error: `Invalid URL "${String(raw).substring(0, 100)}": ${reason}` }, { status: 400 });
            }
            validatedLinks.push(url);
        }

        const nvidiaKey = (process.env.NVIDIA_KEY || '').replace(/['"]/g, '').trim() || null;
        const groqKey   = (process.env.GROQ_API_KEY || '').replace(/['"]/g, '').trim() || null;

        if (!nvidiaKey && !groqKey) {
            return Response.json({ success: false, error: 'No AI provider configured on the server.' }, { status: 500 });
        }

        console.log(`[generate-blog-from-links] Fetching ${validatedLinks.length} source(s)...`);
        const fetchResults = await Promise.all(
            validatedLinks.map(async (url) => {
                const content = await fetchUrlContent(url);
                return { url: url.href, content };
            })
        );

        const validSources = fetchResults.filter(s => s.content.length > 100);
        if (validSources.length === 0) {
            return Response.json({ success: false, error: 'Could not extract enough content from the provided links.' }, { status: 400 });
        }

        console.log(`[generate-blog-from-links] Synthesizing from ${validSources.length} valid source(s)...`);
        const genData = await synthesizeWithAI(validSources, nvidiaKey, groqKey);

        const finalBlogData = {
            ...genData,
            isAI: true,
            tags: ['AI', genData.category || 'Technology'],
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            createdAt: new Date().toISOString()
        };

        return Response.json({ success: true, data: finalBlogData });

    } catch (error) {
        console.error('[generate-blog-from-links] Error:', error.message);
        return Response.json({ success: false, error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
    }
}
