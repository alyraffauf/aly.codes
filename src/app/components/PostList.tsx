import { getAllPosts } from "../lib/posts";
import PostPreview from "../components/PostPreview";

export default function PostList({ limit }: { limit?: number }) {
  const posts = getAllPosts(limit);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-1">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            slug={post.slug}
            title={post.title}
            date={post.date}
            description={post.description}
            cover={post.cover}
          />
        ))}
      </div>
    </>
  );
}
