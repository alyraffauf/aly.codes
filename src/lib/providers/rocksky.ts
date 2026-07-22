import { ATPROTO_DID } from "@/config/atproto";

export type RockskyScrobbleRecord = {
  $type: "app.rocksky.scrobble";
  album: string;
  albumArtUrl: string;
  albumArtist: string;
  artist: string;
  artists: RockskyArtist[];
  createdAt: string;
  discNumber: number;
  duration: number;
  isrc: string;
  mbid: string;
  releaseDate: string;
  spotifyLink: string;
  tags: string[];
  title: string;
  trackNumber: number;
  year: number;
};

export type RockskyArtist = {
  mbid: string;
  name: string;
};

type ListRecordsResponse = {
  records: Array<{
    uri: string;
    cid: string;
    value: RockskyScrobbleRecord;
  }>;
  cursor?: string;
};

export async function getRecentRocksky(
  pds: string | null,
  limit = 4,
): Promise<RockskyScrobbleRecord[]> {
  if (!pds) return [];

  try {
    const params = new URLSearchParams({
      repo: ATPROTO_DID,
      collection: "app.rocksky.scrobble",
      limit: String(limit),
      reverse: "false",
    });

    const response = await fetch(`${pds}/xrpc/com.atproto.repo.listRecords?${params}`, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    const data = (await response.json()) as ListRecordsResponse;

    return data.records.map(({ value }) => value);
  } catch {
    return [];
  }
}
