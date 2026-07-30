import { ATPROTO_DID } from "@/config/atproto";
import { createAtprotoClient } from "@/lib/atproto/client";

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
    const response = await createAtprotoClient(pds).get(
      "com.atproto.repo.listRecords",
      {
        params: {
          repo: ATPROTO_DID,
          collection: "app.rocksky.scrobble",
          limit,
          reverse: false,
        },
      },
    );

    if (!response.ok) return [];

    const data = response.data as ListRecordsResponse;

    return data.records.map(({ value }) => value);
  } catch {
    return [];
  }
}
