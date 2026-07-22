import type { ScrobbleProps } from "@/app/types";

export default function Scrobble({
  title,
  artist,
  album,
  spotifyLink,
  albumArt,
}: ScrobbleProps) {
  return (
    <a
      href={spotifyLink}
      target="_blank"
      className="flex h-28 items-center gap-3 rounded-lg border-2 border-rose-200 p-3 transition-colors hover:animate-jiggle hover:scale-105 hover:bg-rose-300"
    >
      {albumArt && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={albumArt}
          alt={`${album} album art`}
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-md object-cover"
        />
      )}

      <div className="min-w-0">
        <h3 className="line-clamp-2 text-lg font-semibold leading-tight">
          {title}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm leading-tight text-zinc-600">
          {artist}
        </p>
      </div>
    </a>
  );
}
