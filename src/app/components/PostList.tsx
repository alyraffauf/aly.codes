import type { Post } from "@/lib/content/posts";
import PostPreview from "../components/PostPreview";

type PostListProps = {
  posts: Post[];
  limit?: number;
};

export default function PostList({ posts, limit }: PostListProps) {
  const visiblePosts = limit ? posts.slice(0, limit) : posts;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-1">
        {visiblePosts.map((post) => (
          <PostPreview
            key={post.slug}
            slug={post.slug}
            title={post.title}
            date={post.date}
            description={post.description}
            cover={post.cover}
            hideCover={post.hideCover}
          />
        ))}
      </div>
    </>
  );
}
