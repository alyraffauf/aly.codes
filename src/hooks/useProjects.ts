"use client";

import { useState, useEffect } from "react";
import { type ProjectProps } from "@/app/components/Project";
import { projects } from "@/content/projects";
import { getRepoData } from "@/lib/providers/github";
import { getTangledRepo, getTangledStars } from "@/lib/providers/tangled";

export default function useProjects() {
  const [projectsWithData, setProjectsWithData] = useState<ProjectProps[]>([]);
  const [isLoading, setLoading] = useState(true);

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

      const sorted = data.sort((a, b) => b.stars - a.stars);

      localStorage.setItem("projectsData", JSON.stringify(sorted));
      localStorage.setItem("projectsDataTime", String(Date.now()));

      setProjectsWithData(sorted);
      setLoading(false);
    }

    fetchData();
  }, []);

  return { projectsWithData, isLoading };
}
