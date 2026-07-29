import fs from "node:fs";
import path from "node:path";
import { ATPROTO_DID } from "../src/config/atproto";
import { PUBLICATION_URI } from "../src/config/standard-site";
import { getAllPosts } from "../src/lib/content/posts";

const SITE_URL = "https://aly.codes";
const publicDirectory = path.join(process.cwd(), "public");

function escapeXml(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[
        character
      ]!,
  );
}

function generateRss(): string {
  const items = getAllPosts()
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}/</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description ?? "")}</description>
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
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
}

function writeStaticFile(relativePath: string, content: string): void {
  const destination = path.join(publicDirectory, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, content);
}

writeStaticFile("rss.xml", generateRss());
writeStaticFile("index.xml", generateRss());
writeStaticFile(".well-known/atproto-did", ATPROTO_DID);
writeStaticFile(".well-known/site.standard.publication", PUBLICATION_URI);
