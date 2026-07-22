import { ATPROTO_DID, CONSTELLATION, SLINGSHOT } from "@/config/atproto";

export type TangledRepoRecord = {
  repoDid: string;
  description?: string;
  website?: string;
  topics?: string[];
};

const STAR_SOURCE = "sh.tangled.feed.star:subject.did";

export async function getTangledStars(repoDid: string): Promise<number> {
  try {
    const params = new URLSearchParams({
      subject: repoDid,
      source: STAR_SOURCE,
      limit: "1",
    });
    const response = await fetch(`${CONSTELLATION}/xrpc/blue.microcosm.links.getBacklinks?${params.toString()}`);
    if (!response.ok) return 0;
    const data: { total?: number } = await response.json();
    return data.total ?? 0;
  } catch {
    return 0;
  }
}

export async function getTangledRepo(rkey: string): Promise<TangledRepoRecord | null> {
  try {
    const params = new URLSearchParams({
      repo: ATPROTO_DID,
      collection: "sh.tangled.repo",
      rkey,
    });
    const response = await fetch(`${SLINGSHOT}/xrpc/com.atproto.repo.getRecord?${params}`);
    if (!response.ok) return null;
    const data: { value: TangledRepoRecord } = await response.json();
    return data.value;
  } catch {
    return null;
  }
}
