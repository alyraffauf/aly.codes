"use client";

import Project from "@/app/components/Project";
import useProjects from "@/hooks/useProjects";

export default function ProjectList({ limit }: { limit?: number }) {
  const { projectsWithData, isLoading } = useProjects();

  if (isLoading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projectsWithData.slice(0, limit).map((project) => (
        <Project
          key={project.title}
          title={project.title}
          description={project.description}
          link={project.link}
          language={project.language}
          stars={project.stars}
        />
      ))}
    </div>
  );
}
