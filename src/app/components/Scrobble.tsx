import { Music2 } from "lucide-react";
import type { RockskyScrobbleRecord } from "@/lib/providers/rocksky";

type ScrobbleProps = Pick<
  RockskyScrobbleRecord,
  "album" | "artist" | "createdAt" | "title" | "spotifyLink"
> & {
  albumArt?: string;
};

function formatRelativeTime(createdAt: string) {
  const elapsedMinutes = Math.round(
    (Date.now() - new Date(createdAt).getTime()) / 60000,
  );

  if (elapsedMinutes < 1) return "just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;

  const elapsedHours = Math.round(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} hr ago`;

  return `${Math.round(elapsedHours / 24)} days ago`;
}

export default function Scrobble({
  title,
  artist,
  album,
  createdAt,
  spotifyLink,
  albumArt,
  index,
}: ScrobbleProps & { index: number }) {
  return (
    <a
      href={spotifyLink}
      target="_blank"
      rel="noreferrer"
      className="group -mx-2 grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-rose-300"
    >
      {albumArt ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={albumArt}
          alt={`${album} album art`}
          width={48}
          height={48}
          className={`size-12 rounded-md object-cover shadow-sm transition-transform group-hover:rotate-0 ${index % 2 === 0 ? "-rotate-2" : "rotate-2"}`}
        />
      ) : (
        <div />
      )}

      <div className="min-w-0">
        <h3 className="line-clamp-2 text-lg font-semibold leading-tight">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-tight text-zinc-600">
          {artist} · {album}
        </p>
      </div>

      <span className="flex items-center gap-1 whitespace-nowrap text-xs text-rose-500">
        <Music2 className="size-3" />
        {formatRelativeTime(createdAt)}
      </span>
    </a>
  );
}
