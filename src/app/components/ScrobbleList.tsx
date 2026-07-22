"use client";

import { useEffect, useState } from "react";
import Scrobble from "@/app/components/Scrobble";
import { getRecentRocksky } from "@/lib/providers/rocksky";
import type { RockskyScrobbleRecord } from "@/lib/providers/rocksky";

export default function ScrobbleList({
  pds,
  profileUrl,
  limit,
}: {
  pds: string | null;
  profileUrl?: string;
  limit?: number;
}) {
  const [scrobbles, setScrobbles] = useState<RockskyScrobbleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScrobbles() {
      const cached = localStorage.getItem("scrobbles");
      const cacheTime = localStorage.getItem("scrobblesTime");

      if (cached && cacheTime && Date.now() - Number(cacheTime) < 300000) {
        try {
          setScrobbles(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {
          // Corrupted cache; fall through to refetch.
        }
      }

      setLoading(true);
      const recentScrobbles = await getRecentRocksky(pds, limit ?? 4);
      localStorage.setItem("scrobbles", JSON.stringify(recentScrobbles));
      localStorage.setItem("scrobblesTime", String(Date.now()));
      setScrobbles(recentScrobbles);
      setLoading(false);
    }

    loadScrobbles();
  }, [limit, pds]);

  if (loading) {
    return <p>Loading scrobbles...</p>;
  }

  return (
    <div className="max-w-3xl">
      {scrobbles.slice(0, limit).map((scrobble, index) => (
        <Scrobble
          key={`${scrobble.createdAt}-${scrobble.mbid}`}
          album={scrobble.album}
          createdAt={scrobble.createdAt}
          title={scrobble.title}
          artist={scrobble.artist}
          spotifyLink={scrobble.spotifyLink}
          albumArt={scrobble.albumArtUrl}
          index={index}
        />
      ))}

      {/* {profileUrl && (
        <div className="flex justify-end">
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-xs text-rose-700 hover:underline"
          >
            Rocksky ↗
          </a>
        </div>
      )} */}
    </div>
  );
}
