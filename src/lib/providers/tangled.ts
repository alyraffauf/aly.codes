import { ATPROTO_DID, CONSTELLATION, SLINGSHOT } from "@/config/atproto";
import { createAtprotoClient } from "@/lib/atproto/client";

export type TangledRepoRecord = {
  repoDid: string;
  description?: string;
  website?: string;
  topics?: string[];
};

const STAR_SOURCE = "sh.tangled.feed.star:subject.did";

export async function getTangledStars(repoDid: string): Promise<number> {
  try {
    const response = await createAtprotoClient(CONSTELLATION).get(
      "blue.microcosm.links.getBacklinksCount",
      {
        params: {
          subject: repoDid as `${string}:${string}`,
          source: STAR_SOURCE as `${string}:${string}`,
        },
      },
    );
    if (!response.ok) return 0;
    return response.data.total;
  } catch {
    return 0;
  }
}

export async function getTangledRepo(rkey: string): Promise<TangledRepoRecord | null> {
  try {
    const response = await createAtprotoClient(SLINGSHOT).get(
      "com.atproto.repo.getRecord",
      { params: { repo: ATPROTO_DID, collection: "sh.tangled.repo", rkey } },
    );
    if (!response.ok) return null;
    return response.data.value as TangledRepoRecord;
  } catch {
    return null;
  }
}
