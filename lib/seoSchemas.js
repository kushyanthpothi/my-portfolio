// Schema utility functions (can be used in server or client components)

const BASE_URL = 'https://kushyanth-portfolio.web.app';

// Person/Organization Schema
export const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kushyanth Pothineni',
    url: BASE_URL,
    jobTitle: 'Software Development Engineer',
    sameAs: [
        'https://github.com/kushyanth',
        'https://linkedin.com/in/kushyanth',
    ],
    image: `${BASE_URL}/images/profile.jpg`,
};

// Website Schema with SearchAction for sitelinks searchbox
export const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kushyanth Pothineni Portfolio',
    url: BASE_URL,
    description: 'Portfolio of Kushyanth Pothineni - Software Development Engineer specializing in web development, mobile applications, and creative design.',
    author: personSchema,
};

// Site Navigation Schema (helps Google understand site structure for sitelinks)
export const siteNavigationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'SiteNavigationElement',
            '@id': `${BASE_URL}/#about`,
            name: 'About',
            url: `${BASE_URL}/about`,
        },
        {
            '@type': 'SiteNavigationElement',
            '@id': `${BASE_URL}/#blogs`,
            name: 'Blogs',
            url: `${BASE_URL}/blogs`,
        },
        {
            '@type': 'SiteNavigationElement',
            '@id': `${BASE_URL}/#projects`,
            name: 'Projects',
            url: `${BASE_URL}/projects`,
        },
    ],
};

// Generate Article schema for blog posts (important for Google Discover)
export const generateArticleSchema = (blog) => ({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: blog.title,
    description: blog.excerpt,
    image: [blog.coverImage],
    datePublished: blog.date,
    dateModified: blog.updatedAt || blog.date,
    author: {
        '@type': 'Person',
        name: 'Kushyanth Pothineni',
        url: `${BASE_URL}/about`,
    },
    publisher: {
        '@type': 'Person',
        name: 'Kushyanth Pothineni',
        url: BASE_URL,
    },
    mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/blogs/${blog.slug}`,
    },
    articleSection: blog.category,
    keywords: blog.tags ? blog.tags.join(', ') : blog.category,
});

// Generate Project/CreativeWork schema
export const generateProjectSchema = (project) => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.summary,
    image: project.heroImage,
    author: {
        '@type': 'Person',
        name: 'Kushyanth Pothineni',
    },
    applicationCategory: project.category,
    url: `${BASE_URL}/projects/${project.slug}`,
});

// Breadcrumb schema generator
export const generateBreadcrumbSchema = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
    })),
});
