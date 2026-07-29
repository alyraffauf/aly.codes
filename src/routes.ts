import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("blog", "./routes/blog.tsx"),
  route("blog/:slug", "./routes/post.tsx"),
  route("projects", "./routes/projects.tsx"),
] satisfies RouteConfig;
