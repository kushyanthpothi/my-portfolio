import { verifyAuth } from '@/lib/authMiddleware';
import dns from 'dns';
import { promisify } from 'util';

const lookupAsync = promisify(dns.lookup);


// ---------------------------------------------------------------------------
// URL VALIDATION — SSRF prevention
// ---------------------------------------------------------------------------

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

function isPrivateIp(hostname) {
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
    if (hostname === '::1' || hostname.startsWith('fe80') || hostname.startsWith('[')) return true;
    return ['localhost', 'metadata.google.internal'].includes(hostname);
}

async function validatePublicUrl(raw) {
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

    const hostname = parsed.hostname.toLowerCase();
    if (isPrivateIp(hostname)) {
        return { ok: false, url: null, reason: 'Requests to private or internal addresses are not allowed' };
    }

    // Resolve DNS to verify the final IP and prevent DNS-rebinding SSRF attacks
    try {
        const lookup = await lookupAsync(hostname);
        if (isPrivateIp(lookup.address)) {
            return { ok: false, url: null, reason: 'Requests to private or internal addresses are not allowed' };
        }
    } catch {
        return { ok: false, url: null, reason: 'Could not resolve hostname' };
    }

    return { ok: true, url: parsed };
}

// ---------------------------------------------------------------------------
// IMAGE EXTRACTION — pull og:image / twitter:image from raw HTML
// ---------------------------------------------------------------------------

function extractImageFromHtml(html) {
    // Priority: og:image > twitter:image > first large <img>
    const patterns = [
        // og:image (both attribute orderings)
        /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
        /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
        // twitter:image
        /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
        /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
        // twitter:image:src
        /<meta[^>]*name=["']twitter:image:src["'][^>]*content=["']([^"']+)["']/i,
    ];

    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
            const url = match[1].trim();
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }
        }
    }
    return null;
}

// ---------------------------------------------------------------------------
// CONTENT SCRAPER
// ---------------------------------------------------------------------------

async function fetchUrlContent(validatedUrl) {
    const safeUrl = new URL(
        `${validatedUrl.protocol}//${validatedUrl.host}${validatedUrl.pathname}${validatedUrl.search}`
    );
    try {
        const response = await fetch(safeUrl.href, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)' },
            next: { revalidate: 0 },
            signal: AbortSignal.timeout(10_000)
        });

        if (!response.ok) {
            console.warn(`[fetchUrlContent] HTTP ${response.status} from ${validatedUrl.hostname}`);
            return { text: '', image: null };
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('text/')) {
            console.warn(`[fetchUrlContent] Skipped non-text content-type: ${contentType}`);
            return { text: '', image: null };
        }

        const html = await response.text();
        const image = extractImageFromHtml(html);

        const cleanHtml = html.replace(/<[^>]*>/g, ' ');
        const entityMap = {
            '&nbsp;': ' ',
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'"
        };
        const text = cleanHtml
            .replace(/&(nbsp|amp|lt|gt|quot|#39);/gi, (match) => entityMap[match.toLowerCase()] || match)
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 8_000);

        return { text, image };
    } catch (err) {
        console.error(`[fetchUrlContent] Error fetching ${validatedUrl.hostname}: ${err.message}`);
        return { text: '', image: null };
    }
}

// ---------------------------------------------------------------------------
// FIRESTORE — fetch API keys if not in environment
// ---------------------------------------------------------------------------

async function resolveApiKeys() {
    let nvidiaKey = (process.env.NVIDIA_KEY || '').replace(/['"]/g, '').trim() || null;
    let groqKey   = (process.env.GROQ_API_KEY || '').replace(/['"]/g, '').trim() || null;

    if (!nvidiaKey || !groqKey) {
        try {
            const adminMod = await import('@/lib/admin');
            const db = adminMod.db ?? adminMod.default?.db;
            if (db) {
                const snap = await db.collection('settings').doc('ai_automation').get();
                if (snap.exists) {
                    const s = snap.data();
                    if (!nvidiaKey && s.nvidiaApiKey) nvidiaKey = s.nvidiaApiKey.trim();
                    if (!groqKey  && s.groqApiKey)   groqKey   = s.groqApiKey.trim();
                }
            }
        } catch (err) {
            console.error('[generate-blog-from-links] Firestore key fetch failed:', err.message);
        }
    }

    return { nvidiaKey, groqKey };
}

// ---------------------------------------------------------------------------
// AI PIPELINE — same multi-stage approach as run-auto-blog.js
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = 'You are an expert AI assistant. Always respond with valid JSON only. Never include markdown code blocks.';

function buildAnalyzeMessages(research) {
    return [
        { role: 'system', content: SYSTEM_PROMPT },
        {
            role: 'user',
            content: `Analyze the following source content and determine the best article angle.

SOURCE CONTENT:
${JSON.stringify(research)}

IMPORTANT: Determine the MOST APPROPRIATE category. Choose ONE from:
- Artificial Intelligence
- Cybersecurity
- Mobile Technology
- Space & Science
- Startups & Business
- Cryptocurrency
- Software Development
- Gaming
- Hardware
- Cloud Computing
- Internet of Things
- AR/VR
- Data Science
- Technology (only if none of the above fit)

Return ONLY valid JSON without markdown:
{
    "mainAngle": "the core article angle or story",
    "category": "CHOOSE APPROPRIATE CATEGORY FROM LIST ABOVE",
    "keyPoints": ["point1", "point2", "point3"],
    "outline": ["intro", "section1", "section2", "conclusion"],
    "hook": "a compelling opening hook sentence",
    "tone": "informative"
}`
        }
    ];
}

function buildMetadataMessages(research, analysis, coverImage) {
    return [
        { role: 'system', content: SYSTEM_PROMPT },
        {
            role: 'user',
            content: `Create blog post metadata based on the analysis.

ANALYSIS: ${JSON.stringify(analysis)}
SOURCE CONTENT SUMMARY: ${JSON.stringify(research)}

IMPORTANT: Use the exact category from the analysis: "${analysis.category}"
IMPORTANT: The coverImage has already been determined — do NOT change it. Use exactly: "${coverImage}"

Return ONLY valid JSON without markdown:
{
    "title": "Compelling, SEO-friendly blog title",
    "slug": "url-friendly-slug-lowercase-hyphens",
    "excerpt": "Brief 1-2 sentence summary that hooks the reader",
    "category": "${analysis.category || 'Technology'}",
    "coverImage": "${coverImage}"
}`
        }
    ];
}

function buildContentMessages(research, analysis, metadata) {
    return [
        { role: 'system', content: SYSTEM_PROMPT },
        {
            role: 'user',
            content: `Write a professional blog article in Markdown format.

METADATA: ${JSON.stringify(metadata)}
ANALYSIS: ${JSON.stringify(analysis)}
SOURCE CONTENT: ${JSON.stringify(research)}

REQUIRED FORMAT (STRICTLY FOLLOW THIS STRUCTURE):

# ${metadata.title || 'Article Title'}

[Opening paragraph: 3-4 sentences introducing the topic and main announcement/news. Set the context and hook the reader.]

## Introduction to [Topic Context]

[2-3 paragraphs providing background and context. Explain the significance of this news/announcement.]

## Overview of [Main Subject/Product/Technology]

[2-3 paragraphs diving into the details. Describe features, capabilities, specifications, or key aspects.]

## [Relevant Section About Impact/Technology/Features]

[2-3 paragraphs exploring implications, innovations, or additional important aspects.]

## Conclusion on [Topic's Significance/Future/Leadership]

[2-3 paragraphs wrapping up. Discuss broader implications, future outlook, or industry impact.]

REQUIREMENTS:
- Total length: 600-800 words
- Use exactly 4 H2 sections with descriptive, topic-specific titles (not generic)
- Each section should have 2-3 well-developed paragraphs
- Professional, informative tone
- Include facts and insights from source content
- Natural flow from introduction to conclusion

Return ONLY valid JSON without markdown code blocks:
{ "content": "# Title\\n\\nOpening paragraph...\\n\\n## Section 1\\n\\nParagraphs...\\n\\n## Section 2\\n\\nParagraphs..." }`
        }
    ];
}

// ---------------------------------------------------------------------------
// JSON PARSER
// ---------------------------------------------------------------------------

function parseJSON(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('API returned empty or non-string response');
    }
    let jsonStr = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    jsonStr = jsonStr.replace(/```json/gi, '').replace(/```/g, '').trim();

    const openBrace = jsonStr.indexOf('{');
    const closeBrace = jsonStr.lastIndexOf('}');

    if (openBrace !== -1 && closeBrace !== -1 && closeBrace > openBrace) {
        try {
            return JSON.parse(jsonStr.substring(openBrace, closeBrace + 1));
        } catch (err) {
            throw new Error(`Failed to parse JSON: ${err.message}`);
        }
    }
    throw new Error('No JSON object found in AI response.');
}

// ---------------------------------------------------------------------------
// AI PROVIDERS — NVIDIA (primary) -> Groq (fallback)
// ---------------------------------------------------------------------------

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
            max_tokens: 4096,
            temperature: 0.7,
            top_p: 1.00,
            response_format: { type: 'json_object' },
            stream: false
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`NVIDIA API returned HTTP ${response.status}: ${errText.substring(0, 200)}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('NVIDIA API returned an empty response');
    return parseJSON(content);
}

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
            max_completion_tokens: 4096,
            top_p: 1,
            stop: null,
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API returned HTTP ${response.status}: ${errText.substring(0, 200)}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Groq API returned an empty response');
    return parseJSON(content);
}

async function callAI(messages, nvidiaKey, groqKey) {
    if (nvidiaKey) {
        try {
            console.log('[generate-blog-from-links] Using NVIDIA API...');
            return await callNvidiaAPI(messages, nvidiaKey);
        } catch (err) {
            console.warn(`[generate-blog-from-links] NVIDIA failed (${err.message}). Falling back to Groq...`);
        }
    }

    if (!groqKey) throw new Error('NVIDIA API failed and GROQ_API_KEY is not configured.');

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
            const { ok, url, reason } = await validatePublicUrl(raw);
            if (!ok) {
                return Response.json({ success: false, error: `Invalid URL "${String(raw).substring(0, 100)}": ${reason}` }, { status: 400 });
            }
            validatedLinks.push(url);
        }

        // Resolve API keys from env or Firestore
        const { nvidiaKey, groqKey } = await resolveApiKeys();
        if (!nvidiaKey && !groqKey) {
            return Response.json({ success: false, error: 'No AI provider configured.' }, { status: 500 });
        }

        // Step 1: Scrape all links (text + og:image)
        console.log(`[generate-blog-from-links] Fetching ${validatedLinks.length} source(s)...`);
        const fetchResults = await Promise.all(
            validatedLinks.map(async (url) => {
                const { text, image } = await fetchUrlContent(url);
                return { url: url.href, text, image };
            })
        );

        const validSources = fetchResults.filter(s => s.text.length > 100);
        if (validSources.length === 0) {
            return Response.json({ success: false, error: 'Could not extract enough content from the provided links.' }, { status: 400 });
        }

        // Pick the first valid og:image found across all sources
        const coverImage =
            validSources.find(s => s.image)?.image ||
            `https://picsum.photos/seed/tech${Date.now()}/1280/720`;

        console.log(`[generate-blog-from-links] Cover image: ${coverImage}`);

        const research = {
            sources: validSources.map(s => ({ url: s.url, content: s.text.substring(0, 3000) })),
            combinedText: validSources.map((s, i) => `--- SOURCE ${i + 1} ---\n${s.text}`).join('\n\n').substring(0, 12000)
        };

        // Step 2: Analyze
        console.log('[generate-blog-from-links] Analyzing sources...');
        const analysis = await callAI(buildAnalyzeMessages(research), nvidiaKey, groqKey);

        // Step 3: Generate metadata (with locked-in coverImage)
        console.log('[generate-blog-from-links] Generating metadata...');
        const metadata = await callAI(buildMetadataMessages(research, analysis, coverImage), nvidiaKey, groqKey);
        // Always enforce the scraped image — don't let AI overwrite it
        metadata.coverImage = coverImage;

        // Step 4: Write article content
        console.log('[generate-blog-from-links] Writing article content...');
        const contentData = await callAI(buildContentMessages(research, analysis, metadata), nvidiaKey, groqKey);
        const content = typeof contentData.content === 'string'
            ? contentData.content
            : JSON.stringify(contentData.content);

        const finalBlogData = {
            ...metadata,
            content,
            isAI: true,
            tags: ['AI', analysis.category || 'Technology'],
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            createdAt: new Date().toISOString()
        };

        return Response.json({ success: true, data: finalBlogData });

    } catch (error) {
        console.error('[generate-blog-from-links] Error:', error.message);
        return Response.json({ success: false, error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
    }
}
