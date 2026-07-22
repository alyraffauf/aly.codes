"use client";

import { useState, useEffect } from "react";
import Project from "@/app/components/Project";
import { projects } from "@/data/projects";
import { getRepoData } from "@/app/lib/github";
import { getTangledRepo, getTangledStars } from "@/app/lib/tangled";
import type { ProjectProps } from "@/app/types";

export default function ProjectList({ limit }: { limit?: number }) {
  const [projectsWithData, setProjectsWithData] = useState<ProjectProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const cached = localStorage.getItem("projectsData");
      const cacheTime = localStorage.getItem("projectsDataTime");

      if (cached && cacheTime && Date.now() - Number(cacheTime) < 600000) {
        try {
          setProjectsWithData(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {
          // Corrupted cache; fall through to refetch.
        }
      }

      const data = await Promise.all(
        projects.map(async (project) => {
          if (project.source === "github") {
            const repoData = await getRepoData(project.repo);

            return {
              title: project.title,
              description: repoData?.description || "No description",
              language: repoData?.language || "Unknown",
              link:
                repoData?.homepage ||
                repoData?.html_url ||
                `https://github.com/${project.repo}`,
              stars: repoData?.stargazers_count ?? 0,
            };
          }

          const [repo, stars] = await Promise.all([
            getTangledRepo(project.title),
            getTangledStars(project.repoDid),
          ]);

          return {
            title: project.title,
            description: repo?.description || "No description",
            language: project.language,
            link: repo?.website || `https://tangled.org/${project.repo}`,
            stars,
          };
        }),
      );

      const sorted = data.sort((a, b) => b.stars - a.stars)

      localStorage.setItem("projectsData", JSON.stringify(sorted));
      localStorage.setItem("projectsDataTime", String(Date.now()))

      setProjectsWithData(sorted);
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
