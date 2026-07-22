"use client";

import { useEffect, useState } from "react";
import Scrobble from "@/app/components/Scrobble";
import { getRecentRocksky } from "@/lib/providers/rocksky";
import type { RockskyScrobbleRecord } from "@/lib/providers/rocksky";

const REFRESH_INTERVAL = 20_000;

export default function ScrobbleList({
  pds,
  limit,
}: {
  pds: string | null;
  limit?: number;
}) {
  const [scrobbles, setScrobbles] = useState<RockskyScrobbleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    function loadCachedScrobbles() {
      const cached = localStorage.getItem("scrobbles");
      if (!cached) return;

      try {
        setScrobbles(JSON.parse(cached));
        setLoading(false);
      } catch {
        localStorage.removeItem("scrobbles");
      }
    }

    async function refreshScrobbles() {
      const recentScrobbles = await getRecentRocksky(pds, limit ?? 4);
      if (!isMounted) return;

      localStorage.setItem("scrobbles", JSON.stringify(recentScrobbles));
      setScrobbles(recentScrobbles);
      setLoading(false);
    }

    loadCachedScrobbles();
    refreshScrobbles();

    const refreshTimer = window.setInterval(refreshScrobbles, REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(refreshTimer);
    };
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
    </div>
  );
}
