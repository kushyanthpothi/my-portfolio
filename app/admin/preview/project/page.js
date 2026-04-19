'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectClient from '../../../projects/[slug]/ProjectClient';

export default function ProjectPreviewPage() {
    const searchParams = useSearchParams();
    const [project, setProject] = useState(null);

    // On mount: load initial data from URL param
    useEffect(() => {
        const dataParam = searchParams.get('data');
        if (dataParam) {
            try {
                const decoded = JSON.parse(decodeURIComponent(atob(dataParam)));
                setProject(decoded);
            } catch (e) {
                console.error('Failed to decode preview data', e);
            }
        }
    }, [searchParams]);

    // Separate effect: listen for live updates via BroadcastChannel
    useEffect(() => {
        const channel = new BroadcastChannel('livePreview_project');
        channel.onmessage = (e) => {
            if (e.data) setProject(e.data);
        };
        return () => channel.close();
    }, []); // empty dep array — runs once, stays alive for the tab lifetime

    if (!project) {
        return (
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
                Loading preview...
            </main>
        );
    }

    return (
        <ProjectClient initialProject={project} />
    );
}
