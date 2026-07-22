import Image from "next/image";
import { AudioLines, FolderGit, Rss } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getAboutContent } from "@/app/lib/about"
import ProjectList from "@/app/components/ProjectList";
import SocialLinkList from "@/app/components/SocialLinkList";
import PostList from "@/app/components/PostList";
import ScrobbleList from "@/app/components/ScrobbleList";

const aboutContent = getAboutContent();

export default function Home() {
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
        <h2 className="text-2xl font-semibold mb-4">
          <div className="flex items-center gap-2">
            <AudioLines /> Recent Listens
          </div>
        </h2>
        <ScrobbleList limit={4} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          <div className="flex items-center gap-2">
            <FolderGit /> Recent Projects
          </div>
        </h2>
        <ProjectList limit={8} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          {" "}
          <div className="flex items-center gap-2">
            <Rss /> Recent Blogs
          </div>
        </h2>

        <PostList limit={3} />
      </section>
    </>
  );
}
