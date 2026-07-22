import type { RepoData } from "@/app/types";

export async function getRepoData(
  githubRepo: string,
): Promise<RepoData | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${githubRepo}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
