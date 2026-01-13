'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { addBlog, saveSettings, getSettings } from '@/lib/firestoreUtils';
import { FiRefreshCw, FiSave, FiCheckCircle, FiXCircle, FiAlertCircle, FiClock, FiPlay } from 'react-icons/fi';
import Groq from 'groq-sdk';

// --- Client-Side Helper Functions ---

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


export default function AIAutoBlogger() {
    const [config, setConfig] = useState({
        enabled: false,
        model: 'llama-3.3-70b-versatile',
        groqApiKey: '',
        tavilyApiKey: '',
        scheduleTime: '21:00',
        prompt: `Find 5 top trending high-impact tech news topics for {{date}}.`
    });

    const [logs, setLogs] = useState([]);
    const [status, setStatus] = useState('Idle');
    const [timerId, setTimerId] = useState(null);
    const [availableModels, setAvailableModels] = useState([
        'llama-3.3-70b-versatile',
        'llama-3.1-70b-versatile',
        'mixtral-8x7b-32768',
        'gemma2-9b-it'
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch available models from Groq API
    const fetchModels = async (apiKey) => {
        if (!apiKey) {
            addLog('[WARNING] No API key provided to fetch models');
            return;
        }

        try {
            addLog('Fetching available models from Groq...');
            const response = await fetch('https://api.groq.com/openai/v1/models', {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Groq API error: ${response.statusText}`);
            const data = await response.json();

            if (data.data && Array.isArray(data.data)) {
                const models = data.data
                    .filter(m => m.id && (m.id.includes('llama') || m.id.includes('mixtral') || m.id.includes('gemma')))
                    .map(m => m.id)
                    .sort();

                if (models.length > 0) {
                    setAvailableModels(models);
                    addLog(`[SUCCESS] Fetched ${models.length} models from Groq`);
                } else {
                    addLog('[WARNING] No compatible models found');
                }
            }
        } catch (err) {
            console.error('Error fetching models:', err);
            addLog(`[ERROR] Failed to fetch models: ${err.message}`);
        }
    };

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const saved = await getSettings('ai_automation');
                if (saved) {
                    // Ensure we're using a Groq model, not an old OpenRouter/Gemini model
                    const validGroqModels = ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'];
                    const model = validGroqModels.includes(saved.model) ? saved.model : 'llama-3.3-70b-versatile';

                    setConfig(prev => ({ ...prev, ...saved, model }));
                    addLog(`Config loaded from DB. Model: ${model}`);

                    // Fetch models if Groq API key exists
                    if (saved.groqApiKey) {
                        fetchModels(saved.groqApiKey);
                    }
                }
            } catch (err) {
                console.error("Failed to load settings:", err);
            }
        };
        loadConfig();
    }, []);


    // Removed client-side auto-scheduling in favor of GitHub Actions server-side cron.


    const handleSave = async () => {
        setIsLoading(true);
        addLog(`Saving config...`);
        const result = await saveSettings('ai_automation', config);
        if (result.success) {
            addLog('[SUCCESS] Configuration saved to database.');
        } else {
            addLog('[ERROR] Error saving configuration.');
        }
        setIsLoading(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const addLog = (msg) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [`[${timestamp}] ${msg}`, ...prev].slice(0, 50));
    };

    // --- TAVILY SEARCH ---
    const tavilySearch = async (query) => {
        if (!config.tavilyApiKey) {
            addLog('[WARNING] No Tavily API key - skipping web search');
            return null;
        }

        try {
            const response = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: config.tavilyApiKey,
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
            addLog(`[WARNING] Search failed: ${err.message}`);
            return null;
        }
    };

    // --- AI GENERATION WITH GROQ ---
    const generateAI = async (promptText, contextMode, extraContext = {}) => {
        if (!config.groqApiKey) throw new Error("Groq API Key is missing");

        const groq = new Groq({ apiKey: config.groqApiKey, dangerouslyAllowBrowser: true });
        const useSearch = ['discover', 'research'].includes(contextMode);
        const today = new Date().toLocaleDateString();

        let searchResults = null;
        if (useSearch && config.tavilyApiKey) {
            const searchQuery = contextMode === 'discover' ? `trending tech news ${today}` : promptText;
            addLog(`  → Web Search: "${searchQuery}"`);
            searchResults = await tavilySearch(searchQuery);
            if (searchResults) addLog(`  ✓ Found ${searchResults.results?.length || 0} results`);
        }

        let messages = [];
        let systemPrompt = "You are an expert AI assistant. Always respond with valid JSON only. Never include markdown code blocks.";

        if (contextMode === 'discover') {
            const searchContext = searchResults ? `\n\nWEB SEARCH RESULTS:\n${JSON.stringify(searchResults, null, 2)}` : '';
            messages = [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: `Find exactly 5 trending tech news headlines from TODAY: ${today}.

User Criteria: ${promptText}${searchContext}

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
                const completion = await groq.chat.completions.create({
                    model: config.model || "llama-3.3-70b-versatile",
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 8000
                });

                const text = completion.choices[0].message.content;
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
    };

    const runGeneration = async () => {
        setStatus('Running...');
        addLog('Starting AI generation (Groq + Tavily)...');

        if (!config.groqApiKey) {
            addLog('[ERROR] Groq API Key missing');
            setStatus('Error: No API Key');
            return;
        }

        try {
            const today = new Date().toLocaleDateString();
            const populatedPrompt = config.prompt.replace('{{date}}', today);

            addLog(`Step 1: Discovering topics...`);
            const discoverData = await generateAI(populatedPrompt, 'discover');
            const topics = discoverData.topics;

            if (!topics || topics.length === 0) throw new Error("No topics found");
            addLog(`[SUCCESS] Found: ${topics.slice(0, 3).join(', ')}...`);

            // Load existing blogs to check for duplicates
            const { fetchBlogs } = await import('@/lib/firestoreUtils');
            const existingBlogs = await fetchBlogs();
            const existingTitles = existingBlogs.map(b => b.title?.toLowerCase().trim());
            addLog(`Loaded ${existingBlogs.length} existing blogs for duplicate checking`);

            let successCount = 0;
            let skippedCount = 0;
            for (let i = 0; i < topics.length; i++) {
                const topic = topics[i];
                addLog(`\n[${i + 1}/${topics.length}] Processing: "${topic}"`);

                try {
                    // Check if similar blog already exists
                    const topicLower = topic.toLowerCase().trim();
                    const isDuplicate = existingTitles.some(title =>
                        title && (title.includes(topicLower.slice(0, 20)) || topicLower.includes(title.slice(0, 20)))
                    );

                    if (isDuplicate) {
                        addLog(`  [SKIP] Similar article already exists`);
                        skippedCount++;
                        continue;
                    }

                    addLog(`  → Researching...`);
                    const research = await generateAI(topic, 'research');

                    addLog(`  → Analyzing...`);
                    const analysis = await generateAI(topic, 'analyze', { research });

                    addLog(`  → Generating Metadata...`);
                    const metadata = await generateAI(topic, 'write-json', { research, analysis });

                    // Extract image from search results first
                    let coverImage = metadata.coverImage;
                    if (research.imageUrls && research.imageUrls.length > 0) {
                        const validImage = research.imageUrls.find(url => validateImageUrl(url));
                        if (validImage) {
                            coverImage = validImage;
                            addLog(`  ✓ Using image from search results`);
                        }
                    }
                    // Try to get image from sources
                    if ((!coverImage || !validateImageUrl(coverImage)) && research.sources && research.sources.length > 0) {
                        for (const source of research.sources) {
                            if (source.imageUrl && validateImageUrl(source.imageUrl)) {
                                coverImage = source.imageUrl;
                                addLog(`  ✓ Using image from source: ${source.title}`);
                                break;
                            }
                        }
                    }
                    // Fallback to placeholder
                    if (!coverImage || !validateImageUrl(coverImage)) {
                        coverImage = getPlaceholderImage(metadata.category, topic);
                        addLog(`  → Using placeholder image`);
                    }

                    metadata.coverImage = coverImage;

                    addLog(`  → Writing Content...`);
                    const contentData = await generateAI(topic, 'write-content', { research, analysis, metadata });

                    // Ensure content is a string
                    const content = typeof contentData.content === 'string'
                        ? contentData.content
                        : JSON.stringify(contentData.content);

                    const blogPost = {
                        ...metadata,
                        content: content,
                        isAI: true,
                        tags: ['AI', analysis.category || 'Technology']
                    };

                    addLog(`  → Saving to DB...`);
                    const result = await addBlog(blogPost);
                    if (result.success) {
                        addLog(`  [SUCCESS] Published!`);
                        successCount++;
                    } else {
                        addLog(`  [ERROR] DB Save Failed: ${result.error}`);
                    }

                } catch (err) {
                    addLog(`  [ERROR] Topic Failed: ${err.message}`);
                }

                if (i < topics.length - 1) {
                    addLog(`  [WAITING] 3s cool-down...`);
                    await new Promise(r => setTimeout(r, 3000));
                }
            }

            setStatus('Waiting for next cycle');
            addLog(`Cycle complete. Published ${successCount}, Skipped ${skippedCount} duplicates.`);
            scheduleNextRun();

        } catch (error) {
            console.error(error);
            addLog(`CRITICAL FAILURE: ${error.message}`);
            setStatus('System Error');
        }
    };

    return (
        <div className={styles.managerContainer}>
            <div className={styles.managerHeader}>
                <h2 className={styles.sectionTitle}>AI Blog Automation</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: config.enabled ? '#44ff44' : '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FiCheckCircle style={{ fontSize: '14px' }} />
                        {config.enabled ? 'Active' : 'Disabled'}
                    </span>
                    <label className="switch">
                        <input type="checkbox" name="enabled" checked={config.enabled} onChange={handleChange} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            <div className={styles.formGrid}>
                <div className={`${styles.colSpan6} ${styles.formContainer}`}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Configuration</h3>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Groq AI Model</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select name="model" value={config.model} onChange={handleChange} className={styles.select} style={{ flex: 1 }}>
                                {availableModels.map(m => (<option key={m} value={m}>{m}</option>))}
                            </select>
                            <button
                                onClick={() => fetchModels(config.groqApiKey)}
                                className={styles.button}
                                style={{ marginTop: 0, padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px' }}
                                title="Refresh Models from Groq"
                                disabled={!config.groqApiKey}
                            >
                                <FiRefreshCw size={16} />
                            </button>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                            ⚡ Free: 14,400 requests/day | Ultra-fast inference
                        </p>
                    </div>

                    <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                        <label className={styles.label}>Groq API Key (Required)</label>
                        <input
                            name="groqApiKey"
                            type="password"
                            value={config.groqApiKey}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder={config.groqApiKey ? "********" : "gsk_..."}
                        />
                        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                            Get free key at <a href="https://console.groq.com/keys" target="_blank" style={{ color: '#ffd700' }}>Groq Console</a>
                        </p>
                    </div>

                    <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                        <label className={styles.label}>Tavily Search API Key (Optional)</label>
                        <input
                            name="tavilyApiKey"
                            type="password"
                            value={config.tavilyApiKey}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder={config.tavilyApiKey ? "********" : "tvly-..."}
                        />
                        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                            Free: 1,000 queries/month at <a href="https://tavily.com" target="_blank" style={{ color: '#ffd700' }}>Tavily</a> (No credit card required!)
                        </p>
                    </div>

                    <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                        <label className={styles.label}>Schedule Time (Daily)</label>
                        <input name="scheduleTime" type="time" value={config.scheduleTime} onChange={handleChange} className={styles.input} />
                    </div>

                    <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                        <label className={styles.label}>Automation Prompt</label>
                        <textarea
                            name="prompt"
                            value={config.prompt}
                            onChange={handleChange}
                            className={styles.textarea}
                            style={{ height: '150px' }}
                        />
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button onClick={handleSave} className={styles.button} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={isLoading}>
                            <FiSave size={16} />
                            {isLoading ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>

                <div className={`${styles.colSpan6} ${styles.formContainer}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3>Live Activity</h3>
                        <button onClick={runGeneration} className={styles.button} style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FiPlay size={14} />
                            Run Now
                        </button>
                    </div>

                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '1rem',
                        height: '400px',
                        overflowY: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        color: '#aaa'
                    }}>
                        {logs.length === 0 ? (
                            <div style={{ textAlign: 'center', marginTop: '40%' }}>Ready to start...</div>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} style={{ marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                    {log}
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#888', fontSize: '0.85rem' }}>Status:</span>
                        <span style={{ fontWeight: 'bold', color: '#ffd700' }}>{status}</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 60px;
                    height: 32px;
                }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #2a2a2a;
                    transition: .4s;
                    border-radius: 34px;
                    border: 1px solid #444;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 24px;
                    width: 24px;
                    left: 3px;
                    bottom: 3px;
                    background-color: #888;
                    transition: .4s;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                input:checked + .slider {
                    background-color: #ffd700;
                    border-color: #ffd700;
                    box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
                }
                input:checked + .slider:before {
                    transform: translateX(28px);
                    background-color: #000;
                    box-shadow: none;
                }
            `}</style>
        </div>
    );
}
