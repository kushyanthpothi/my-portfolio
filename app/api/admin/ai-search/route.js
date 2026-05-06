import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/firestoreUtils';

const SYSTEM_PROMPT = `You are an intelligent admin dashboard assistant for a developer portfolio. 
Your job is to parse the user's natural language command and return a structured JSON action.

Available actions:
- navigate: { action: "navigate", target: "/admin/blogs" | "/admin/projects" | "/admin/experiences" | "/admin/ai-automation" | "/admin", message: "string" }
- toggleTheme: { action: "toggleTheme", theme: "dark" | "light", message: "string" }
- openCreateBlog: { action: "openCreateBlog", askForLinks: true, message: "string" }
- openCreateProject: { action: "openCreateProject", message: "string" }
- search: { action: "search", query: "string", scope: "blogs" | "projects" | "all", message: "string" }
- showStats: { action: "showStats", message: "string" }
- unknown: { action: "unknown", message: "string - helpful response explaining what you can do" }

Rules:
- Always return valid JSON only, no markdown or extra text
- For "add new blog", "create article", "write blog" → use openCreateBlog with askForLinks: true
- For "turn off dark mode", "switch to light" → use toggleTheme with theme: "light"
- For "turn on dark mode", "enable dark" → use toggleTheme with theme: "dark"
- For "go to blogs", "show blogs", "manage blogs" → navigate to /admin/blogs
- For "go to projects", "show projects" → navigate to /admin/projects
- For any search intent → use search action
- Keep messages concise and friendly`;

export async function POST(req) {
    try {
        const { query, context } = await req.json();

        if (!query?.trim()) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        // Fetch NVIDIA credentials from Firestore
        const credentials = await getSettings('nvidia_credentials');

        if (!credentials?.apiKey) {
            // Fallback: rule-based parsing if no API key
            const result = ruleBasedParse(query);
            return NextResponse.json({ result, source: 'rules' });
        }

        const contextStr = context
            ? `Current dashboard context: ${JSON.stringify(context)}`
            : '';

        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: JSON.stringify({
                model: 'meta/llama-3.1-8b-instruct',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    {
                        role: 'user',
                        content: `${contextStr}\n\nUser command: "${query}"\n\nReturn only valid JSON action object.`
                    }
                ],
                temperature: 0.1,
                max_tokens: 200,
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[AI Search] NVIDIA API error:', response.status, errorText);
            // Fallback to rule-based
            const result = ruleBasedParse(query);
            return NextResponse.json({ result, source: 'rules-fallback' });
        }

        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content?.trim();

        if (!rawContent) {
            return NextResponse.json({ result: ruleBasedParse(query), source: 'rules-fallback' });
        }

        // Parse JSON from AI response (strip markdown if present)
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return NextResponse.json({ result: ruleBasedParse(query), source: 'rules-fallback' });
        }

        const result = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ result, source: 'nvidia' });

    } catch (error) {
        console.error('[AI Search] Error:', error);
        // Always return a valid fallback rather than 500
        try {
            const { query } = await req.json().catch(() => ({ query: '' }));
            return NextResponse.json({ result: ruleBasedParse(query || ''), source: 'rules-error-fallback' });
        } catch {
            return NextResponse.json({
                result: { action: 'unknown', message: 'Something went wrong. Please try again.' },
                source: 'error'
            });
        }
    }
}

/**
 * Rule-based fallback parser for when NVIDIA API is unavailable.
 * Covers the most common commands without AI.
 */
function ruleBasedParse(query) {
    const q = query.toLowerCase().trim();

    if (/dark mode off|light mode|turn off dark|switch to light|enable light/.test(q)) {
        return { action: 'toggleTheme', theme: 'light', message: 'Switching to light mode...' };
    }
    if (/dark mode|turn on dark|enable dark|switch to dark/.test(q)) {
        return { action: 'toggleTheme', theme: 'dark', message: 'Switching to dark mode...' };
    }
    const hasAddBlog = q.includes('add') && q.includes('blog') && q.indexOf('add') < q.indexOf('blog');
    const hasWriteArticle = q.includes('write') && q.includes('article') && q.indexOf('write') < q.indexOf('article');
    const hasAddArticle = q.includes('add') && q.includes('article') && q.indexOf('add') < q.indexOf('article');
    if (hasAddBlog || q.includes('new blog') || q.includes('create blog') || hasWriteArticle || q.includes('new article') || hasAddArticle) {
        return { action: 'openCreateBlog', askForLinks: true, message: 'Opening blog creation. Please provide source links for AI generation or write manually.' };
    }
    const hasAddProject = q.includes('add') && q.includes('project') && q.indexOf('add') < q.indexOf('project');
    if (hasAddProject || q.includes('new project') || q.includes('create project')) {
        return { action: 'openCreateProject', message: 'Opening project creation form...' };
    }
    if (/go to blog|show blog|manage blog|blog manager|open blog/.test(q)) {
        return { action: 'navigate', target: '/admin/blogs', message: 'Navigating to Blog Manager...' };
    }
    if (/go to project|show project|manage project|project manager|open project/.test(q)) {
        return { action: 'navigate', target: '/admin/projects', message: 'Navigating to Project Manager...' };
    }
    if (/experience|work history|employment/.test(q)) {
        return { action: 'navigate', target: '/admin/experiences', message: 'Navigating to Experience Manager...' };
    }
    if (/ai automation|auto blog|generate|automation/.test(q)) {
        return { action: 'navigate', target: '/admin/ai-automation', message: 'Navigating to AI Automation...' };
    }
    if (/stat|metric|overview|dashboard|home/.test(q)) {
        return { action: 'showStats', message: 'Here are your current dashboard metrics.' };
    }

    return {
        action: 'unknown',
        message: `I can help you navigate the dashboard, manage blogs & projects, or toggle dark mode. Try: "add new blog", "go to projects", or "turn off dark mode".`
    };
}
