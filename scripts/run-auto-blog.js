const { db } = require('../lib/admin');


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
                console.log(`  [IMG-CHECK] ✓ Valid image found: ${imgUrl}`);
                return imgUrl;
            }
            console.log(`  [IMG-CHECK] ✗ Rejected: ${imgUrl}`);
        }

        console.log(`  [IMG-CHECK] No valid images found via Tavily search`);
        return null;
    } catch (err) {
        console.log(`  [IMG-SEARCH] Error: ${err.message}`);
        return null;
    }
}

// Priority: metadata.coverImage → research.imageUrls[] → Tavily image search → placeholder
async function resolveCoverImage(metadata, research, topic, settings) {
    const tavilyKey = settings.tavilyApiKey || process.env.TAVILY_API_KEY;
    const category = metadata.category;

    // 1. metadata.coverImage
    if (metadata.coverImage) {
        console.log(`  [IMG] Checking metadata image...`);
        if (await verifyImageUrl(metadata.coverImage)) {
            console.log(`  [IMG] ✓ Metadata image OK`);
            return metadata.coverImage;
        }
        console.log(`  [IMG] ✗ Metadata image invalid or unreachable`);
    }

    // 2. research.imageUrls[]
    const researchImages = research.imageUrls || [];
    if (researchImages.length > 0) {
        console.log(`  [IMG] Checking ${researchImages.length} research image(s)...`);
        for (const url of researchImages) {
            if (await verifyImageUrl(url)) {
                console.log(`  [IMG] ✓ Research image OK: ${url}`);
                return url;
            }
            console.log(`  [IMG] ✗ Research image invalid: ${url}`);
        }
    }

    // 3. Tavily image search
    if (tavilyKey) {
        const found = await searchAndVerifyImage(topic, category, tavilyKey);
        if (found) return found;
    }

    // 4. Picsum placeholder (guaranteed fallback)
    const placeholder = getPlaceholderImage(category, topic);
    console.log(`  [IMG] Using placeholder: ${placeholder}`);
    return placeholder;
}

// --- FIRESTORE CRUD ---

async function getSettings(id) {
    try {
        const snap = await db.collection('settings').doc(id).get();
        return snap.exists ? snap.data() : null;
    } catch (err) {
        console.error('Error fetching settings:', err);
        return null;
    }
}

async function saveSettings(id, data) {
    try {
        await db.collection('settings').doc(id).set(data, { merge: true });
        return { success: true };
    } catch (err) {
        console.error('Error saving settings:', err);
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
        console.error('Error adding blog:', err);
        return { success: false, error: err };
    }
}

async function fetchExistingBlogs() {
    try {
        const snap = await db.collection('blogs').get();
        return snap.docs.map(d => ({ ...d.data(), slug: d.id }));
    } catch (err) {
        console.error('Error fetching blogs:', err);
        return [];
    }
}

// --- TAVILY SEARCH ---

async function tavilySearch(query, apiKey, isNews = false) {
    if (!apiKey) {
        console.log('[WARNING] No Tavily API key — skipping web search');
        return null;
    }

    try {
        const payload = {
            api_key: apiKey,
            query,
            search_depth: 'advanced', // upgraded from basic to fetch more reliable results
            include_answer: true,
            include_images: true,
            max_results: 5
        };

        if (isNews) {
            payload.topic = 'news';
            payload.days = 2; // only fetch news from the last couple of days
        }

        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Tavily API error: ${response.statusText}`);
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
        console.log(`[WARNING] Search failed: ${err.message}`);
        return null;
    }
}

// --- PROMPT GENERATION (shared between OpenRouter and Gemini paths) ---

const SYSTEM_PROMPT = 'You are an expert AI assistant. Always respond with valid JSON only. Never include markdown code blocks.';

function buildMessages(contextMode, promptText, searchResults, extraContext = {}) {
    const today = new Date().toLocaleDateString();

    if (contextMode === 'discover') {
        const searchCtx = searchResults ? `\n\nWEB SEARCH RESULTS:\n${JSON.stringify(searchResults, null, 2)}` : '';
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
{ "topics": ["Specific Headline 1", "Headline 2", "Headline 3", "Headline 4", "Headline 5"] }` }
        ];
    }

    if (contextMode === 'research') {
        const searchCtx = searchResults ? `\n\nWEB SEARCH RESULTS:\n${JSON.stringify(searchResults, null, 2)}` : '';
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
}` }
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
}` }
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
}` }
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
{ "content": "# Title\\n\\nOpening paragraph...\\n\\n## Section 1\\n\\nParagraphs...\\n\\n## Section 2\\n\\nParagraphs..." }` }
        ];
    }

    return [];
}

// --- AI GENERATION ENGINE ---

function parseJSON(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('API returned empty or non-string response');
    }

    // Completely strip <think>...</think> blocks generated by reasoning models
    let jsonStr = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    // Strip markdown code block formatting
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

async function generateAI(promptText, contextMode, config, extraContext = {}) {
    // --- OPENROUTER HANDLER ---
    let apiKey = process.env.OPENROUTER_API_KEY || config.openrouterApiKey;
    if (apiKey) apiKey = apiKey.replace(/['"]/g, '').trim();

    if (!apiKey) {
        console.error('Missing OpenRouter API Key.');
        throw new Error('Missing OpenRouter API Key');
    }

    const useSearch = ['discover', 'research'].includes(contextMode);
    const today = new Date().toLocaleDateString();

    let searchResults = null;
    const tavilyKey = config.tavilyApiKey || process.env.TAVILY_API_KEY;

    if (useSearch && tavilyKey) {
        const isNews = contextMode === 'discover';
        const searchQuery = isNews ? `trending tech news ${today}` : promptText;
        console.log(`  → Web Search: "${searchQuery}"`);
        // Pass isNews to limit to the last 2 days of news
        searchResults = await tavilySearch(searchQuery, tavilyKey, isNews);
        if (searchResults) console.log(`  ✓ Found ${searchResults.results?.length || 0} results`);
    }

    const messages = buildMessages(contextMode, promptText, searchResults, extraContext);

    const DEFAULT_MODEL = 'openai/gpt-oss-120b:free';
    let retries = 3;
    let lastError = new Error('Unknown API error');

    while (retries > 0) {
        try {
            const payload = {
                model: config.model || DEFAULT_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 8000,
                response_format: { type: 'json_object' } // Natively hint OpenRouter to enforce JSON output
            };

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errBody = await response.text();
                throw new Error(`OpenRouter API error: ${response.status} ${errBody}`);
            }

            const data = await response.json();
            const content = data?.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error('Received missing or empty content from AI provider');
            }

            return parseJSON(content);
        } catch (err) {
            console.warn(`OpenRouter Error (Attempt ${4 - retries}):`, err.message);
            lastError = err;
            retries--;
            if (retries > 0) await new Promise(r => setTimeout(r, 2000));
        }
    }

    // --- GROQ FALLBACK HANDLER ---
    let groqKey = process.env.GROQ_API_KEY || config.groqApiKey;
    if (groqKey) groqKey = groqKey.replace(/['"]/g, '').trim();

    if (groqKey) {
        console.log(`  [FALLBACK] OpenRouter exhausted or failed. Attempting Groq API...`);
        let groqRetries = 2;
        while (groqRetries > 0) {
            try {
                const payload = {
                    model: 'llama-3.3-70b-versatile',
                    messages,
                    temperature: 0.7,
                    max_tokens: 8000,
                    response_format: { type: 'json_object' }
                };

                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${groqKey}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errBody = await response.text();
                    throw new Error(`Groq API error: ${response.status} ${errBody}`);
                }

                const data = await response.json();
                const content = data?.choices?.[0]?.message?.content;
                
                if (!content) {
                    throw new Error('Received missing or empty content from Groq');
                }
                
                return parseJSON(content);
            } catch (err) {
                console.warn(`Groq Error (Attempt ${3 - groqRetries}):`, err.message);
                lastError = err;
                groqRetries--;
                if (groqRetries > 0) await new Promise(r => setTimeout(r, 2000));
            }
        }
    }

    throw lastError;
}

// --- MAIN EXECUTION ---

async function main() {
    console.log('Starting AI Auto Blog Script...');

    // 1. Load Settings
    const settings = await getSettings('ai_automation');
    if (!settings) {
        console.log("No AI Automation settings found in DB. Exiting.");
        process.exit(0);
    }

    if (!settings.enabled) {
        console.log('AI Automation is DISABLED in settings. Exiting.');
        process.exit(0);
    }

    const lastRun = settings.lastRun ? new Date(settings.lastRun) : null;
    const now = new Date();
    if (lastRun && lastRun.toDateString() === now.toDateString()) {
        console.log('Already ran today. Skipping.');
    }

    console.log(`Loaded Settings. Model: ${settings.model || 'default (OpenRouter)'}`);

    // Diagnostic: verify OpenRouter key
    let effectiveKey = process.env.OPENROUTER_API_KEY || settings.openrouterApiKey;
    if (effectiveKey) effectiveKey = effectiveKey.replace(/['"]/g, '').trim();
    const hasOpenRouterKey = !!effectiveKey;
    const openRouterKeySource = process.env.OPENROUTER_API_KEY ? 'ENV' : (settings.openrouterApiKey ? 'settings' : 'none');
    console.log(`[DIAG] OPENROUTER_API_KEY: ${hasOpenRouterKey ? `found (source=${openRouterKeySource})` : 'MISSING'}`);

    // 2. Perform Generation
    try {
        const today = new Date().toLocaleDateString();
        const populatedPrompt = (settings.prompt ||
            'Find 5 trending tech topics for {{date}}. Focus ONLY on: AI tools & innovations, smartphone rumors & launches, tech product innovations, breakthrough technologies, popular tech trends. EXCLUDE: stock market news, financial reports, cryptocurrency prices, company earnings.'
        ).replace('{{date}}', today);

        const existingBlogs = await fetchExistingBlogs();
        const existingTitles = existingBlogs.map(b => b.title?.toLowerCase().trim());
        console.log(`Loaded ${existingBlogs.length} existing blogs for duplicate checking`);

        let uniqueTopics = [];
        const maxAttempts = 3;

        for (let attempt = 1; attempt <= maxAttempts && uniqueTopics.length < 5; attempt++) {
            console.log(`\nAttempt ${attempt}: Discovering topics...`);

            const discoverData = await generateAI(populatedPrompt, 'discover', settings);
            const newTopics = discoverData.topics || [];

            if (newTopics.length === 0) {
                console.log('[WARNING] No topics found in this attempt');
                continue;
            }

            console.log(`[SUCCESS] Found: ${newTopics.join(', ')}`);

            for (const topic of newTopics) {
                const topicLower = topic.toLowerCase().trim();
                const isDuplicateInDB = existingTitles.some(t => t && (t.includes(topicLower.slice(0, 20)) || topicLower.includes(t.slice(0, 20))));
                const isDuplicateInSession = uniqueTopics.some(t => t.toLowerCase().includes(topicLower.slice(0, 20)) || topicLower.includes(t.toLowerCase().slice(0, 20)));

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
                console.log(`\nNeed ${5 - uniqueTopics.length} more unique topics. Searching again...`);
                await new Promise(r => setTimeout(r, 2000));
            }
        }

        if (uniqueTopics.length === 0) {
            throw new Error('Could not find any unique topics after multiple attempts');
        }

        console.log(`\n✓ Selected ${uniqueTopics.length} unique topics for generation\n`);

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

                console.log('  → Saving to DB...');
                const result = await addBlog(blogPost);
                if (result.success) {
                    console.log(`  [SUCCESS] Published! Cover: ${metadata.coverImage}`);
                    successCount++;
                } else {
                    console.log(`  [ERROR] DB Save Failed: ${result.error}`);
                }
            } catch (err) {
                console.error(`  [ERROR] Topic Failed: ${err.message}`);
            }

            await new Promise(r => setTimeout(r, 2000));
        }

        // 3. Update Last Run
        await saveSettings('ai_automation', { lastRun: new Date().toISOString() });
        console.log(`\n✅ Cycle complete! Successfully published ${successCount} out of ${uniqueTopics.length} unique articles.`);

    } catch (error) {
        console.error('CRITICAL FAILURE:', error);
        process.exit(1);
    }
}

main();
