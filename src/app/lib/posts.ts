import type { Post } from "@/app/types";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import toml from "toml";

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getAllPosts(limit?: number): Post[] {
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter((name) => name.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents, {
        delimiters: ["+++", "+++"],
        language: "toml",
        engines: {
          toml: toml.parse.bind(toml),
        },
      });

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        content,
        cover: data.cover ?? null,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return limit ? posts.slice(0, limit) : posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug == slug);
}
