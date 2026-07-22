import { CONSTELLATION } from "@/config/atproto";

const DOCUMENT_BACKLINK_SOURCE =
  "app.bsky.feed.post:embed.external.associatedRefs[com.atproto.repo.strongRef].uri";
const PAGE_SIZE = 100;

export type BacklinkRecord = {
  did: string;
  collection: string;
  rkey: string;
};

type BacklinksResponse = {
  records?: BacklinkRecord[];
  cursor?: string | null;
};

export function backlinkAtUri(record: BacklinkRecord): string {
  return `at://${record.did}/${record.collection}/${record.rkey}`;
}

export async function fetchBacklinks(
  subject: string,
  source: string = DOCUMENT_BACKLINK_SOURCE,
  limit?: number,
): Promise<BacklinkRecord[]> {
  const allRecords: BacklinkRecord[] = [];
  let cursor: string | null = null;

  do {
    const remaining = limit ? limit - allRecords.length : PAGE_SIZE;
    const pageSize = Math.min(PAGE_SIZE, remaining);
    if (pageSize <= 0) break;

    const params = new URLSearchParams({
      subject,
      source,
      limit: String(pageSize),
    });
    if (cursor) params.set("cursor", cursor);

    const response = await fetch(
      `${CONSTELLATION}/xrpc/blue.microcosm.links.getBacklinks?${params.toString()}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch backlinks: ${response.status}`);
    }

    const page: BacklinksResponse = await response.json();
    allRecords.push(...(page.records ?? []));
    cursor = page.cursor ?? null;
  } while (cursor);

  return limit ? allRecords.slice(0, limit) : allRecords;
}
