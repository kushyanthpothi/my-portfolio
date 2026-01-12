import ProjectsClient from './ProjectsClient';
import StructuredData from '../../components/StructuredData';
import { generateBreadcrumbSchema } from '../../lib/seoSchemas';

const BASE_URL = 'https://kushyanth-portfolio.web.app';

export const metadata = {
    title: "Projects",
    description: "Explore my portfolio of projects showcasing innovative solutions in web development, mobile applications, and creative design by Kushyanth Pothineni.",
    alternates: {
        canonical: `${BASE_URL}/projects`,
    },
    openGraph: {
        title: "Projects | Kushyanth Pothineni",
        description: "Explore my portfolio of projects showcasing innovative solutions in web development, mobile applications, and creative design.",
        url: `${BASE_URL}/projects`,
        type: "website",
    },
    twitter: {
        title: "Projects | Kushyanth Pothineni",
        description: "Explore my portfolio of projects showcasing innovative solutions in web development, mobile applications, and creative design.",
    },
};

const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Projects", url: `${BASE_URL}/projects` },
]);

// CollectionPage schema for projects listing
const projectsCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projects',
    description: 'Portfolio of projects showcasing innovative solutions in web development, mobile applications, and creative design.',
    url: `${BASE_URL}/projects`,
    isPartOf: {
        '@type': 'WebSite',
        name: 'Kushyanth Pothineni Portfolio',
        url: BASE_URL,
    },
};

export default function ProjectsPage() {
    return (
        <>
            <StructuredData data={breadcrumbData} />
            <StructuredData data={projectsCollectionSchema} />
            <ProjectsClient />
        </>
    );
}
