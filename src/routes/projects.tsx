import type { LinksFunction, MetaFunction } from "react-router";
import ReactMarkdown from "react-markdown";
import ProjectList from "@/app/components/ProjectList";
import { getProjectsContent } from "@/lib/content/projects";

export const meta: MetaFunction = () => [
  { title: "Projects · Aly Raffauf" },
  { name: "description", content: "Projects by Aly Raffauf" },
];

export const links: LinksFunction = () => [
  { rel: "canonical", href: "https://aly.codes/projects/" },
];

export async function loader() {
  return {
    projectsContent: getProjectsContent(),
  };
}

type ProjectsProps = {
  loaderData: { projectsContent: string };
};

export default function Projects({ loaderData }: ProjectsProps) {
  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Projects</h1>
      <div className="prose mb-4 max-w-none prose-a:text-rose-700 prose-a:hover:underline">
        <ReactMarkdown
          components={{
            p({ children }) {
              return <p className="leading-relaxed">{children}</p>;
            },
          }}
        >
          {loaderData.projectsContent}
        </ReactMarkdown>
      </div>
      <ProjectList />
    </>
  );
}
