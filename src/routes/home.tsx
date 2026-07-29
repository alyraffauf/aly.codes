import { AudioLines, FolderGit, Rss } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { MetaFunction } from "react-router";
import PostList from "@/app/components/PostList";
import ProjectList from "@/app/components/ProjectList";
import ScrobbleList from "@/app/components/ScrobbleList";
import SocialLinkList from "@/app/components/SocialLinkList";
import { ATPROTO_DID } from "@/config/atproto";
import { getAtprotoIdentity } from "@/lib/atproto/identity";
import { getAboutContent } from "@/lib/content/about";
import { getAllPosts, type Post } from "@/lib/content/posts";

export const meta: MetaFunction = () => [
  { title: "Aly Raffauf" },
  { tagName: "link", rel: "canonical", href: "https://aly.codes/" },
];

export async function loader() {
  const identity = await getAtprotoIdentity(ATPROTO_DID);
  return {
    aboutContent: getAboutContent(),
    pds: identity?.pds ?? null,
    posts: getAllPosts(),
  };
}

type HomeProps = {
  loaderData: { aboutContent: string; pds: string | null; posts: Post[] };
};

export default function Home({ loaderData }: HomeProps) {
  return (
    <>
      <section className="mb-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <img
            src="/profile.jpg"
            alt="Aly Raffauf"
            width={200}
            height={200}
            className="rounded-lg"
          />
          <div className="flex flex-col gap-4">
            <div className="prose max-w-none prose-a:text-rose-700 prose-a:hover:underline">
              <ReactMarkdown
                components={{
                  p({ children }) {
                    return <p className="leading-relaxed">{children}</p>;
                  },
                }}
              >
                {loaderData.aboutContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SocialLinkList />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          <span className="flex items-center gap-2">
            <AudioLines /> Recent Listens
          </span>
        </h2>
        <ScrobbleList pds={loaderData.pds} limit={3} />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          <span className="flex items-center gap-2">
            <FolderGit /> Recent Projects
          </span>
        </h2>
        <ProjectList limit={8} />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          <span className="flex items-center gap-2">
            <Rss /> Recent Blogs
          </span>
        </h2>
        <PostList posts={loaderData.posts} limit={3} />
      </section>
    </>
  );
}
