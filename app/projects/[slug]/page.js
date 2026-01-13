import { fetchProjects, fetchProjectBySlug } from '@/lib/firestoreUtils';
import ProjectClient from './ProjectClient';
import StructuredData from '../../../components/StructuredData';
import { generateProjectSchema, generateBreadcrumbSchema } from '../../../lib/seoSchemas';

const BASE_URL = 'https://kushyanth-portfolio.web.app';

export async function generateStaticParams() {
    const projects = await fetchProjects();
    const params = projects.map((project) => ({
        slug: project.slug,
    }));
    return [...params, { slug: '__fallback' }];
}

// Dynamic metadata for each project
export async function generateMetadata(props) {
    const params = await props.params;
    const project = await fetchProjectBySlug(params.slug);

    if (!project) {
        return {
            title: 'Project Not Found',
            description: 'The requested project could not be found.',
        };
    }

    return {
        title: project.title,
        description: project.summary,
        alternates: {
            canonical: `${BASE_URL}/projects/${project.slug}`,
        },
        openGraph: {
            title: project.title,
            description: project.summary,
            url: `${BASE_URL}/projects/${project.slug}`,
            type: 'article',
            images: [
                {
                    url: project.heroImage,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: project.summary,
            images: [project.heroImage],
        },
    };
}

export default async function ProjectPage(props) {
    const params = await props.params;
    const project = await fetchProjectBySlug(params.slug);

    const breadcrumbData = generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Projects', url: `${BASE_URL}/projects` },
        { name: project?.title || 'Project', url: `${BASE_URL}/projects/${params.slug}` },
    ]);

    // Project schema for rich results
    const projectSchema = project ? generateProjectSchema(project) : null;

    return (
        <>
            <StructuredData data={breadcrumbData} />
            {projectSchema && <StructuredData data={projectSchema} />}
            <ProjectClient />
        </>
    );
}
