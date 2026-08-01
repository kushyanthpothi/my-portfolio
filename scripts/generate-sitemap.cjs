const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://kushyanth-portfolio.web.app';
const FIRESTORE_API = 'https://firestore.googleapis.com/v1/projects/kushyanth-portfolio/databases/(default)/documents';

const STATIC_PAGES = ['', '/about', '/blogs', '/projects', '/contact'];

async function fetchCollection(collection) {
  const docs = [];
  let pageToken = '';
  do {
    const url =
      `${FIRESTORE_API}/${collection}?pageSize=300` +
      (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${collection}: HTTP ${res.status}`);
    const data = await res.json();
    if (data.documents) docs.push(...data.documents);
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  return docs;
}

const lastmodOf = (doc) =>
  doc.updateTime ? new Date(doc.updateTime).toISOString() : new Date().toISOString();

const nowIso = () => new Date().toISOString();

const xmlEscape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

function urlsetXml(entries, { image = false } = {}) {
  const ns = image
    ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="https://www.google.com/schemas/sitemap-image/1.1">'
    : '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const body = entries
    .map(({ loc, lastmod, images }) => {
      const lines = ['  <url>', `    <loc>${xmlEscape(loc)}</loc>`];
      if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
      for (const img of images || []) {
        lines.push(
          '    <image:image>',
          `      <image:loc>${xmlEscape(img)}</image:loc>`,
          '    </image:image>'
        );
      }
      lines.push('  </url>');
      return lines.join('\n');
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n${ns}\n${body}\n</urlset>\n`;
}

function indexXml(sitemaps) {
  const body = sitemaps
    .map(
      ({ loc, lastmod }) =>
        `  <sitemap>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

async function main() {
  const [blogs, projects] = await Promise.all([
    fetchCollection('blogs'),
    fetchCollection('projects'),
  ]);

  const blogEntries = blogs.map((doc) => {
    const slug = doc.name.split('/').pop();
    const fields = doc.fields || {};
    const img = fields.coverImage?.stringValue || fields.heroImage?.stringValue || '';
    return {
      loc: `${BASE_URL}/blogs/${slug}`,
      lastmod: lastmodOf(doc),
      images: img ? [img] : [],
    };
  });

  const projectEntries = projects.map((doc) => {
    const slug = doc.name.split('/').pop();
    return { loc: `${BASE_URL}/projects/${slug}`, lastmod: lastmodOf(doc), images: [] };
  });

  const staticEntries = STATIC_PAGES.map((p) => ({
    loc: `${BASE_URL}${p}`,
    lastmod: nowIso(),
    images: [],
  }));

  const publicDir = path.join(__dirname, '..', 'public');
  fs.mkdirSync(publicDir, { recursive: true });

  fs.writeFileSync(
    path.join(publicDir, 'sitemap.xml'),
    indexXml([
      { loc: `${BASE_URL}/sitemap-static.xml`, lastmod: nowIso() },
      { loc: `${BASE_URL}/sitemap-blogs.xml`, lastmod: nowIso() },
      { loc: `${BASE_URL}/sitemap-projects.xml`, lastmod: nowIso() },
    ])
  );
  fs.writeFileSync(path.join(publicDir, 'sitemap-static.xml'), urlsetXml(staticEntries));
  fs.writeFileSync(path.join(publicDir, 'sitemap-blogs.xml'), urlsetXml(blogEntries, { image: true }));
  fs.writeFileSync(path.join(publicDir, 'sitemap-projects.xml'), urlsetXml(projectEntries));

  console.log(
    `Generated sitemap index + child sitemaps: ${staticEntries.length} static, ${blogEntries.length} blogs, ${projectEntries.length} projects.`
  );
}

main().catch((err) => {
  console.error('Sitemap generation failed:', err.message);
  process.exit(1);
});
