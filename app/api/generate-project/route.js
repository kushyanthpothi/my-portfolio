import { verifyAuth } from '@/lib/authMiddleware';

// ---------------------------------------------------------------------------
// GITHUB URL VALIDATION — SSRF prevention + allowlist enforcement
// ---------------------------------------------------------------------------

function parseGithubUrl(raw) {
    if (!raw || typeof raw !== 'string') return null;

    let parsed;
    try {
        parsed = new URL(raw);
    } catch {
        return null;
    }

    if (parsed.hostname !== 'github.com') return null;
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;

    const segments = parsed.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    if (segments.length < 2) return null;

    const [owner, repo] = segments;
    const GITHUB_IDENT = /^[a-zA-Z0-9_.-]{1,100}$/;
    if (!GITHUB_IDENT.test(owner) || !GITHUB_IDENT.test(repo)) return null;

    return { owner, repo };
}

// ---------------------------------------------------------------------------
// IMAGE EXTRACTION
// ---------------------------------------------------------------------------

function extractImages(markdown, baseUrl, branch = 'main') {
    const BADGE_HOSTNAMES = new Set([
        'img.shields.io', 'shields.io', 'github.com',
        'badge.fury.io', 'travis-ci.org', 'travis-ci.com',
        'circleci.com', 'codecov.io',
    ]);

    const mdRegex   = /!\[.*?\]\((.*?)\)/g;
    const htmlRegex = /<img.*?src="(.*?)".*?>/g;

    const raw = [];
    let match;
    while ((match = mdRegex.exec(markdown))   !== null) raw.push(match[1]);
    while ((match = htmlRegex.exec(markdown)) !== null) raw.push(match[1]);

    return raw
        .map(href => {
            if (!href) return null;
            if (!href.startsWith('http')) {
                return `${baseUrl}/${branch}/${href.replace(/^\.\//, '')}`;
            }
            return href;
        })
        .filter(href => {
            if (!href) return false;
            let parsed;
            try {
                parsed = new URL(href);
            } catch {
                return false;
            }
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
            if (BADGE_HOSTNAMES.has(parsed.hostname)) return false;
            const path = parsed.pathname.toLowerCase();
            if (path.includes('/badge/') || path.includes('/shields/')) return false;
            return true;
        });
}

// ---------------------------------------------------------------------------
// AI PROVIDERS — NVIDIA (primary) → Groq (fallback)
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT =
    'You are a professional portfolio project writer. You extract key information from a ' +
    'GitHub README and write a compelling case study. Always return valid JSON only.';

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
            max_tokens: 4000,
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
            max_completion_tokens: 4000,
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
 * Generates project data from a README prompt.
 * Tries NVIDIA first; falls back to Groq on any error.
 */
async function generateWithAI(prompt, nvidiaKey, groqKey) {
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: prompt }
    ];

    if (nvidiaKey) {
        try {
            console.log('[generate-project] Using NVIDIA API...');
            return await callNvidiaAPI(messages, nvidiaKey);
        } catch (err) {
            console.warn(`[generate-project] NVIDIA failed (${err.message}). Falling back to Groq...`);
        }
    }

    if (!groqKey) {
        throw new Error('NVIDIA API failed and GROQ_API_KEY is not configured.');
    }

    console.log('[generate-project] Using Groq API (fallback)...');
    return await callGroqAPI(messages, groqKey);
}

// ---------------------------------------------------------------------------
// ROUTE HANDLER
// ---------------------------------------------------------------------------

export async function POST(req) {
    try {
        const authResult = await verifyAuth(req);
        if (authResult.error) {
            return Response.json({ success: false, error: authResult.error }, { status: authResult.status });
        }

        const { githubUrl } = await req.json();

        if (!githubUrl) {
            return Response.json({ success: false, error: 'GitHub URL is required' }, { status: 400 });
        }

        const repoInfo = parseGithubUrl(githubUrl);
        if (!repoInfo) {
            return Response.json({ success: false, error: 'Invalid GitHub URL. Only public github.com repositories are supported.' }, { status: 400 });
        }

        const { owner, repo } = repoInfo;

        const nvidiaKey = (process.env.NVIDIA_KEY || '').replace(/['"]/g, '').trim() || null;
        const groqKey   = (process.env.GROQ_API_KEY || '').replace(/['"]/g, '').trim() || null;

        if (!nvidiaKey && !groqKey) {
            return Response.json({ success: false, error: 'No AI provider configured on the server.' }, { status: 500 });
        }

        console.log(`[generate-project] Fetching GitHub data for ${owner}/${repo}...`);

        const [repoResponse, readmeResponse] = await Promise.all([
            fetch(`https://api.github.com/repos/${owner}/${repo}`, {
                headers: { 'Accept': 'application/vnd.github+json' }
            }),
            fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' }
            })
        ]);

        if (!readmeResponse.ok) {
            return Response.json({
                success: false,
                error: 'Failed to fetch README from GitHub. Ensure the repository is public and has a README.'
            }, { status: 404 });
        }

        const repoData = await repoResponse.json();
        const defaultBranch = repoData.default_branch || 'main';
        const readmeText = await readmeResponse.text();

        const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}`;
        const images = extractImages(readmeText, baseUrl, defaultBranch);
        const heroImage = images.length > 0 ? images[0] : '';
        const contentImages = images.slice(1, 5);

        const prompt = `TASK: Extract information from this GitHub README and create a structured portfolio project.

README CONTENT:
${readmeText.substring(0, 6000)}

EXTRACTED IMAGES:
${JSON.stringify(images)}

REQUIREMENTS:
1. "title": Catchy project title.
2. "slug": URL-friendly slug (lowercase, hyphens).
3. "summary": 1-2 sentence high-level summary.
4. "year": Current year.
5. "category": Choose one: Web App, Mobile App, AI/ML, Design, Backend, Tool.
6. "industry": Relevant industry (e.g., Fintech, Health, DevTools).
7. "problem": A detailed paragraph describing the problem this project solves.
8. "solution": A detailed paragraph describing how the project solves it.
9. "challenge": A short paragraph about technical hurdles based on tech stack.
10. "techStack": Array of technologies used (e.g., ["React", "Firebase"]).
11. "duration": Estimate (e.g., "3 weeks").
12. "client": "Personal Project" or "Open Source".

RETURN ONLY VALID JSON.`;

        const aiData = await generateWithAI(prompt, nvidiaKey, groqKey);

        const finalProjectData = {
            ...aiData,
            github: githubUrl,
            heroImage: heroImage || aiData.heroImage || '',
            contentImages: [...contentImages],
            createdAt: new Date().toISOString()
        };

        return Response.json({ success: true, data: finalProjectData });

    } catch (error) {
        console.error('[generate-project] Error:', error.message);
        return Response.json({ success: false, error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
    }
}
