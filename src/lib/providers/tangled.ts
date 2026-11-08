import { TANGLED_API } from "@/config/atproto";

export type TangledRepoRecord = {
  description?: string;
  website?: string;
};

export async function getTangledStars(repoDid: string): Promise<number> {
  try {
    const url = new URL("/xrpc/org.tangled.feed.countStars", TANGLED_API);
    url.searchParams.set("subject", repoDid);
    const response = await fetch(url);
    if (!response.ok) return 0;
    const data = await response.json();
    return Number.isSafeInteger(data.count) && data.count >= 0 ? data.count : 0;
  } catch {
    return 0;
  }
}

export async function getTangledRepo(
  repoDid: string,
): Promise<TangledRepoRecord | null> {
  try {
    // Bobbin resolves the repo identity to its knot-hosted manifest.
    const url = new URL("/xrpc/org.tangled.repo.getRepoByRepoDid", TANGLED_API);
    url.searchParams.set("repoDid", repoDid);
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (
      data.uri !== `at://${repoDid}/org.tangled.repo.manifest/self` ||
      data.value?.$type !== "org.tangled.repo.manifest"
    ) {
      return null;
    }
    return {
      description:
        typeof data.value.description === "string" ? data.value.description : undefined,
      website: typeof data.value.website === "string" ? data.value.website : undefined,
    };
  } catch {
    return null;
  }
}
