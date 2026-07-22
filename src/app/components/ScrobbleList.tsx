"use client";

import { useEffect, useState } from "react";
import Scrobble from "@/app/components/Scrobble";
import { getRecentRocksky } from "@/app/lib/rocksky";
import type { RockskyScrobbleRecord } from "@/app/types";

export default function ScrobbleList({ limit }: { limit?: number }) {
  const [scrobbles, setScrobbles] = useState<RockskyScrobbleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScrobbles() {
      setLoading(true);
      const recentScrobbles = await getRecentRocksky(limit ?? 4);
      setScrobbles(recentScrobbles);
      setLoading(false);
    }

    loadScrobbles();
  }, [limit]);

  if (loading) {
    return <p>Loading scrobbles...</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {scrobbles.slice(0, limit).map((scrobble) => (
        <Scrobble
          key={scrobble.mbid}
          album={scrobble.album}
          title={scrobble.title}
          artist={scrobble.artist}
          spotifyLink={scrobble.spotifyLink}
          albumArt={scrobble.albumArtUrl}
        />
      ))}
    </div>
  );
}
