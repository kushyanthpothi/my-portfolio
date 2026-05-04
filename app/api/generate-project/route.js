import { verifyAuth } from '@/lib/authMiddleware';

// ---------------------------------------------------------------------------
// GITHUB URL VALIDATION — SSRF prevention + allowlist enforcement
// ---------------------------------------------------------------------------

/**
 * Parses a GitHub repository URL and extracts owner/repo components.
 * Validates that the URL strictly targets github.com and that owner/repo
 * segments are well-formed identifiers, preventing path-traversal and
 * SSRF attacks through crafted repository names.
 *
 * @param {string} raw - The raw URL string provided by the caller.
 * @returns {{ owner: string, repo: string } | null}
 */
function parseGithubUrl(raw) {
    if (!raw || typeof raw !== 'string') return null;

    let parsed;
    try {
        parsed = new URL(raw);
    } catch {
        return null;
    }

    // Only github.com is an acceptable target — no SSRF via other hosts.
    if (parsed.hostname !== 'github.com') return null;
    // Only allow HTTP(S) schemes.
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;

    // Path must be exactly: /<owner>/<repo> (with optional trailing slash).
    // GitHub identifiers allow letters, digits, hyphens, underscores, and dots.
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

/**
 * Extracts image URLs from markdown content and resolves relative paths.
 * Validates each extracted URL to ensure it is an absolute HTTP(S) URL,
 * blocking javascript: and data: URIs that could be used for XSS.
 *
 * Previously the badge filter used `url.includes('img.shields.io')` which
 * is an incomplete substring check (issue #10). We now use an explicit
 * URL parse so the hostname comparison cannot be bypassed via crafted paths.
 */
function extractImages(markdown, baseUrl, branch = 'main') {
    const BADGE_HOSTNAMES = new Set([
        'img.shields.io',
        'shields.io',
        'github.com',       // GitHub badge CDN paths
        'badge.fury.io',
        'travis-ci.org',
        'travis-ci.com',
        'circleci.com',
        'codecov.io',
    ]);

    const mdRegex = /!\[.*?\]\((.*?)\)/g;
    const htmlRegex = /<img.*?src="(.*?)".*?>/g;

    const raw = [];
    let match;
    while ((match = mdRegex.exec(markdown)) !== null) raw.push(match[1]);
    while ((match = htmlRegex.exec(markdown)) !== null) raw.push(match[1]);

    return raw
        .map(href => {
            if (!href) return null;
            // Resolve relative paths against the GitHub raw content base.
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

            // Block non-HTTP(S) schemes (javascript:, data:, etc.)
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

            // Exclude badge/shield domains using a proper hostname comparison
            // (fixes issue #10 — incomplete URL substring sanitization).
            if (BADGE_HOSTNAMES.has(parsed.hostname)) return false;

            // Exclude by path keywords as a secondary heuristic (not primary).
            const path = parsed.pathname.toLowerCase();
            if (path.includes('/badge/') || path.includes('/shields/')) return false;

            return true;
        });
}

// ---------------------------------------------------------------------------
// GROQ AI GENERATION
// ---------------------------------------------------------------------------

/**
 * Calls the Groq API to generate a structured project description from a README.
 * @param {string} prompt
 * @param {string} groqKey
 */
async function generateWithGroq(prompt, groqKey) {
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
                    content: 'You are a professional portfolio project writer. You extract key information from a GitHub README and write a compelling case study. Always return valid JSON only.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        // Read and discard body to avoid leaking internal error details.
        await response.text();
        throw new Error(`Groq API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) throw new Error('Groq API returned an empty response');

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

        // Strictly validate and parse the URL — SSRF prevention (issues #13, #14).
        const repoInfo = parseGithubUrl(githubUrl);
        if (!repoInfo) {
            return Response.json({ success: false, error: 'Invalid GitHub URL. Only public github.com repositories are supported.' }, { status: 400 });
        }

        const { owner, repo } = repoInfo;

        const groqKey = (process.env.GROQ_API_KEY || '').replace(/['"]/g, '').trim();
        if (!groqKey) {
            return Response.json({ success: false, error: 'GROQ_API_KEY is not configured on the server' }, { status: 500 });
        }

        // Fetch repo metadata and README from GitHub.
        // The owner and repo values have already been validated against a strict
        // identifier regex, so they are safe to interpolate into these URLs.
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

        // Extract and validate images from the README.
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

        console.log('[generate-project] Generating project data with Groq...');
        const aiData = await generateWithGroq(prompt, groqKey);

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
