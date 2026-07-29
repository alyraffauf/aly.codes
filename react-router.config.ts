import type { Config } from "@react-router/dev/config";
import { getAllPosts } from "./src/lib/content/posts";

const postPaths = getAllPosts().map((post) => `/blog/${post.slug}`);

export default {
  appDirectory: "src",
  ssr: false,
  prerender: ["/", "/blog", "/projects", ...postPaths],
} satisfies Config;
