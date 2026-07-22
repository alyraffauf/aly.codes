export type RepoData = {
  description: string | null;
  homepage: string | null;
  html_url: string;
  language: string;
  stargazers_count: number;
};

export async function getRepoData(githubRepo: string): Promise<RepoData | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${githubRepo}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
