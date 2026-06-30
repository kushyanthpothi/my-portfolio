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
        const updateTime = doc.updateTime ? new Date(doc.updateTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        return { url: `/blogs/${slug}`, lastmod: updateTime, changefreq: 'weekly', priority: '0.7' };
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
        const updateTime = doc.updateTime ? new Date(doc.updateTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        return { url: `/projects/${slug}`, lastmod: updateTime, changefreq: 'monthly', priority: '0.7' };
      });
    }
  } catch (err) {
    console.error('Error fetching projects for sitemap:', err);
  }

  const allPages = [
    ...staticPages.map(p => ({
      ...p,
      lastmod: new Date().toISOString().split('T')[0]
    })),
    ...blogs,
    ...projects
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const outDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml);
  console.log(`Successfully generated sitemap.xml with ${allPages.length} links.`);
}

generateSitemap();
