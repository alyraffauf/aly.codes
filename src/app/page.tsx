import Image from "next/image";
import { FolderGit, Rss } from "lucide-react";
import ProjectList from "@/app/components/ProjectList";
import SocialLinkList from "@/app/components/SocialLinkList";
import PostList from "@/app/components/PostList";

export default function Home() {
  return (
    <>
      <section className="mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Image
            src="/profile.jpg"
            alt="Aly Raffauf"
            width={200}
            height={200}
            className="rounded-lg"
          />

          {/*<h2 className="text-2xl font-semibold mb-4">About Me</h2>*/}
          <div className="flex flex-col gap-4">
            <p className="leading-relaxed">
              Hi, I&apos;m Aly! I spend my time building{" "}
              <a
                href="https://github.com/alyraffauf/cute.haus"
                className="text-rose-700 hover:underline"
              >
                infrastructure
              </a>
              ,{" "}
              <a
                href="https://github.com/alyraffauf/tartarus"
                className="text-rose-700 hover:underline"
              >
                experimenting
              </a>{" "}
              with AI, and thinking about{" "}
              <a
                href="https://github.com/alyraffauf/atbbs"
                className="text-rose-700 hover:underline"
              >
                decentralized
              </a>{" "}
              communities. I care deeply about free software, open culture, and
              building better futures with tech. And when I&apos;m not at my
              computer, I&apos;m probably cycling somewhere I shouldn&apos;t.
            </p>
            <p className="leading-relaxed">
              This site is hosted on{" "}
              <a
                href="https://cute.haus"
                className="text-rose-700 hover:underline"
              >
                cute.haus
              </a>
              , and available via{" "}
              <a
                href="https://atproto.com/"
                className="text-rose-700 hover:underline"
              >
                atproto
              </a>{" "}
              with{" "}
              <a
                href="https://standard.site/"
                className="text-rose-700 hover:underline"
              >
                standard.site
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        {/*<h2 className="text-2xl font-semibold mb-4">Elsewhere</h2>*/}
        <SocialLinkList />
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
            <Rss /> Recent Posts
          </div>
        </h2>

        <PostList limit={3} />
      </section>
    </>
  );
}
