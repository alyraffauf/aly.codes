"use client";

import { useState, useEffect } from "react";
import Project from "@/app/components/Project";
import { projects } from "@/data/projects";
import type { ProjectProps, RepoData } from "@/app/types";

async function getRepoData(githubRepo: string): Promise<RepoData | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${githubRepo}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default function ProjectList({ limit }: { limit?: number }) {
  const [projectsWithData, setProjectsWithData] = useState<ProjectProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const cached = localStorage.getItem("projectsData");
      const cacheTime = localStorage.getItem("projectsDataTime");

      if (cached && cacheTime && Date.now() - Number(cacheTime) < 600000) {
        setProjectsWithData(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const data = await Promise.all(
        projects.map(async (project) => {
          const repoData = await getRepoData(project.github);

          return {
            title: project.title,
            description: repoData?.description || "No description",
            language: repoData?.language || "Unknown",
            link:
              repoData?.homepage ||
              repoData?.html_url ||
              `https://github.com/${project.github}`,
            stars: repoData?.stargazers_count ?? 0,
          };
        }),
      );

      setProjectsWithData(data.sort((a, b) => b.stars - a.stars));
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
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
