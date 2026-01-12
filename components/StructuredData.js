'use client';

// Client component for rendering structured data as JSON-LD scripts
export default function StructuredData({ data }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
