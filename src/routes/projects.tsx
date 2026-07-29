import type { LinksFunction, MetaFunction } from "react-router";
import ProjectList from "@/app/components/ProjectList";

export const meta: MetaFunction = () => [
  { title: "Projects · Aly Raffauf" },
  { name: "description", content: "Projects by Aly Raffauf" },
];

export const links: LinksFunction = () => [
  { rel: "canonical", href: "https://aly.codes/projects/" },
];

export default function Projects() {
  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold">Projects</h2>
      <ProjectList />
    </>
  );
}
