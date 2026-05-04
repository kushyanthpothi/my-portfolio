import { verifyAuth } from '@/lib/authMiddleware';

// ---------------------------------------------------------------------------
// URL VALIDATION — SSRF prevention
// Only allow public HTTP(S) URLs; block private network ranges and non-web schemes.
// ---------------------------------------------------------------------------

const BLOCKED_HOSTS = /^(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|::1|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+|metadata\.google\.internal)$/i;

/**
 * Validates that a URL is safe to fetch on behalf of a user request.
 * Blocks non-HTTP(S) schemes and private / link-local network addresses.
 * @param {string} raw - The raw string provided by the caller.
 * @returns {{ ok: boolean, url: URL|null, reason?: string }}
 */
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

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { ok: false, url: null, reason: 'Only http and https URLs are permitted' };
    }

    const hostname = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTS.test(hostname)) {
        return { ok: false, url: null, reason: 'Requests to private or internal network addresses are not allowed' };
    }

    return { ok: true, url: parsed };
}

// ---------------------------------------------------------------------------
// HTML → plain text extraction
// Uses a complete tag-stripping approach rather than trying to selectively
// remove specific elements (incomplete multi-character sanitization is a
// common bypass vector for regex-based HTML filters).
// ---------------------------------------------------------------------------

/**
 * Strips ALL HTML markup from a string and collapses whitespace.
 * This is intentionally aggressive: the result is used only as LLM input
 * (plain text), so losing formatting is acceptable and safer than partial
 * filtering that can be bypassed.
 */
function stripAllHtml(html) {
    // Normalize common HTML entities first so they don't linger as literal text.
    return html
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        // Remove ALL tags — no attempt to selectively preserve some — the content
        // that matters (paragraph text) will still be present after stripping.
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// ---------------------------------------------------------------------------
// CONTENT SCRAPER
// ---------------------------------------------------------------------------

/**
 * Fetches a validated public URL and extracts its readable plain-text content.
 * The URL must already have been validated by validatePublicUrl().
 * @param {URL} validatedUrl - A URL object that has passed validatePublicUrl().
 * @returns {Promise<string>} Extracted plain text, up to 8 000 characters.
 */
async function fetchUrlContent(validatedUrl) {
    // Use the normalized href from the URL object — never the raw user string.
    const href = validatedUrl.href;

    try {
        const response = await fetch(href, {
            headers: {
                // Identify as a bot rather than impersonating a browser to
                // avoid misleading site analytics.
                'User-Agent': 'PortfolioBot/1.0 (blog-generator; +https://kushyanthpothi.dev)'
            },
            // Next.js fetch option: disable caching for fresh content.
            next: { revalidate: 0 },
            // Hard timeout so a slow/stalled server can't tie up the worker.
            signal: AbortSignal.timeout(10_000)
        });

        if (!response.ok) {
            // Log only the status code and host — not the full URL — to avoid
            // reflecting user-controlled data into server logs (format-string issue).
            console.warn(`[fetchUrlContent] HTTP ${response.status} from host: ${validatedUrl.hostname}`);
            return '';
        }

        const contentType = response.headers.get('content-type') || '';
        // Only process HTML/text responses; skip binary files.
        if (!contentType.includes('text/')) {
            console.warn(`[fetchUrlContent] Skipped non-text content-type: ${contentType}`);
            return '';
        }

        const html = await response.text();

        // Strip ALL HTML tags completely instead of applying incomplete
        // allow/block lists that can be bypassed via encoding or nesting.
        const plainText = stripAllHtml(html);

        return plainText.substring(0, 8_000);
    } catch (err) {
        // Never interpolate the user-supplied URL directly into log messages
        // (externally-controlled format string). Log only the error message and
        // the safe, parsed hostname.
        console.error(`[fetchUrlContent] Error fetching ${validatedUrl.hostname}: ${err.message}`);
        return '';
    }
}

// ---------------------------------------------------------------------------
// AI SYNTHESIS
// ---------------------------------------------------------------------------

/**
 * Calls the Groq API to synthesize multiple sources into a single blog post.
 * @param {{ url: string, content: string }[]} sources
 * @param {string} groqKey
 */
async function synthesizeWithGroq(sources, groqKey) {
    const combinedContent = sources
        .map((s, i) => `--- SOURCE ${i + 1} ---\nLink: ${s.url}\nContent: ${s.content}`)
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
                    content: `TASK: Synthesize the following source materials into a single comprehensive blog post.

SOURCES:
${combinedContent.substring(0, 15_000)}

REQUIREMENTS:
1. "title": Catchy, SEO-optimized title.
2. "slug": URL-friendly slug.
3. "excerpt": Catchy 1-2 sentence summary.
4. "category": Choose best fit (e.g., AI, Cybersecurity, Tech News).
5. "content": Full blog post in Markdown. Use H1 for title, H2 for sections.
6. "coverImage": Use picsum.photos/seed/[keyword]/1280/720 format.

RETURN VALID JSON ONLY.`
                }
            ],
            temperature: 0.7,
            max_tokens: 8000,
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        // Read and discard body; surface only the status code to avoid
        // leaking internal API error details.
        await response.text();
        throw new Error(`Groq API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error('Groq API returned an empty response');
    }

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

        // Validate every URL before any network I/O — SSRF prevention.
        const validatedLinks = [];
        for (const raw of links) {
            const { ok, url, reason } = validatePublicUrl(raw);
            if (!ok) {
                return Response.json({ success: false, error: `Invalid URL "${String(raw).substring(0, 100)}": ${reason}` }, { status: 400 });
            }
            validatedLinks.push(url);
        }

        const groqKey = (process.env.GROQ_API_KEY || '').replace(/['"]/g, '').trim();
        if (!groqKey) {
            return Response.json({ success: false, error: 'GROQ_API_KEY is not configured on the server' }, { status: 500 });
        }

        // Fetch content from all validated links concurrently.
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
        console.error('[generate-blog-from-links] Error:', error.message);
        return Response.json({ success: false, error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
    }
}
