import { fetchBlogs, fetchProjects } from '@/lib/firestoreUtils';

// Required for static export
export const dynamic = 'force-static';

const BASE_URL = 'https://kushyanth-portfolio.web.app';

export default async function sitemap() {
    // Static pages
    const staticPages = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ];

    // Dynamic blog pages
    let blogPages = [];
    try {
        const blogs = await fetchBlogs();
        blogPages = blogs.map((blog) => ({
            url: `${BASE_URL}/blogs/${blog.slug}`,
            lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(blog.date),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Error fetching blogs for sitemap:', error);
    }

    // Dynamic project pages
    let projectPages = [];
    try {
        const projects = await fetchProjects();
        projectPages = projects.map((project) => ({
            url: `${BASE_URL}/projects/${project.slug}`,
            lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Error fetching projects for sitemap:', error);
    }

    return [...staticPages, ...blogPages, ...projectPages];
}
