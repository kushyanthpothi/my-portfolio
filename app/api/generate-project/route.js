import { verifyAuth } from '@/lib/authMiddleware';

/**
 * Parses GitHub URL to extract owner and repo name
 */
function parseGithubUrl(url) {
    try {
        const cleanedUrl = url.replace(/\/$/, '');
        const parts = cleanedUrl.split('/');
        const repo = parts.pop();
        const owner = parts.pop();
        if (!owner || !repo) return null;
        return { owner, repo };
    } catch {
        return null;
    }
}

/**
 * Extracts images from markdown content
 */
function extractImages(markdown, baseUrl, branch = 'main') {
    const images = [];
    // Match ![alt](url)
    const mdRegex = /!\[.*?\]\((.*?)\)/g;
    // Match <img src="url" ...>
    const htmlRegex = /<img.*?src="(.*?)".*?>/g;

    let match;
    while ((match = mdRegex.exec(markdown)) !== null) {
        images.push(match[1]);
    }
    while ((match = htmlRegex.exec(markdown)) !== null) {
        images.push(match[1]);
    }

    // Clean and resolve URLs
    return images.map(url => {
        if (url.startsWith('http')) return url;
        // Handle relative paths for GitHub raw content
        return `${baseUrl}/${branch}/${url.replace(/^\.\//, '')}`;
    }).filter(url => {
        // Filter out decorative badges/shields
        const isBadge = url.includes('img.shields.io') || url.includes('badge') || url.includes('github.com/badges');
        return !isBadge;
    });
}

/**
 * Calls Groq API for AI generation
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
                { role: 'system', content: 'You are a professional portfolio project writer. You extract key information from a GitHub README and write a compelling case study. Always return valid JSON only.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Groq API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    
    // Clean and parse JSON
    try {
        return JSON.parse(content);
    } catch (e) {
        // Robust fallback cleaning
        let jsonStr = content.replace(/```json/gi, '').replace(/```/g, '').trim();
        const firstOpen = jsonStr.indexOf('{');
        const lastClose = jsonStr.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose !== -1) {
            jsonStr = jsonStr.substring(firstOpen, lastClose + 1);
        }
        return JSON.parse(jsonStr);
    }
}

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
            return Response.json({ success: false, error: 'Invalid GitHub URL format' }, { status: 400 });
        }

        const { owner, repo } = repoInfo;
        const groqKey = (process.env.GROQ_API_KEY || '').replace(/['"]/g, '').trim();

        console.log(`[DEBUG] GROQ_API_KEY found: ${!!groqKey}`);

        if (!groqKey) {
            return Response.json({ success: false, error: 'GROQ_API_KEY is not configured on the server. Please restart your dev server after adding it to .env.local' }, { status: 500 });
        }

        // 1. Fetch Repo Info (to get default branch) and README
        console.log(`Fetching info and README for ${owner}/${repo}...`);
        
        const [repoResponse, readmeResponse] = await Promise.all([
            fetch(`https://api.github.com/repos/${owner}/${repo}`),
            fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' }
            })
        ]);

        if (!readmeResponse.ok) {
            return Response.json({ success: false, error: 'Failed to fetch README from GitHub. Ensure the repo is public.' }, { status: 404 });
        }

        const repoData = await repoResponse.json();
        const defaultBranch = repoData.default_branch || 'main';
        const readmeText = await readmeResponse.text();
        
        // 2. Extract Images
        const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}`;
        const images = extractImages(readmeText, baseUrl, defaultBranch);
        const heroImage = images.length > 0 ? images[0] : '';
        const contentImages = images.slice(1, 5); // Take up to 4 more images

        // 3. Generate Project Details using Groq
        const prompt = `
        TASK: Extract information from this GitHub README and create a structured portfolio project.
        
        README CONTENT:
        ${readmeText.substring(0, 6000)} // Truncate to avoid token limits
        
        EXTRACTED IMAGES:
        ${JSON.stringify(images)}
        
        REQUIREMENTS:
        1. "title": Catchy project title.
        2. "slug": URL-friendly slug (lowercase, hyphens).
        3. "summary": 1-2 sentence high-level summary.
        4. "year": Current year.
        5. "category": Choose one: Web App, Mobile App, AI/ML, Design, Backend, tool.
        6. "industry": Relevant industry (e.g., Fintech, Health, DevTools).
        7. "problem": A detailed paragraph describing the problem this project solves.
        8. "solution": A detailed paragraph describing how the project solves it.
        9. "challenge": A short paragraph about technical hurdles based on tech stack.
        10. "techStack": Array of technologies used (e.g., ["React", "Firebase"]).
        11. "duration": Estimate (e.g., "3 weeks").
        12. "client": "Personal Project" or "Open Source".
        
        RETURN ONLY VALID JSON.
        `;

        console.log('Generating project data with Groq...');
        const aiData = await generateWithGroq(prompt, groqKey);

        // 4. Combine data
        const finalProjectData = {
            ...aiData,
            github: githubUrl,
            heroImage: heroImage || aiData.heroImage || '',
            contentImages: [...contentImages],
            createdAt: new Date().toISOString()
        };

        return Response.json({ success: true, data: finalProjectData });

    } catch (error) {
        console.error('Project Generation Error:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
