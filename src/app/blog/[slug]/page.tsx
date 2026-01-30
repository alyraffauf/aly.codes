import { getPostBySlug, getAllPosts } from "../../lib/posts";
import type { PostProps } from "../../types";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export default async function PostPage({ params }: PostProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
      <p className="text-sm text-zinc-600 mb-8">{post.date}</p>

      {post.cover && (
        <Image
          src={`/${post.cover}`}
          alt={post.title}
          width={800}
          height={400}
          className="rounded-lg mb-8"
        />
      )}

      <div className="prose prose-a:text-rose-700 prose-a:hover:underline prose-code:text-zinc-800 prose-pre:bg-rose-300 prose-pre:text-zinc-100 prose-hr:border-rose-300 prose-hr:border-2 max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
