import { getPublishedPosts } from "../../src/blog/data";
import { getCanonicalUrl, getSiteName } from "../../src/blog/seo";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts();
  const latest = posts.slice(0, 20);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const siteName = getSiteName();

  const items = latest
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(getCanonicalUrl(`/blog/${post.slug}`))}</link>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : ""}</pubDate>
      <guid isPermaLink="true">${escapeXml(getCanonicalUrl(`/blog/${post.slug}`))}</guid>
      <author>${escapeXml(post.author.name)}</author>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Latest posts from ${escapeXml(siteName)}</description>
    <language>en</language>
    <atom:link href="${escapeXml(getCanonicalUrl("/feed.xml"))}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
