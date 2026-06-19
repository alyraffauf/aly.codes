import { config } from "dotenv";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import toml from "toml";
import sharp from "sharp";
import { AtpAgent } from "@atproto/api";

const SITE_URL = "https://aly.codes";
const SITE_NAME = "Aly Raffauf";
const SITE_DESCRIPTION = "Aly Raffauf's personal website";
const SITE_ICON = "profile.jpg";

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const STANDARD_SITE_CONFIG = path.join(
  process.cwd(),
  "src/data/standardSite.ts",
);

const PUBLICATION_COLLECTION = "site.standard.publication";
const DOCUMENT_COLLECTION = "site.standard.document";
const MAX_BLOB_BYTES = 1_000_000;

const rgb = (r: number, g: number, b: number) => ({
  $type: "site.standard.theme.color#rgb",
  r,
  g,
  b,
});

// Matches the site's Tailwind palette: bg-pink-100, text-zinc-900,
// rose-700 link/accent color.
const BASIC_THEME = {
  $type: "site.standard.theme.basic",
  background: rgb(252, 231, 243),
  foreground: rgb(24, 24, 27),
  accent: rgb(190, 18, 60),
  accentForeground: rgb(255, 255, 255),
};

const MIME_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
};

config({ path: path.join(process.cwd(), ".env.local") });

async function loadImageBlob(
  imagePath: string,
): Promise<{ data: Uint8Array; mimeType: string }> {
  const fullPath = path.join(process.cwd(), "public", imagePath);
  const buffer = fs.readFileSync(fullPath);
  const mimeType = MIME_TYPES[path.extname(imagePath).toLowerCase()];
  if (!mimeType) {
    throw new Error(`Unsupported image type: ${imagePath}`);
  }

  if (buffer.length <= MAX_BLOB_BYTES) {
    return { data: buffer, mimeType };
  }

  // Standard.site blob fields (coverImage, icon) must be under 1MB;
  // re-encode oversized images as webp at shrinking quality/size until they fit.
  let quality = 80;
  let width = (await sharp(buffer).metadata()).width;
  let resized: Uint8Array = buffer;
  while (resized.length > MAX_BLOB_BYTES && quality >= 20) {
    let pipeline = sharp(buffer).webp({ quality });
    if (width) pipeline = pipeline.resize({ width, withoutEnlargement: true });
    resized = await pipeline.toBuffer();
    quality -= 15;
    if (width) width = Math.round(width * 0.85);
  }

  return { data: resized, mimeType: "image/webp" };
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .trim();
}

function setFrontmatterField(raw: string, field: string, value: string): string {
  const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const line = `${field} = "${escaped}"`;
  const fieldRegex = new RegExp(`^${field}\\s*=.*$`, "m");

  const match = raw.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+/);
  if (!match) throw new Error("Could not find frontmatter block");
  const block = match[1];

  const newBlock = fieldRegex.test(block)
    ? block.replace(fieldRegex, line)
    : `${block}\n${line}`;

  return raw.replace(match[0], `+++\n${newBlock}\n+++`);
}

async function main() {
  const handle = process.env.ATPROTO_HANDLE;
  const password = process.env.ATPROTO_APP_PASSWORD;
  const service = process.env.ATPROTO_SERVICE ?? "https://pds.cute.haus";

  if (!handle || !password) {
    throw new Error(
      "ATPROTO_HANDLE and ATPROTO_APP_PASSWORD must be set (see .env.local)",
    );
  }

  const agent = new AtpAgent({ service });
  await agent.login({ identifier: handle, password });
  const did = agent.session!.did;

  const { data: iconData, mimeType: iconMimeType } =
    await loadImageBlob(SITE_ICON);
  const uploadedIcon = await agent.com.atproto.repo.uploadBlob(iconData, {
    encoding: iconMimeType,
  });
  const icon = uploadedIcon.data.blob;

  const existingPubs = await agent.com.atproto.repo.listRecords({
    repo: did,
    collection: PUBLICATION_COLLECTION,
  });

  let publicationUri: string;
  if (existingPubs.data.records.length > 0) {
    const record = existingPubs.data.records[0];
    publicationUri = record.uri;
    await agent.com.atproto.repo.putRecord({
      repo: did,
      collection: PUBLICATION_COLLECTION,
      rkey: record.uri.split("/").pop()!,
      record: {
        $type: PUBLICATION_COLLECTION,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        icon,
        basicTheme: BASIC_THEME,
        preferences: { showInDiscover: true },
      },
    });
    console.log(`Updated publication record: ${publicationUri}`);
  } else {
    const created = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: PUBLICATION_COLLECTION,
      record: {
        $type: PUBLICATION_COLLECTION,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        icon,
        basicTheme: BASIC_THEME,
        preferences: { showInDiscover: true },
      },
    });
    publicationUri = created.data.uri;
    console.log(`Created publication record: ${publicationUri}`);
  }

  fs.writeFileSync(
    STANDARD_SITE_CONFIG,
    `// Populated by \`npm run sync:standard-site\`. Do not edit by hand.\nexport const PUBLICATION_URI = "${publicationUri}";\n`,
  );

  const filenames = fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith(".md"));

  for (const filename of filenames) {
    const fullPath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw, {
      delimiters: ["+++", "+++"],
      language: "toml",
      engines: { toml: toml.parse.bind(toml) },
    });

    const slug = filename.replace(/\.md$/, "");

    let coverImage;
    if (data.cover) {
      const { data: blobData, mimeType } = await loadImageBlob(data.cover);
      const uploaded = await agent.com.atproto.repo.uploadBlob(blobData, {
        encoding: mimeType,
      });
      coverImage = uploaded.data.blob;
    }

    const record = {
      $type: DOCUMENT_COLLECTION,
      site: publicationUri,
      title: data.title,
      path: `/blog/${slug}/`,
      description: data.description ?? undefined,
      publishedAt: new Date(data.date).toISOString(),
      tags: data.tags ?? undefined,
      textContent: stripMarkdown(content),
      coverImage,
    };

    let documentUri: string;
    if (data.atUri) {
      const rkey = data.atUri.split("/").pop()!;
      await agent.com.atproto.repo.putRecord({
        repo: did,
        collection: DOCUMENT_COLLECTION,
        rkey,
        record,
      });
      documentUri = data.atUri;
      console.log(`Updated document record for ${slug}: ${documentUri}`);
    } else {
      const created = await agent.com.atproto.repo.createRecord({
        repo: did,
        collection: DOCUMENT_COLLECTION,
        record,
      });
      documentUri = created.data.uri;
      fs.writeFileSync(
        fullPath,
        setFrontmatterField(raw, "atUri", documentUri),
      );
      console.log(`Created document record for ${slug}: ${documentUri}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
