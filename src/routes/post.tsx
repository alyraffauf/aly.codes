import { isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import type { MetaFunction } from "react-router";
import BlueskyEmbedCard from "@/app/components/BlueskyEmbedCard";
import BlueskyMentions from "@/app/components/BlueskyMentions";
import { ATPROTO_DID } from "@/config/atproto";
import {
  extractBlueskyEmbedRefs,
  getBlueskyPost,
  type BlueskyPostData,
} from "@/lib/atproto/bluesky";
import { getPostBySlug, type Post } from "@/lib/content/posts";

type PostLoaderData = {
  post: Post;
  blueskyPosts: Array<[string, BlueskyPostData | null]>;
};

type PostProps = {
  loaderData: PostLoaderData;
};

export async function loader({ params }: { params: { slug?: string } }) {
  const post = params.slug ? getPostBySlug(params.slug) : undefined;
  if (!post) throw new Response("Not Found", { status: 404 });

  const blueskyRefs = extractBlueskyEmbedRefs(post.content);
  const fetchedPosts = await Promise.all(blueskyRefs.map(getBlueskyPost));
  const blueskyPosts: Array<[string, BlueskyPostData | null]> = blueskyRefs.map(
    (reference, index) => [reference, fetchedPosts[index]],
  );
  return { post, blueskyPosts };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  if (!loaderData) return [{ title: "Post not found · Aly Raffauf" }];

  const { post } = loaderData;
  const canonicalUrl = `https://aly.codes/blog/${post.slug}/`;
  const coverUrl = post.cover ? `https://aly.codes/${post.cover}` : undefined;

  return [
    { title: `${post.title} · Aly Raffauf` },
    { name: "description", content: post.description },
    { name: "at:author", content: `at://${ATPROTO_DID}` },
    { name: "at:me", content: `at://${ATPROTO_DID}` },
    ...(post.atUri ? [{ name: "at:canonical", content: post.atUri }] : []),
    { property: "og:type", content: "article" },
    { property: "og:site_name", content: "Aly Raffauf" },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.description },
    { property: "og:url", content: canonicalUrl },
    { property: "article:published_time", content: post.date },
    ...(coverUrl ? [{ property: "og:image", content: coverUrl }] : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.title },
    { name: "twitter:description", content: post.description },
    ...(coverUrl ? [{ name: "twitter:image", content: coverUrl }] : []),
    { tagName: "link", rel: "canonical", href: canonicalUrl },
  ];
};

export default function PostRoute({ loaderData }: PostProps) {
  const { post } = loaderData;
  const blueskyDataByRef = new Map(loaderData.blueskyPosts);

  return (
    <article>
      {post.atUri && <link rel="site.standard.document" href={post.atUri} />}
      <h2 className="mb-2 text-2xl font-semibold">{post.title}</h2>
      <p className="mb-8 text-sm text-zinc-600">{post.date}</p>

      {post.cover && !post.hideCover && (
        <img
          src={`/${post.cover}`}
          alt={post.title}
          width={800}
          height={400}
          className="mb-8 rounded-lg"
        />
      )}

      <div className="prose max-w-none prose-a:text-rose-700 prose-a:hover:underline prose-code:text-zinc-800 prose-pre:bg-rose-300 prose-pre:text-zinc-100 prose-hr:border-2 prose-hr:border-rose-300 prose-blockquote:border-l-2 prose-blockquote:border-rose-300 prose-li:marker:text-rose-400">
        <ReactMarkdown
          components={{
            pre({ children }) {
              const child = Array.isArray(children) ? children[0] : children;
              if (
                isValidElement<{ className?: string; children?: string }>(child) &&
                child.props.className?.includes("language-bsky")
              ) {
                const reference = String(child.props.children).trim();
                return <BlueskyEmbedCard data={blueskyDataByRef.get(reference) ?? null} />;
              }
              return <pre>{children}</pre>;
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {post.atUri && <BlueskyMentions subject={post.atUri} />}
    </article>
  );
}
