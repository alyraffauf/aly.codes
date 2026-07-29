import type { LinksFunction, MetaFunction } from "react-router";
import PostList from "@/app/components/PostList";
import { getAllPosts, type Post } from "@/lib/content/posts";

export const meta: MetaFunction = () => [
  { title: "Blog · Aly Raffauf" },
  { name: "description", content: "Posts by Aly Raffauf" },
];

export const links: LinksFunction = () => [
  { rel: "canonical", href: "https://aly.codes/blog/" },
];

export function loader() {
  return { posts: getAllPosts() };
}

type BlogProps = {
  loaderData: { posts: Post[] };
};

export default function Blog({ loaderData }: BlogProps) {
  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold">Blog</h2>
      <PostList posts={loaderData.posts} />
    </>
  );
}
