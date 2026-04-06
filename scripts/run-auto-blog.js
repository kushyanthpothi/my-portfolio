// --- CONFIGURATION ---
// Note: Admin SDK credentials are handled via lib/admin.js
const { db } = require('../lib/admin');
const { GoogleGenerativeAI } = require("@google/generative-ai");


// --- HELPER FUNCTIONS ---

function getPlaceholderImage(category, topic = '') {
    const topicSeed = topic
        ? topic.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)
        : Math.random().toString(36).substring(7);

    const categoryKeywords = {
        'ai': 'technology',
        'artificial intelligence': 'tech',
        'mobile': 'phone',
        'cyber security': 'security',
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
    if (brokenPatterns.some(p => url.toLowerCase().includes(p))) return false;
    return true;
}

// --- IMAGE VERIFICATION (Real HTTP Check) ---

async function verifyImageUrl(url) {
    if (!validateImageUrl(url)) return false;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

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

// --- SEARCH & VERIFY IMAGE via Tavily ---

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
                query: query,
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

            const isValid = await verifyImageUrl(imgUrl);
            if (isValid) {
                console.log(`  [IMG-CHECK] ✓ Valid image found: ${imgUrl}`);
                return imgUrl;
            } else {
                console.log(`  [IMG-CHECK] ✗ Rejected: ${imgUrl}`);
            }
        }

        console.log(`  [IMG-CHECK] No valid images found via Tavily search`);
        return null;
    } catch (err) {
        console.log(`  [IMG-SEARCH] Error: ${err.message}`);
        return null;
    }
}

// --- RESOLVE COVER IMAGE (Waterfall) ---
// Priority: metadata.coverImage → research.imageUrls[] → Tavily image search → placeholder

async function resolveCoverImage(metadata, research, topic, settings) {
    const tavilyKey = settings.tavilyApiKey || process.env.TAVILY_API_KEY;
    const category = metadata.category;

    // 1. Try metadata.coverImage
    if (metadata.coverImage) {
        console.log(`  [IMG] Checking metadata image...`);
        const valid = await verifyImageUrl(metadata.coverImage);
        if (valid) {
            console.log(`  [IMG] ✓ Metadata image OK`);
            return metadata.coverImage;
        }
        console.log(`  [IMG] ✗ Metadata image invalid or unreachable`);
    }

    // 2. Try each URL in research.imageUrls
    const researchImages = research.imageUrls || [];
    if (researchImages.length > 0) {
        console.log(`  [IMG] Checking ${researchImages.length} research image(s)...`);
        for (const url of researchImages) {
            const valid = await verifyImageUrl(url);
            if (valid) {
                console.log(`  [IMG] ✓ Research image OK: ${url}`);
                return url;
            }
            console.log(`  [IMG] ✗ Research image invalid: ${url}`);
        }
    }

    // 3. Search for fresh images via Tavily and verify each result
    if (tavilyKey) {
        const found = await searchAndVerifyImage(topic, category, tavilyKey);
        if (found) return found;
    }

    // 4. Final guaranteed fallback — picsum placeholder is always reachable
    const placeholder = getPlaceholderImage(category, topic);
    console.log(`  [IMG] Using placeholder: ${placeholder}`);
    return placeholder;
}


// --- CORE FUNCTIONS ---

async function getSettings(settingsId) {
    try {
        const docRef = db.collection("settings").doc(settingsId);
        const docSnap = await docRef.get();
        return docSnap.exists ? docSnap.data() : null;
    } catch (error) {
        console.error("Error fetching settings:", error);
        return null;
    }
}

async function saveSettings(settingsId, data) {
    try {
        await db.collection("settings").doc(settingsId).set(data, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Error saving settings:", error);
        return { success: false, error };
    }
}

async function addBlog(blogData) {
    try {
        const slug = blogData.slug || blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const date = blogData.date || new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        await db.collection("blogs").doc(slug).set({
            ...blogData,
            date: date,
            createdAt: new Date().toISOString()
        });
        return { success: true, id: slug };
    } catch (error) {
        console.error("Error adding blog:", error);
        return { success: false, error };
    }
}

async function fetchExistingBlogs() {
    try {
        const querySnapshot = await db.collection("blogs").get();
        const blogs = [];
        querySnapshot.forEach((doc) => {
            blogs.push({ ...doc.data(), slug: doc.id });
        });
        return blogs;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return [];
    }
}

// --- TAVILY SEARCH (Server Side) ---
async function tavilySearch(query, apiKey) {
    if (!apiKey) {
        console.log('[WARNING] No Tavily API key - skipping web search');
        return null;
    }

    try {
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api_key: apiKey,
                query: query,
                search_depth: 'basic',
                include_answer: true,
                include_images: true,
                max_results: 5
            })
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

// --- AI GENERATION ENGINE ---
async function generateAI(promptText, contextMode, config, extraContext = {}) {
    const modelName = config.model || "llama-3.3-70b-versatile";
    const isGemini = modelName.toLowerCase().includes('gemini');

    // --- GEMINI HANDLER ---
    if (isGemini) {
        const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("Missing Gemini API Key (config.apiKey)");

        const genAI = new GoogleGenerativeAI(apiKey);
        const cleanModel = modelName.replace('google/', '').replace(':free', '');
        const model = genAI.getGenerativeModel({ model: cleanModel });

        const systemPrompt = "You are an expert AI assistant. Always respond with valid JSON only. Never include markdown code blocks.";

        const useSearch = ['discover', 'research'].includes(contextMode);
        const today = new Date().toLocaleDateString();

        let searchResults = null;
        const tavilyKey = config.tavilyApiKey || process.env.TAVILY_API_KEY;

        if (useSearch && tavilyKey) {
            const searchQuery = contextMode === 'discover' ? `trending tech news ${today}` : promptText;
            console.log(`  → Web Search (Tavily): "${searchQuery}"`);
            searchResults = await tavilySearch(searchQuery, tavilyKey);
            if (searchResults) console.log(`  ✓ Found ${searchResults.results?.length || 0} results`);
        }

        let userContent = "";

        if (contextMode === 'discover') {
            const searchContext = searchResults ? `\n\nWEB SEARCH RESULTS:\n${JSON.stringify(searchResults, null, 2)}` : '';
            userContent = `Find exactly 5 trending tech news headlines from TODAY: ${today}.

User Criteria: ${promptText}

FOCUS ON:
- AI tools, AI innovations, and AI product launches
- Smartphone rumors, leaks, and official announcements
- Tech product innovations and breakthrough technologies
- Popular trending tech topics and viral tech news
- Software updates and new tech features

EXCLUDE:
- Stock market news and financial reports
- Company earnings and revenue reports
- Cryptocurrency price movements
- Investment and trading news
- Market analysis and financial forecasts
${searchContext}

Return ONLY valid JSON without markdown:
{ "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"] }`;
        } else if (contextMode === 'research') {
            const searchContext = searchResults ? `\n\nWEB SEARCH RESULTS:\n${JSON.stringify(searchResults, null, 2)}` : '';
            userContent = `Research: "${promptText}"\nToday: ${today}${searchContext}\nIMPORTANT: Use the 'images' array from the WEB SEARCH RESULTS to populate the 'imageUrls' field.\nReturn ONLY valid JSON without markdown:\n{ "topic": "${promptText}", "sources": [{ "title": "...", "url": "...", "imageUrl": "..." }], "facts": [], "quotes": [], "imageUrls": [], "publishedDate": "${today}" }`;
        } else if (contextMode === 'analyze') {
            const research = extraContext.research || {};
            userContent = `Analyze research: ${JSON.stringify(research)}\nDetermine MOST APPROPRIATE category.\nReturn ONLY valid JSON without markdown:\n{ "mainAngle": "...", "category": "...", "keyPoints": [], "outline": [], "hook": "...", "tone": "..." }`;
        } else if (contextMode === 'write-json') {
            const { research = {}, analysis = {} } = extraContext;
            userContent = `Create metadata.\nANALYSIS: ${JSON.stringify(analysis)}\nRESEARCH: ${JSON.stringify(research)}\nReturn ONLY valid JSON:\n{ "title": "...", "slug": "...", "excerpt": "...", "category": "...", "coverImage": "..." }`;
        } else if (contextMode === 'write-content') {
            const { analysis = {}, metadata = {}, research = {} } = extraContext;
            userContent = `Write a professional blog article in Markdown.\nMETADATA: ${JSON.stringify(metadata)}\nANALYSIS: ${JSON.stringify(analysis)}\nRESEARCH: ${JSON.stringify(research)}\nReturn ONLY valid JSON:\n{ "content": "# Title\\n\\n..." }`;
        }

        let retries = 3;
        while (retries > 0) {
            try {
                const result = await model.generateContent([systemPrompt, userContent]);
                const response = await result.response;
                let text = response.text();

                let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const firstOpen = jsonStr.indexOf('{');
                const lastClose = jsonStr.lastIndexOf('}');
                if (firstOpen !== -1 && lastClose !== -1) {
                    jsonStr = jsonStr.substring(firstOpen, lastClose + 1);
                }
                return JSON.parse(jsonStr);
            } catch (error) {
                console.warn(`Gemini Generation Error (Attempt ${4 - retries}):`, error.message);
                retries--;
                if (retries === 0) throw error;
                await new Promise(r => setTimeout(r, 10000));
            }
        }
    }

    // --- OPENROUTER HANDLER (Fallback) ---
    const apiKey = config.openrouterApiKey || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        console.error("Missing OpenRouter API Key.");
        throw new Error("Missing OpenRouter API Key");
    }

    const useSearch = ['discover', 'research'].includes(contextMode);
    const today = new Date().toLocaleDateString();

    let searchResults = null;
    const tavilyKey = config.tavilyApiKey || process.env.TAVILY_API_KEY;

    if (useSearch && tavilyKey) {
        const searchQuery = contextMode === 'discover' ? `trending tech news ${today}` : promptText;
        console.log(`  → Web Search: "${searchQuery}"`);
        searchResults = await tavilySearch(searchQuery, tavilyKey);
        if (searchResults) console.log(`  ✓ Found ${searchResults.results?.length || 0} results`);
    }

    let messages = [];
    const systemPrompt = "You are an expert AI assistant. Always respond with valid JSON only. Never include markdown code blocks.";

    if (contextMode === 'discover') {
        const searchContext = searchResults ? `\n\nWEB SEARCH RESULTS:\n${JSON.stringify(searchResults, null, 2)}` : '';
        messages = [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: `Find exactly 5 trending tech news headlines from TODAY: ${today}.

User Criteria: ${promptText}

FOCUS ON:
- AI tools, AI innovations, and AI product launches
- Smartphone rumors, leaks, and official announcements
- Tech product innovations and breakthrough technologies
- Popular trending tech topics and viral tech news
- Software updates and new tech features

EXCLUDE:
- Stock market news and financial reports
- Company earnings and revenue reports
- Cryptocurrency price movements
- Investment and trading news
- Market analysis and financial forecasts
${searchContext}

Return ONLY valid JSON without markdown:
{ "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"] }`
            }
        ];
    } else if (contextMode === 'research') {
        const searchContext = searchResults ? `\n\nWEB SEARCH RESULTS:\n${JSON.stringify(searchResults, null, 2)}` : '';
        messages = [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: `Research: "${promptText}"
Today: ${today}${searchContext}

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
    } else if (contextMode === 'analyze') {
        const research = extraContext.research || {};
        messages = [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: `Analyze research: ${JSON.stringify(research)}

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
    } else if (contextMode === 'write-json') {
        const { research = {}, analysis = {} } = extraContext;
        messages = [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: `Create metadata based on the analysis.

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
    } else if (contextMode === 'write-content') {
        const { analysis = {}, metadata = {}, research = {} } = extraContext;
        messages = [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: `Write a professional blog article in Markdown format.

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

    let retries = 3;
    while (retries > 0) {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: config.model || "openai/gpt-oss-120b:free",
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 8000,
                    reasoning: { enabled: true }
                })
            });

            if (!response.ok) {
                const errBody = await response.text();
                throw new Error(`OpenRouter API error: ${response.status} ${errBody}`);
            }

            const data = await response.json();
            const text = data.choices[0].message.content;
            let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const firstOpen = jsonStr.indexOf('{');
            const lastClose = jsonStr.lastIndexOf('}');
            if (firstOpen !== -1 && lastClose !== -1) {
                jsonStr = jsonStr.substring(firstOpen, lastClose + 1);
            }

            return JSON.parse(jsonStr);
        } catch (err) {
            console.warn(`Error (Attempt ${4 - retries}):`, err);
            retries--;
            if (retries === 0) throw err;
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}


// --- MAIN EXECUTION ---
async function main() {
    console.log("Starting AI Auto Blog Script...");

    // 1. Load Settings
    const settings = await getSettings('ai_automation');
    if (!settings) {
        console.log("No AI Automation settings found in DB. Exiting.");
        process.exit(0);
    }

    if (!settings.enabled) {
        console.log("AI Automation is DISABLED in settings. Exiting.");
        process.exit(0);
    }

    const lastRun = settings.lastRun ? new Date(settings.lastRun) : null;
    const now = new Date();
    if (lastRun && lastRun.getDate() === now.getDate() && lastRun.getMonth() === now.getMonth() && lastRun.getFullYear() === now.getFullYear()) {
        console.log("Already ran today. Skipping.");
    }

    console.log(`Loaded Settings. Model: ${settings.model}`);

    // 2. Perform Generation
    try {
        const today = new Date().toLocaleDateString();
        const populatedPrompt = (settings.prompt || "Find 5 trending tech topics for {{date}}. Focus ONLY on: AI tools & innovations, smartphone rumors & launches, tech product innovations, breakthrough technologies, popular tech trends. EXCLUDE: stock market news, financial reports, cryptocurrency prices, company earnings.").replace('{{date}}', today);

        const existingBlogs = await fetchExistingBlogs();
        const existingTitles = existingBlogs.map(b => b.title?.toLowerCase().trim());
        console.log(`Loaded ${existingBlogs.length} existing blogs for duplicate checking`);

        let uniqueTopics = [];
        const maxAttempts = 3;
        let attempt = 0;

        while (uniqueTopics.length < 5 && attempt < maxAttempts) {
            attempt++;
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

                const isDuplicateInDB = existingTitles.some(title =>
                    title && (title.includes(topicLower.slice(0, 20)) || topicLower.includes(title.slice(0, 20)))
                );

                const isDuplicateInSession = uniqueTopics.some(t =>
                    t.toLowerCase().includes(topicLower.slice(0, 20)) || topicLower.includes(t.toLowerCase().slice(0, 20))
                );

                if (isDuplicateInDB) {
                    console.log(`  [SKIP] "${topic}" - Similar article exists in database`);
                } else if (isDuplicateInSession) {
                    console.log(`  [SKIP] "${topic}" - Already selected in this session`);
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
            throw new Error("Could not find any unique topics after multiple attempts");
        }

        console.log(`\n✓ Selected ${uniqueTopics.length} unique topics for generation\n`);

        let successCount = 0;

        for (let i = 0; i < uniqueTopics.length; i++) {
            const topic = uniqueTopics[i];
            console.log(`\n[${i + 1}/${uniqueTopics.length}] Processing: "${topic}"`);

            try {
                console.log(`  → Researching...`);
                const research = await generateAI(topic, 'research', settings);

                console.log(`  → Analyzing...`);
                const analysis = await generateAI(topic, 'analyze', settings, { research });

                console.log(`  → Generating Metadata...`);
                const metadata = await generateAI(topic, 'write-json', settings, { research, analysis });

                // ── IMAGE RESOLUTION WATERFALL ──────────────────────────────────
                // 1. metadata.coverImage  →  real HTTP HEAD check
                // 2. research.imageUrls[] →  real HTTP HEAD check (each)
                // 3. Tavily image search  →  real HTTP HEAD check (each result)
                // 4. picsum placeholder   →  always valid, guaranteed fallback
                // ────────────────────────────────────────────────────────────────
                console.log(`  → Resolving cover image...`);
                metadata.coverImage = await resolveCoverImage(metadata, research, topic, settings);

                console.log(`  → Writing Content...`);
                const contentData = await generateAI(topic, 'write-content', settings, { research, analysis, metadata });

                const content = typeof contentData.content === 'string'
                    ? contentData.content
                    : JSON.stringify(contentData.content);

                const blogPost = {
                    ...metadata,
                    content: content,
                    isAI: true,
                    tags: ['AI', analysis.category || 'Technology']
                };

                console.log(`  → Saving to DB...`);
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
        console.error("CRITICAL FAILURE:", error);
        process.exit(1);
    }
}

main();
