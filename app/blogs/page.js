import BlogsClient from './BlogsClient';
import StructuredData from '../../components/StructuredData';
import { generateBreadcrumbSchema } from '../../lib/seoSchemas';

const BASE_URL = 'https://kushyanth-portfolio.web.app';

export const metadata = {
    title: "Blogs",
    description: "Read the latest articles, insights, and tutorials on software development, technology trends, and the creative process by Kushyanth Pothineni.",
    alternates: {
        canonical: `${BASE_URL}/blogs`,
    },
    openGraph: {
        title: "Blogs | Kushyanth Pothineni",
        description: "Read the latest articles, insights, and tutorials on software development, technology trends, and the creative process.",
        url: `${BASE_URL}/blogs`,
        type: "website",
    },
    twitter: {
        title: "Blogs | Kushyanth Pothineni",
        description: "Read the latest articles, insights, and tutorials on software development, technology trends, and the creative process.",
    },
};

const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Blogs", url: `${BASE_URL}/blogs` },
]);

// CollectionPage schema for blogs listing
const blogsCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blogs',
    description: 'Articles, insights, and tutorials on software development and technology.',
    url: `${BASE_URL}/blogs`,
    isPartOf: {
        '@type': 'WebSite',
        name: 'Kushyanth Pothineni Portfolio',
        url: BASE_URL,
    },
};

export default function BlogsPage() {
    return (
        <>
            <StructuredData data={breadcrumbData} />
            <StructuredData data={blogsCollectionSchema} />
            <BlogsClient />
        </>
    );
}
