'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogPostClient from '../../../blogs/[slug]/BlogPostClient';

export default function BlogPreviewPage() {
    const searchParams = useSearchParams();
    const [blog, setBlog] = useState(null);

    // On mount: load initial data from URL param
    useEffect(() => {
        const dataParam = searchParams.get('data');
        if (dataParam) {
            try {
                const decoded = JSON.parse(decodeURIComponent(atob(dataParam)));
                setBlog(decoded);
            } catch (e) {
                console.error('Failed to decode preview data', e);
            }
        }
    }, [searchParams]);

    // Separate effect: listen for live updates via BroadcastChannel
    useEffect(() => {
        const channel = new BroadcastChannel('livePreview_blog');
        channel.onmessage = (e) => {
            if (e.data) setBlog(e.data);
        };
        return () => channel.close();
    }, []); // empty dep array — runs once, stays alive for the tab lifetime

    if (!blog) {
        return (
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
                Loading preview...
            </main>
        );
    }

    return (
        <BlogPostClient initialBlog={blog} />
    );
}
