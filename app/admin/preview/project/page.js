'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectClient from '../../../projects/[slug]/ProjectClient';

export default function ProjectPreviewPage() {
    const searchParams = useSearchParams();
    const [project, setProject] = useState(null);

    // On mount: load initial data from sessionStorage
    useEffect(() => {
        const storedData = sessionStorage.getItem('preview_project_data');
        if (storedData) {
            try {
                setProject(JSON.parse(storedData));
            } catch (e) {
                console.error('Failed to parse preview data from sessionStorage', e);
            }
        }
    }, []);

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
