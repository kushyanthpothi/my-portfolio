const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://kushyanth-portfolio.web.app';

async function generateSitemap() {
  const staticPages = [
    { url: '', changefreq: 'weekly', priority: '1.0' },
    { url: '/about', changefreq: 'monthly', priority: '0.8' },
    { url: '/blogs', changefreq: 'daily', priority: '0.9' },
    { url: '/projects', changefreq: 'weekly', priority: '0.9' },
    { url: '/contact', changefreq: 'monthly', priority: '0.7' }
  ];

  let blogs = [];
  try {
    const res = await fetch('https://firestore.googleapis.com/v1/projects/kushyanth-portfolio/databases/(default)/documents/blogs');
    const data = await res.json();
    if (data.documents) {
      blogs = data.documents.map(doc => {
        const slug = doc.name.split('/').pop();
        const fields = doc.fields || {};
        const updateTime = doc.updateTime ? new Date(doc.updateTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const imageUrl = fields.coverImage?.stringValue || fields.heroImage?.stringValue || '';
        return {
          url: `/blogs/${slug}`,
          lastmod: updateTime,
          changefreq: 'weekly',
          priority: '0.7',
          images: imageUrl ? [imageUrl] : []
        };
      });
    }
  } catch (err) {
    console.error('Error fetching blogs for sitemap:', err);
  }

  let projects = [];
  try {
    const res = await fetch('https://firestore.googleapis.com/v1/projects/kushyanth-portfolio/databases/(default)/documents/projects');
    const data = await res.json();
    if (data.documents) {
      projects = data.documents.map(doc => {
        const slug = doc.name.split('/').pop();
        const fields = doc.fields || {};
        const updateTime = doc.updateTime ? new Date(doc.updateTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const imageUrl = fields.heroImage?.stringValue || fields.coverImage?.stringValue || '';
        return {
          url: `/projects/${slug}`,
          lastmod: updateTime,
          changefreq: 'monthly',
          priority: '0.7',
          images: imageUrl ? [imageUrl] : []
        };
      });
    }
  } catch (err) {
    console.error('Error fetching projects for sitemap:', err);
  }

  const today = new Date().toISOString().split('T')[0];

  const allPages = [
    ...staticPages.map(p => ({
      ...p,
      lastmod: today,
      images: []
    })),
    ...blogs,
    ...projects
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="https://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => {
  const loc = `    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;
  const images = page.images.length > 0
    ? '\n' + page.images.map(img => `    <image:image>
      <image:loc>${img}</image:loc>
    </image:image>`).join('\n')
    : '';
  return `  <url>${loc}${images}
  </url>`;
}).join('\n')}
</urlset>`;

  const outDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml);
  console.log(`Successfully generated sitemap.xml with ${allPages.length} links (${blogs.length} blogs, ${projects.length} projects).`);
}

generateSitemap();
