import { verifyAuth } from '@/lib/authMiddleware';

const GH = 'https://api.github.com';

export async function GET(req) {
    try {
        const authResult = await verifyAuth(req);
        if (authResult.error) {
            return Response.json({ success: false, error: authResult.error }, { status: authResult.status });
        }

        const url = new URL(req.url);
        const workflow = url.searchParams.get('workflow');
        const status = url.searchParams.get('status') || '';
        
        if (!workflow) {
            return Response.json({ success: false, error: 'Missing workflow parameter' }, { status: 400 });
        }

        const token = process.env.GITHUB_PAT;
        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;

        if (!token || !owner || !repo) {
            return Response.json({ success: false, error: 'GitHub credentials not configured on server' }, { status: 500 });
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        };

        const qs = status ? `&status=${status}` : '';
        const fetchUrl = `${GH}/repos/${owner}/${repo}/actions/workflows/${workflow}/runs?per_page=5${qs}`;

        const res = await fetch(fetchUrl, { headers });

        if (!res.ok) {
            const body = await res.text().catch(() => '');
            return Response.json({ success: false, error: `Failed to fetch runs (${res.status}): ${body}` }, { status: 500 });
        }

        const data = await res.json();
        return Response.json({ success: true, workflow_runs: data.workflow_runs, owner, repo });
    } catch (error) {
        console.error("GitHub Runs Fetch Error:", error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
