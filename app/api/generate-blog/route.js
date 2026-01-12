import { GoogleGenerativeAI } from '@google/generative-ai';
import { addBlog, fetchBlogs, getSettings } from '@/lib/firestoreUtils';

// Helper function to validate image URL
async function validateImageUrl(url) {
    if (!url || typeof url !== 'string') return false;

    // Basic URL format check
    if (!url.startsWith('http://') && !url.startsWith('https://')) return false;

    // Check for common broken URL patterns
    const brokenPatterns = [
        'example.com',
        'placeholder',
        'undefined',
        'null',
        '.jpg.jpg',
        'data:image',
        'vertexaisearch.cloud.google.com',
        'grounding-api-redirect',
        'googleusercontent.com/grounding'
    ];
    if (brokenPatterns.some(p => url.toLowerCase().includes(p))) return false;

    try {
        // Make a HEAD request to check if image exists (with timeout)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal
        });
        clearTimeout(timeout);

        const contentType = response.headers.get('content-type') || '';
        return response.ok && contentType.startsWith('image/');
    } catch {
        return false;
    }
}

// Generate a placeholder image URL based on category AND topic (for unique images per article)
function getPlaceholderImage(category, topic = '') {
    // Create a unique seed from the topic for different images per article
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

    // Using picsum with unique seed per topic (1280x720 = 16:9)
    return `https://picsum.photos/seed/${keyword}${topicSeed}/1280/720`;
}

export async function POST(req) {
    try {
        let { apiKey, model: modelName, prompt, mode = 'write', context } = await req.json();

        // 1. If no API key provided in request, try to fetch from DB
        if (!apiKey) {
            console.log('No API Key in request, checking database...');
            const settings = await getSettings('ai_automation');
            if (settings && settings.apiKey) {
                apiKey = settings.apiKey;
                console.log('API Key found in database.');
            }
        }

        if (!apiKey) {
            return Response.json({ success: false, error: 'Missing API Key' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const today = new Date().toLocaleDateString();

        // Model configuration varies by mode
        const useGoogleSearch = ['discover', 'research'].includes(mode);

        const model = genAI.getGenerativeModel({
            model: modelName || "gemini-2.0-flash-exp",
            generationConfig: {
                maxOutputTokens: 5000,
                temperature: 0.7
            },
            ...(useGoogleSearch && {
                tools: [{ googleSearch: {} }]
            })
        });

        let finalPrompt = '';

        // ============== MODE: DISCOVER ==============
        // Find 5 trending topics
        if (mode === 'discover') {
            finalPrompt = `
             TASK: You are a tech news editor.
             ACTION: Use Google Search to find exactly 5 trending tech news headlines from TODAY: ${today}.
             USER CRITERIA: ${prompt}
             
             REQUIREMENTS:
             1. Topics must be distinct and real news from the last 24 hours.
             2. Return ONLY a JSON object with a single key "topics" containing an array of 5 strings (titles).
             3. Do not include markdown formatting like \`\`\`json ... \`\`\`. Just the raw JSON string.
             
             Example Output:
             { "topics": ["New iPhone release", "SpaceX launch success", "AI model breakthrough", "Crypto regulation update", "New VR headset announced"] }
             `;
        }

        // ============== MODE: RESEARCH ==============
        // Search for topic information and gather sources
        else if (mode === 'research') {
            finalPrompt = `
            TASK: You are a research assistant.
            ACTION: Use Google Search to find detailed information about this topic: "${prompt}"
            CONTEXT: Today is ${today}.
            
            REQUIREMENTS:
            1. Search for the latest news and updates about this topic.
            2. Gather at least 3-5 reliable sources from major news outlets.
            3. Extract key facts, quotes, and statistics.
            
            CRITICAL - IMAGE REQUIREMENTS:
            - Find the ACTUAL article thumbnail/featured image URL from news articles
            - Look for og:image URLs or article header images from sites like:
              BBC, CNN, TechCrunch, The Verge, Reuters, CNET, Wired, etc.
            - Images must be DIRECT URLs ending in .jpg, .png, or .webp
            - DO NOT use vertexaisearch or grounding-api-redirect URLs
            - Example valid URL: https://ichef.bbci.co.uk/news/1024/cpsprodpb/image.jpg
            - If you cannot find a direct image URL, return an empty array for imageUrls
            
            OUTPUT FORMAT (JSON only, no markdown):
            {
                "topic": "Original topic",
                "sources": [
                    { "title": "Source title", "url": "https://actual-news-site.com/article", "snippet": "Key info", "imageUrl": "https://direct-image-url.jpg" }
                ],
                "facts": ["Fact 1", "Fact 2", "Fact 3"],
                "quotes": ["Quote 1", "Quote 2"],
                "imageUrls": ["https://direct-image1.jpg", "https://direct-image2.jpg"],
                "publishedDate": "When the news was published"
            }
            `;
        }

        // ============== MODE: ANALYZE ==============
        // Analyze and structure the gathered research
        else if (mode === 'analyze') {
            const research = context?.research || {};
            finalPrompt = `
            TASK: You are a content strategist.
            ACTION: Analyze the following research data and create a structured content outline.
            
            RESEARCH DATA:
            Topic: ${research.topic || prompt}
            Facts: ${JSON.stringify(research.facts || [])}
            Quotes: ${JSON.stringify(research.quotes || [])}
            Sources: ${JSON.stringify(research.sources || [])}
            
            REQUIREMENTS:
            1. Identify the main angle/story to focus on.
            2. Create an outline with key sections.
            3. Determine the best category for this content.
            4. Suggest a compelling hook/angle.
            
            OUTPUT FORMAT (JSON only, no markdown):
            {
                "mainAngle": "The primary story angle",
                "category": "Specific category (e.g., AI, Mobile, Cyber Security, Space, Startup, Crypto)",
                "keyPoints": ["Point 1", "Point 2", "Point 3"],
                "outline": ["Section 1", "Section 2", "Section 3"],
                "hook": "Compelling opening hook",
                "tone": "Suggested tone (e.g., informative, exciting, analytical)"
            }
            `;
        }

        // ============== MODE: WRITE-JSON ==============
        // Generate structured blog metadata
        else if (mode === 'write-json') {
            const research = context?.research || {};
            const analysis = context?.analysis || {};
            finalPrompt = `
            TASK: You are a content metadata specialist.
            ACTION: Create blog post metadata based on the analysis.
            
            ANALYSIS:
            Topic: ${research.topic || prompt}
            Main Angle: ${analysis.mainAngle || ''}
            Category: ${analysis.category || ''}
            Hook: ${analysis.hook || ''}
            Available Images: ${JSON.stringify(research.imageUrls || [])}
            
            REQUIREMENTS:
            1. Create an engaging, SEO-friendly title.
            2. Generate a URL-friendly slug (lowercase, hyphens, no special chars).
            3. Write a catchy excerpt (2 sentences max).
            4. Select the best cover image URL from available images.
            
            OUTPUT FORMAT (JSON only, no markdown):
            {
                "title": "Engaging Blog Title",
                "slug": "url-friendly-slug",
                "excerpt": "Catchy short summary",
                "category": "${analysis.category || 'Technology'}",
                "coverImage": "https://best-image-url.jpg"
            }
            `;
        }

        // ============== MODE: WRITE-CONTENT ==============
        // Generate the actual markdown blog content
        else if (mode === 'write-content') {
            const research = context?.research || {};
            const analysis = context?.analysis || {};
            const metadata = context?.metadata || {};
            finalPrompt = `
            TASK: You are a tech journalist.
            ACTION: Write a comprehensive blog post based on the provided research and outline.
            
            BLOG METADATA:
            Title: ${metadata.title || prompt}
            Category: ${metadata.category || analysis.category || ''}
            
            CONTENT GUIDELINES:
            Main Angle: ${analysis.mainAngle || ''}
            Key Points: ${JSON.stringify(analysis.keyPoints || [])}
            Outline: ${JSON.stringify(analysis.outline || [])}
            Hook: ${analysis.hook || ''}
            Tone: ${analysis.tone || 'informative'}
            
            RESEARCH:
            Facts: ${JSON.stringify(research.facts || [])}
            Quotes: ${JSON.stringify(research.quotes || [])}
            Sources: ${JSON.stringify(research.sources || [])}
            
            REQUIREMENTS:
            1. Write in Markdown format.
            2. Start with the title as H1.
            3. Use the hook as the opening paragraph.
            4. Include all key points naturally.
            5. Use quotes from research where appropriate.
            6. Keep the content focused and around 500-800 words.
            7. DO NOT include a Sources section at the end.
            
            OUTPUT FORMAT (JSON only, no markdown wrapping):
            {
                "content": "# Title\\n\\nFull markdown content here..."
            }
            `;
        }

        // ============== MODE: WRITE (Legacy - combined) ==============
        else {
            finalPrompt = `
            TASK: You are a tech news reporter.
            ACTION: Use the Google Search tool to find details and images for the topic: "${prompt}".
            CONTEXT: Today is ${today}.
            
            REQUIREMENTS:
            1. Search specifically for this topic to get the latest updates.
            2. Write a comprehensive Markdown blog post. Keep it focused.
            3. Find a real image URL from the search results. IMPORTANT: The image MUST have a 16:9 aspect ratio (landscape).
            4. IMPORTANT: List all source URLs used at the bottom of the content in a "Sources" section.
            
            5. Determine the most relevant specific category (e.g., Artificial Intelligence, Mobile, Cyber Security, Space, startup, Crypto, etc.).
            
            IMPORTANT OUTPUT FORMAT:
            You must return a VALID JSON object.
            Do not include markdown formatting like \`\`\`json ... \`\`\`. Just the raw JSON string. 
            
            Structure:
            {
                "title": "Engaging Title",
                "slug": "url-friendly-slug",
                "excerpt": "Catchy short summary (2 lines)",
                "category": "Specific Category",
                "coverImage": "https://url-to-image_from_search.com",
                "content": "# Title\\n\\nBody content..."
            }
            `;
        }

        // Retry loop for JSON parsing issues
        const MAX_RETRIES = 3;
        let lastError = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const result = await model.generateContent(finalPrompt);
                const response = await result.response;
                const text = response.text();

                // Cleaning JSON - Robust Regex to find JSON block if model adds text
                let jsonStr = text;

                // Try to extract JSON from code blocks if present
                const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
                if (jsonMatch) {
                    jsonStr = jsonMatch[1];
                } else {
                    // Fallback: cleanup common issues
                    jsonStr = text.replace(/```json/g, '').replace(/```/g, '');
                }

                // Find the first '{' and last '}' to handle any extra text
                const firstOpen = jsonStr.indexOf('{');
                const lastClose = jsonStr.lastIndexOf('}');
                if (firstOpen !== -1 && lastClose !== -1) {
                    jsonStr = jsonStr.substring(firstOpen, lastClose + 1);
                }

                // Try to fix common JSON issues before parsing
                // Fix unescaped newlines in string values
                jsonStr = jsonStr.replace(/(\r\n|\n|\r)(?=(?:[^"]*"[^"]*")*[^"]*"[^"]*$)/g, '\\n');

                const data = JSON.parse(jsonStr);

                // ========== IMAGE URL VALIDATION ==========
                // For modes that return images, validate and fix broken URLs
                if (mode === 'write-json' || mode === 'write') {
                    const category = data.category || context?.analysis?.category || 'Technology';
                    const topic = data.title || context?.research?.topic || prompt;

                    // Validate coverImage
                    if (data.coverImage) {
                        const isValid = await validateImageUrl(data.coverImage);
                        if (!isValid) {
                            console.log(`Invalid coverImage URL: ${data.coverImage}, using placeholder`);
                            data.coverImage = getPlaceholderImage(category, topic);
                        }
                    } else {
                        data.coverImage = getPlaceholderImage(category, topic);
                    }
                }

                // For research mode, validate imageUrls array
                if (mode === 'research' && data.imageUrls && Array.isArray(data.imageUrls)) {
                    const validatedUrls = [];
                    for (const url of data.imageUrls.slice(0, 3)) { // Check first 3 only
                        const isValid = await validateImageUrl(url);
                        if (isValid) {
                            validatedUrls.push(url);
                        }
                    }
                    // If no valid images, add a placeholder
                    if (validatedUrls.length === 0) {
                        validatedUrls.push(getPlaceholderImage('technology', data.topic));
                    }
                    data.imageUrls = validatedUrls;
                }

                return Response.json({ success: true, data: data });

            } catch (parseError) {
                lastError = parseError;
                console.error(`Attempt ${attempt}/${MAX_RETRIES} - JSON Parse Error:`, parseError.message);

                if (attempt < MAX_RETRIES) {
                    // Wait a bit before retrying
                    await new Promise(r => setTimeout(r, 1000));
                    console.log(`Retrying... (attempt ${attempt + 1})`);
                }
            }
        }

        // All retries failed
        throw new Error(`JSON parsing failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);

    } catch (error) {
        console.error("AI Generation Error:", error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
