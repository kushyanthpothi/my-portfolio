import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://kushyanth-portfolio.web.app';

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}

export function ArticleSchema({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName = 'Kushyanth Pothineni',
}: ArticleSchemaProps) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${BASE_URL}${url}`,
    author: {
      '@type': 'Person',
      name: authorName,
      url: `${BASE_URL}`,
    },
    publisher: {
      '@type': 'Person',
      name: authorName,
    },
  };

  if (imageUrl) schema.image = imageUrl;
  if (datePublished) schema.datePublished = datePublished;
  if (dateModified) schema.dateModified = dateModified;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

interface ProjectSchemaProps {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  techStack?: string[];
  dateCreated?: string;
}

export function ProjectSchema({
  name,
  description,
  url,
  imageUrl,
  techStack = [],
  dateCreated,
}: ProjectSchemaProps) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: `${BASE_URL}${url}`,
    applicationCategory: 'WebApplication',
    author: {
      '@type': 'Person',
      name: 'Kushyanth Pothineni',
      url: `${BASE_URL}`,
    },
  };

  if (imageUrl) schema.image = imageUrl;
  if (dateCreated) schema.datePublished = dateCreated;
  if (techStack.length > 0) {
    schema.operatingSystem = 'Web';
    schema.browserRequirements = techStack.join(', ');
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Kushyanth Pothineni',
  url: BASE_URL,
  jobTitle: 'Software Development Engineer',
  sameAs: [
    'https://github.com/kushyanthpothi',
    'https://linkedin.com/in/kushyanthpothineni',
  ],
  image: `${BASE_URL}/images/profile.jpg`,
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Kushyanth Pothineni Portfolio',
  url: BASE_URL,
  description:
    'Portfolio of Kushyanth Pothineni - Software Development Engineer specializing in web development, mobile applications, and creative design.',
  author: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kushyanth Pothineni',
  },
};

export function SiteStructuredData() {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
    </Helmet>
  );
}
