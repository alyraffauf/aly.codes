import type { RockskyScrobbleRecord } from "../types";
import { ATPROTO_DID, PDS } from "@/data/atproto";

type ListRecordsResponse = {
  records: Array<{
    uri: string;
    cid: string;
    value: RockskyScrobbleRecord;
  }>;
  cursor?: string;
};

export async function getRecentRocksky(
  limit = 4,
): Promise<RockskyScrobbleRecord[]> {
  try {
    const params = new URLSearchParams({
      repo: ATPROTO_DID,
      collection: "app.rocksky.scrobble",
      limit: String(limit),
      reverse: "false",
    });

    const response = await fetch(
      `${PDS}/xrpc/com.atproto.repo.listRecords?${params}`,
    );

    if (!response.ok) return [];

    const data = (await response.json()) as ListRecordsResponse;

    return data.records.map(({ value }) => value);
  } catch {
    return [];
  }
}