'use strict';

const { db } = require('../lib/admin');

// ---------------------------------------------------------------------------
// IMAGE UTILITIES
// ---------------------------------------------------------------------------

function getPlaceholderImage(category, topic = '') {
    const topicSeed = topic
        ? topic.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)
        : Math.random().toString(36).substring(7);

    const categoryKeywords = {
        'ai': 'technology',
        'artificial intelligence': 'tech',
        'mobile': 'phone',
        'cyber security': 'security',
        'cybersecurity': 'security',
        'space': 'space',
        'startup': 'business',
        'crypto': 'crypto',
        'technology': 'digital',
        'default': 'tech'
    };

    const keyword = categoryKeywords[category?.toLowerCase()] || categoryKeywords['default'];
    return `https://picsum.photos/seed/${keyword}${topicSeed}/1280/720`;
}

function validateImageUrl(url) {
    if (!url || typeof url !== 'string') return false;
    if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
    const brokenPatterns = ['example.com', 'placeholder', 'undefined', 'null', '.jpg.jpg', 'data:image'];
    return !brokenPatterns.some(p => url.toLowerCase().includes(p));
}

async function verifyImageUrl(url) {
    if (!validateImageUrl(url)) return false;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        clearTimeout(timeout);
        if (!response.ok) return false;
        const contentType = response.headers.get('content-type') || '';
        return contentType.startsWith('image/');
    } catch (err) {
        console.log(`  [IMG-CHECK] Failed for ${url}: ${err.message}`);
        return false;
    }
}

async function searchAndVerifyImage(topic, category, tavilyKey) {
    if (!tavilyKey) return null;

    const query = `${topic} ${category || 'technology'}`;
    console.log(`  → Image Search (Tavily): "${query}"`);

    try {
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // The Tavily API requires the key in the body per its spec.
            // It is never echoed to logs.
            body: JSON.stringify({
                api_key: tavilyKey,
                query,
                search_depth: 'basic',
                include_images: true,
                max_results: 3
            })
        });

        if (!response.ok) return null;

        const data = await response.json();
        const images = data.images || [];
        console.log(`  → Verifying ${images.length} candidate image(s)...`);

        for (const imgUrl of images) {
            if (!validateImageUrl(imgUrl)) continue;
            if (await verifyImageUrl(imgUrl)) {
                console.log(`  [IMG-CHECK] ✓ Valid image found`);
                return imgUrl;
            }
        }

        console.log(`  [IMG-CHECK] No valid images found via Tavily search`);
        return null;
    } catch (err) {
        console.log(`  [IMG-SEARCH] Error: ${err.message}`);
        return null;
    }
}

/**
 * Resolves the best available cover image using a priority chain:
 * metadata.coverImage → research.imageUrls[] → Tavily image search → placeholder
 */
async function resolveCoverImage(metadata, research, topic, settings) {
    const tavilyKey = process.env.TAVILY_API_KEY || settings.tavilyApiKey;
    const category = metadata.category;

    if (metadata.coverImage) {
        console.log(`  [IMG] Checking metadata image...`);
        if (await verifyImageUrl(metadata.coverImage)) {
            console.log(`  [IMG] ✓ Metadata image OK`);
            return metadata.coverImage;
        }
        console.log(`  [IMG] ✗ Metadata image invalid or unreachable`);
    }

    const researchImages = research.imageUrls || [];
    if (researchImages.length > 0) {
        console.log(`  [IMG] Checking ${researchImages.length} research image(s)...`);
        for (const url of researchImages) {
            if (await verifyImageUrl(url)) {
                console.log(`  [IMG] ✓ Research image OK`);
                return url;
            }
        }
    }

    if (tavilyKey) {
        const found = await searchAndVerifyImage(topic, category, tavilyKey);
        if (found) return found;
    }

    const placeholder = getPlaceholderImage(category, topic);
    console.log(`  [IMG] Using placeholder fallback`);
    return placeholder;
}

// ---------------------------------------------------------------------------
// FIRESTORE CRUD
// ---------------------------------------------------------------------------

async function getSettings(id) {
    try {
        const snap = await db.collection('settings').doc(id).get();
        return snap.exists ? snap.data() : null;
    } catch (err) {
        console.error('Error fetching settings:', err.message);
        return null;
    }
}

async function saveSettings(id, data) {
    try {
        await db.collection('settings').doc(id).set(data, { merge: true });
        return { success: true };
    } catch (err) {
        console.error('Error saving settings:', err.message);
        return { success: false, error: err };
    }
}

async function addBlog(blogData) {
    try {
        const slug = blogData.slug ||
            blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const date = blogData.date || new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        await db.collection('blogs').doc(slug).set({
            ...blogData,
            date,
            createdAt: new Date().toISOString()
        });
        return { success: true, id: slug };
    } catch (err) {
        console.error('Error adding blog:', err.message);
        return { success: false, error: err };
    }
}

async function fetchExistingBlogs() {
    try {
        const snap = await db.collection('blogs').get();
        return snap.docs.map(d => ({ ...d.data(), slug: d.id }));
    } catch (err) {
        console.error('Error fetching blogs:', err.message);
        return [];
    }
}

// ---------------------------------------------------------------------------
// TAVILY SEARCH
// ---------------------------------------------------------------------------

async function tavilySearch(query, apiKey, isNews = false) {
    if (!apiKey) {
        console.log('[WARNING] No Tavily API key — skipping web search');
        return null;
    }

    try {
        const payload = {
            api_key: apiKey,
            query,
            search_depth: 'advanced',
            include_answer: true,
            include_images: true,
            max_results: 5
        };

        if (isNews) {
            payload.topic = 'news';
            payload.days = 2;
        }

        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Tavily API error: ${response.status}`);

        const data = await response.json();
        return {
            answer: data.answer || '',
            images: data.images || [],
            results: (data.results || []).map(r => ({
                title: r.title,
                url: r.url,
                content: r.content
            }))
        };
    } catch (err) {
        console.log(`[WARNING] Tavily search failed: ${err.message}`);
        return null;
    }
}

// ---------------------------------------------------------------------------
// PROMPT BUILDERS
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = 'You are an expert AI assistant. Always respond with valid JSON only. Never include markdown code blocks.';

function buildMessages(contextMode, promptText, searchResults, extraContext = {}) {
    const today = new Date().toLocaleDateString();

    if (contextMode === 'discover') {
        const searchCtx = searchResults
            ? `\n\nWEB SEARCH RESULTS:\n${JSON.stringify(searchResults, null, 2)}`
            : '';
        return [
            { role: 'system', content: SYSTEM_PROMPT },
            {
                role: 'user', content: `You are an expert news curator. We need exactly 5 highly-trending tech headlines from the last 24-48 hours.

User Criteria: ${promptText}

FOCUS ON:
- Breaking news: recent AI tools, newly launched tech, new smartphone leaks, software breakthroughs.
- Be highly specific (e.g. "OpenAI announces [X]" instead of "AI Innovations").

EXCLUDE:
- Financial markets, earnings calls, or trading.
- Cryptocurrencies
- Stale, historical data or general tutorials.

${searchCtx}

CRITICAL: You MUST extract the 5 topics strictly from the WEB SEARCH RESULTS provided above. Do not invent topics older than a few days.

Return ONLY valid JSON without markdown:
{ "topics": ["Specific Headline 1", "Headline 2", "Headline 3", "Headline 4", "Headline 5"] }`
            }
        ];
    }

    if (contextMode === 'research') {
        const searchCtx = searchResults
            ? `\n\nWEB SEARCH RESULTS:\n${JSON.stringify(searchResults, null, 2)}`
            : '';
        return [
            { role: 'system', content: SYSTEM_PROMPT },
            {
                role: 'user', content: `Research: "${promptText}"
Today: ${today}${searchCtx}

IMPORTANT: Use the 'images' array from the WEB SEARCH RESULTS to populate the 'imageUrls' field. Select high-quality, relevant images.

Return ONLY valid JSON without markdown:
{
    "topic": "${promptText}",
    "sources": [{ "title": "...", "url": "...", "imageUrl": "..." }],
    "facts": ["fact1", "fact2", "fact3"],
    "quotes": ["quote1"],
    "imageUrls": ["url1", "url2"],
    "publishedDate": "${today}"
}`
            }
        ];
    }

    if (contextMode === 'analyze') {
        const research = extraContext.research || {};
        return [
            { role: 'system', content: SYSTEM_PROMPT },
            {
                role: 'user', content: `Analyze research: ${JSON.stringify(research)}

IMPORTANT: Determine the MOST APPROPRIATE category based on the content. Choose ONE from:
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
    "mainAngle": "article angle",
    "category": "CHOOSE APPROPRIATE CATEGORY FROM LIST ABOVE",
    "keyPoints": ["point1", "point2", "point3"],
    "outline": ["intro", "section1", "section2", "conclusion"],
    "hook": "opening hook",
    "tone": "informative"
}`
            }
        ];
    }

    if (contextMode === 'write-json') {
        const { research = {}, analysis = {} } = extraContext;
        return [
            { role: 'system', content: SYSTEM_PROMPT },
            {
                role: 'user', content: `Create metadata based on the analysis.

ANALYSIS: ${JSON.stringify(analysis)}
RESEARCH: ${JSON.stringify(research)}

IMPORTANT: Use the exact category from the analysis: "${analysis.category}"
IMPORTANT: Pick the best image from 'research.imageUrls' for 'coverImage' if available.

Return ONLY valid JSON without markdown:
{
    "title": "Compelling, SEO-friendly blog title",
    "slug": "url-friendly-slug",
    "excerpt": "Brief 1-2 sentence summary",
    "category": "${analysis.category}",
    "coverImage": "https://example.com/image.jpg"
}`
            }
        ];
    }

    if (contextMode === 'write-content') {
        const { analysis = {}, metadata = {}, research = {} } = extraContext;
        return [
            { role: 'system', content: SYSTEM_PROMPT },
            {
                role: 'user', content: `Write a professional blog article in Markdown format.

METADATA: ${JSON.stringify(metadata)}
ANALYSIS: ${JSON.stringify(analysis)}
RESEARCH: ${JSON.stringify(research)}

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
- Include facts and insights from research
- Natural flow from introduction to conclusion

Return ONLY valid JSON without markdown code blocks:
{ "content": "# Title\\n\\nOpening paragraph...\\n\\n## Section 1\\n\\nParagraphs...\\n\\n## Section 2\\n\\nParagraphs..." }`
            }
        ];
    }

    return [];
}

// ---------------------------------------------------------------------------
// JSON PARSER
// ---------------------------------------------------------------------------

function parseJSON(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('API returned empty or non-string response');
    }

    // Strip <think>...</think> blocks generated by reasoning models
    let jsonStr = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    // Strip markdown code block wrappers
    jsonStr = jsonStr.replace(/```json/gi, '').replace(/```/g, '').trim();

    const openBrace = jsonStr.indexOf('{');
    const closeBrace = jsonStr.lastIndexOf('}');

    if (openBrace !== -1 && closeBrace !== -1 && closeBrace > openBrace) {
        jsonStr = jsonStr.substring(openBrace, closeBrace + 1);
        try {
            return JSON.parse(jsonStr);
        } catch (err) {
            throw new Error(`Failed to parse extracted JSON: ${err.message}`);
        }
    }

    throw new Error('No JSON object found in the AI response.');
}

// ---------------------------------------------------------------------------
// AI GENERATION ENGINE — GROQ
// ---------------------------------------------------------------------------

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

/**
 * Sanitizes a secret string by stripping surrounding quotes and whitespace.
 * Returns null if the result is empty, so callers can check for presence cleanly.
 */
function sanitizeKey(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const cleaned = raw.replace(/['"]/g, '').trim();
    return cleaned.length > 0 ? cleaned : null;
}

async function generateAI(promptText, contextMode, config, extraContext = {}) {
    // Env var takes precedence over Firestore settings; never log the value.
    const apiKey = sanitizeKey(process.env.GROQ_API_KEY || config.groqApiKey);
    if (!apiKey) {
        throw new Error('GROQ_API_KEY is not configured. Set it as a GitHub Actions secret.');
    }

    const useSearch = ['discover', 'research'].includes(contextMode);
    const today = new Date().toLocaleDateString();
    const tavilyKey = sanitizeKey(process.env.TAVILY_API_KEY || config.tavilyApiKey);

    let searchResults = null;
    if (useSearch && tavilyKey) {
        const isNews = contextMode === 'discover';
        const searchQuery = isNews ? `trending tech news ${today}` : promptText;
        console.log(`  → Web Search: "${searchQuery}"`);
        searchResults = await tavilySearch(searchQuery, tavilyKey, isNews);
        if (searchResults) console.log(`  ✓ Found ${searchResults.results?.length || 0} results`);
    }

    const messages = buildMessages(contextMode, promptText, searchResults, extraContext);

    let lastError = new Error('Unknown Groq API error');

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const payload = {
                model: config.model || DEFAULT_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 8000,
                response_format: { type: 'json_object' }
            };

            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Read and discard body to avoid leaking tokens; surface only the status code.
                await response.text();
                throw new Error(`Groq API returned HTTP ${response.status}`);
            }

            const data = await response.json();
            const content = data?.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error('Groq API returned an empty response body');
            }

            return parseJSON(content);
        } catch (err) {
            lastError = err;
            console.warn(`  [Groq] Attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`);
            if (attempt < MAX_RETRIES) {
                await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
            }
        }
    }

    throw lastError;
}

// ---------------------------------------------------------------------------
// MAIN EXECUTION
// ---------------------------------------------------------------------------

async function main() {
    console.log('Starting AI Auto Blog Script...');

    const settings = await getSettings('ai_automation');
    if (!settings) {
        console.log('No AI Automation settings found in Firestore. Exiting.');
        process.exit(0);
    }

    if (!settings.enabled) {
        console.log('AI Automation is DISABLED in settings. Exiting.');
        process.exit(0);
    }

    // Skip if already ran today (UTC date comparison)
    const lastRun = settings.lastRun ? new Date(settings.lastRun) : null;
    const now = new Date();
    if (lastRun && lastRun.toDateString() === now.toDateString()) {
        console.log('Already ran today. Skipping.');
        process.exit(0);
    }

    // Verify that the Groq key is present before doing any work.
    const groqKeyPresent = !!(sanitizeKey(process.env.GROQ_API_KEY || settings.groqApiKey));
    if (!groqKeyPresent) {
        console.error('[ERROR] GROQ_API_KEY is missing. Add it as a GitHub Actions secret named GROQ_API_KEY.');
        process.exit(1);
    }

    console.log(`Settings loaded. Model: ${settings.model || DEFAULT_MODEL}`);
    console.log('[DIAG] GROQ_API_KEY: present');
    console.log(`[DIAG] TAVILY_API_KEY: ${process.env.TAVILY_API_KEY || settings.tavilyApiKey ? 'present' : 'missing (web search disabled)'}`);

    try {
        const today = new Date().toLocaleDateString();
        const populatedPrompt = (
            settings.prompt ||
            'Find 5 trending tech topics for {{date}}. Focus ONLY on: AI tools & innovations, smartphone rumors & launches, tech product innovations, breakthrough technologies, popular tech trends. EXCLUDE: stock market news, financial reports, cryptocurrency prices, company earnings.'
        ).replace('{{date}}', today);

        const existingBlogs = await fetchExistingBlogs();
        const existingTitles = existingBlogs.map(b => b.title?.toLowerCase().trim());
        console.log(`Loaded ${existingBlogs.length} existing blogs for duplicate checking`);

        const uniqueTopics = [];
        const maxAttempts = 3;

        for (let attempt = 1; attempt <= maxAttempts && uniqueTopics.length < 5; attempt++) {
            console.log(`\nAttempt ${attempt}: Discovering topics...`);

            const discoverData = await generateAI(populatedPrompt, 'discover', settings);
            const newTopics = discoverData.topics || [];

            if (newTopics.length === 0) {
                console.log('[WARNING] No topics returned in this attempt');
                continue;
            }

            console.log(`[SUCCESS] Candidates: ${newTopics.join(', ')}`);

            for (const topic of newTopics) {
                const topicLower = topic.toLowerCase().trim();
                const isDuplicateInDB = existingTitles.some(
                    t => t && (t.includes(topicLower.slice(0, 20)) || topicLower.includes(t.slice(0, 20)))
                );
                const isDuplicateInSession = uniqueTopics.some(
                    t => t.toLowerCase().includes(topicLower.slice(0, 20)) || topicLower.includes(t.toLowerCase().slice(0, 20))
                );

                if (isDuplicateInDB) {
                    console.log(`  [SKIP] "${topic}" — Similar article exists in database`);
                } else if (isDuplicateInSession) {
                    console.log(`  [SKIP] "${topic}" — Already selected in this session`);
                } else {
                    uniqueTopics.push(topic);
                    console.log(`  [ADDED] "${topic}" (${uniqueTopics.length}/5)`);
                    if (uniqueTopics.length >= 5) break;
                }
            }

            if (uniqueTopics.length < 5) {
                console.log(`\nNeed ${5 - uniqueTopics.length} more unique topics. Retrying...`);
                await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
            }
        }

        if (uniqueTopics.length === 0) {
            throw new Error('Could not find any unique topics after multiple attempts');
        }

        console.log(`\n✓ Selected ${uniqueTopics.length} unique topic(s) for generation\n`);

        let successCount = 0;

        for (let i = 0; i < uniqueTopics.length; i++) {
            const topic = uniqueTopics[i];
            console.log(`\n[${i + 1}/${uniqueTopics.length}] Processing: "${topic}"`);

            try {
                console.log('  → Researching...');
                const research = await generateAI(topic, 'research', settings);

                console.log('  → Analyzing...');
                const analysis = await generateAI(topic, 'analyze', settings, { research });

                console.log('  → Generating Metadata...');
                const metadata = await generateAI(topic, 'write-json', settings, { research, analysis });

                metadata.coverImage = await resolveCoverImage(metadata, research, topic, settings);

                console.log('  → Writing Content...');
                const contentData = await generateAI(topic, 'write-content', settings, { research, analysis, metadata });
                const content = typeof contentData.content === 'string'
                    ? contentData.content
                    : JSON.stringify(contentData.content);

                const blogPost = {
                    ...metadata,
                    content,
                    isAI: true,
                    tags: ['AI', analysis.category || 'Technology']
                };

                console.log('  → Saving to Firestore...');
                const result = await addBlog(blogPost);
                if (result.success) {
                    console.log(`  [SUCCESS] Published: "${metadata.title || topic}"`);
                    successCount++;
                } else {
                    console.error(`  [ERROR] DB save failed for "${topic}"`);
                }
            } catch (err) {
                console.error(`  [ERROR] Topic failed — "${topic}": ${err.message}`);
            }

            await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
        }

        await saveSettings('ai_automation', { lastRun: new Date().toISOString() });
        console.log(`\n✅ Cycle complete! Published ${successCount}/${uniqueTopics.length} articles.`);

    } catch (error) {
        console.error('CRITICAL FAILURE:', error.message);
        process.exit(1);
    }
}

main();
