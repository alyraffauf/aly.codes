import { getAllPosts } from "@/lib/content/posts";

export const dynamic = "force-static";

const SITE_URL = "https://aly.codes";

const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!,
  );

export function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}/</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escape(post.description ?? "")}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Aly Raffauf</title>
    <link>${SITE_URL}</link>
    <description>Aly Raffauf's personal website</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
