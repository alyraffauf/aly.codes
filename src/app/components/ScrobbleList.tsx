"use client";

import Scrobble from "@/app/components/Scrobble";
import { useRockskyListens } from "@/hooks/useRockskyListens";

export default function ScrobbleList({
  pds,
  limit,
}: {
  pds: string | null;
  limit?: number;
}) {
  const { scrobbles, isLoading } = useRockskyListens({ pds, limit });

  if (isLoading) {
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
