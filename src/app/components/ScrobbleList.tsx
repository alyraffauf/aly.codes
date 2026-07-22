"use client";

import { useEffect, useState } from "react";
import Scrobble from "@/app/components/Scrobble";
import { getRecentRocksky } from "@/lib/providers/rocksky";
import type { RockskyScrobbleRecord } from "@/lib/providers/rocksky";

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
    <div className="max-w-3xl">
      <div>
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
      </div>
    </div>
  );
}
