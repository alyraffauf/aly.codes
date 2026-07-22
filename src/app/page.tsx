import Image from "next/image";
import { AudioLines, FolderGit, Rss } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getAboutContent } from "@/lib/content/about";
import ProjectList from "@/app/components/ProjectList";
import SocialLinkList from "@/app/components/SocialLinkList";
import PostList from "@/app/components/PostList";
import ScrobbleList from "@/app/components/ScrobbleList";
import { ATPROTO_DID } from "@/config/atproto";
import { getAtprotoIdentity } from "@/lib/atproto/identity";

const aboutContent = getAboutContent();

export default async function Home() {
  const identity = await getAtprotoIdentity(ATPROTO_DID);

  return (
    <>
      <section className="mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Image
            src="/profile.jpg"
            loading="eager"
            alt="Aly Raffauf"
            width={200}
            height={200}
            className="rounded-lg"
          />

          {/*<h2 className="text-2xl font-semibold mb-4">About Me</h2>*/}
          <div className="flex flex-col gap-4">
            <div className="prose prose-a:text-rose-700 prose-a:hover:underline max-w-none">
              <ReactMarkdown
                components={{
                  p({ children }) {
                    return <p className="leading-relaxed">{children}</p>;
                  },
                }}
              >
                {aboutContent}
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
        <ScrobbleList pds={identity?.pds ?? null} limit={4} />
        {identity?.handle && (
          <div className="flex justify-end">
            <a
              href={`https://rocksky.app/profile/${identity.handle}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs text-rose-700 hover:underline"
            >
              Rocksky ↗
            </a>
          </div>
        )}
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

        <PostList limit={3} />
      </section>
    </>
  );
}
