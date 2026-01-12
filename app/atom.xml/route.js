import { fetchBlogs } from '../../lib/firestoreUtils';

export const dynamic = 'force-static';

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  try {
    const blogs = await fetchBlogs();
    const baseUrl = 'https://kushyanth-portfolio.web.app'; // Replace with your actual domain

    // Construct the Atom XML
    let atomXml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Kushyanth&apos;s Portfolio Blog</title>
  <subtitle>Tech news and updates</subtitle>
  <link href="${baseUrl}/atom.xml" rel="self"/>
  <link href="${baseUrl}/blogs"/>
  <updated>${new Date().toISOString()}</updated>
  <id>${baseUrl}/</id>
  <author>
    <name>Kushyanth</name>
    <email>kushyanth@example.com</email>
  </author>
`;

    blogs.forEach((blog) => {
      const blogUrl = `${baseUrl}/blogs/${blog.slug}`;
      const date = blog.date ? new Date(blog.date).toISOString() : new Date().toISOString();

      atomXml += `
  <entry>
    <title>${escapeXml(blog.title || 'No Title')}</title>
    <link href="${blogUrl}"/>
    <id>${blogUrl}</id>
    <updated>${date}</updated>
    <summary>${escapeXml(blog.excerpt || 'No summary available.')}</summary>
    <content type="html"><![CDATA[${blog.content || ''}]]></content>
  </entry>`;
    });

    atomXml += `
</feed>`;

    // Return the response with the correct Content-Type
    return new Response(atomXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating Atom feed:', error);
    return new Response('Error generating feed', { status: 500 });
  }
}
