import { verifyAuth } from '@/lib/authMiddleware';

const GH = 'https://api.github.com';

export async function POST(req) {
    try {
        const authResult = await verifyAuth(req);
        if (authResult.error) {
            return Response.json({ success: false, error: authResult.error }, { status: authResult.status });
        }

        const { workflow, ref = 'main' } = await req.json();

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

        // 1. Dispatch the workflow
        const dispatchRes = await fetch(
            `${GH}/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`,
            {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ref }),
            }
        );

        if (!dispatchRes.ok && dispatchRes.status !== 204) {
            const body = await dispatchRes.text().catch(() => '');
            return Response.json({ success: false, error: `Dispatch failed (${dispatchRes.status}): ${body}` }, { status: 500 });
        }

        // Return early to let the client handle polling if needed
        return Response.json({ success: true, message: 'Workflow dispatched successfully' });
    } catch (error) {
        console.error("GitHub Dispatch Error:", error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
