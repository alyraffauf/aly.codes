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
              Hi, I&apos;m Aly! I spend my time building tools, breaking Linux
              systems (and fixing them), and self-hosting my digital life. I
              care deeply about free software, open culture, and making
              technology work for people. Outside of tech, I&apos;m usually
              cycling somewhere I shouldn&apos;t be.
            </p>
            <p className="leading-relaxed">
              This site is hosted on{" "}
              <a
                href="https://aly.social"
                className="text-rose-700 hover:underline"
              >
                aly.social
              </a>
              , my{" "}
              <a
                href="https://atproto.com/"
                className="text-rose-700 hover:underline"
              >
                atproto
              </a>{" "}
              personal data server, with CDN and scaffolding provided by{" "}
              <a
                href="https://wisp.place"
                className="text-rose-700 hover:underline"
              >
                wisp.place
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
        <ProjectList />
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
