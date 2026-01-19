import { fetchBlogs, fetchBlogBySlug } from '@/lib/firestoreUtils';
import BlogPostClient from './BlogPostClient';
import StructuredData from '../../../components/StructuredData';
import { generateArticleSchema, generateBreadcrumbSchema } from '../../../lib/seoSchemas';

const BASE_URL = 'https://kushyanth-portfolio.web.app';

export async function generateStaticParams() {
    const blogs = await fetchBlogs();
    const params = blogs.map((blog) => ({
        slug: blog.slug,
    }));
    return [...params, { slug: '__fallback' }];
}

// Dynamic metadata for each blog post
export async function generateMetadata(props) {
    const params = await props.params;
    const blog = await fetchBlogBySlug(params.slug);

    if (!blog) {
        // For fallback pages (newly published blogs not in static build)
        // Return generic metadata - the client will update the title
        return {
            title: 'Loading Article | Kushyanth Pothineni',
            description: 'Loading blog article...',
        };
    }

    return {
        title: blog.title,
        description: blog.excerpt,
        alternates: {
            canonical: `${BASE_URL}/blogs/${blog.slug}`,
        },
        openGraph: {
            title: blog.title,
            description: blog.excerpt,
            url: `${BASE_URL}/blogs/${blog.slug}`,
            type: 'article',
            publishedTime: blog.date,
            modifiedTime: blog.updatedAt || blog.date,
            authors: ['Kushyanth Pothineni'],
            section: blog.category,
            tags: blog.tags || [blog.category],
            images: [
                {
                    url: blog.coverImage,
                    width: 1200,
                    height: 630,
                    alt: blog.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: blog.title,
            description: blog.excerpt,
            images: [blog.coverImage],
        },
        // Additional meta for Google Discover
        other: {
            'article:published_time': blog.date,
            'article:modified_time': blog.updatedAt || blog.date,
            'article:author': 'Kushyanth Pothineni',
            'article:section': blog.category,
        },
    };
}

export default async function BlogPostPage(props) {
    const params = await props.params;
    const blog = await fetchBlogBySlug(params.slug);

    // Fetch related blogs
    const allBlogs = await fetchBlogs();
    const relatedBlogs = blog ? allBlogs.filter(b => b.slug !== params.slug).slice(0, 3) : [];

    const breadcrumbData = generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Blogs', url: `${BASE_URL}/blogs` },
        { name: blog?.title || 'Article', url: `${BASE_URL}/blogs/${params.slug}` },
    ]);

    // Article schema critical for Google Discover
    const articleSchema = blog ? generateArticleSchema(blog) : null;

    return (
        <>
            <StructuredData data={breadcrumbData} />
            {articleSchema && <StructuredData data={articleSchema} />}
            <BlogPostClient initialBlog={blog} initialRelatedBlogs={relatedBlogs} />
        </>
    );
}
