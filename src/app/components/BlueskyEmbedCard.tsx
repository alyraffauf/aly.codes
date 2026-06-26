import Image from "next/image";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { FaBluesky } from "react-icons/fa6";
import { blueskyPostUrl, type BlueskyPostData } from "@/app/lib/bluesky";
import BlueskyVideoPlayer from "./BlueskyVideoPlayer";

function formatDate(iso: string): string {
  if (!iso) return "----";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "----";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlueskyEmbedCard({
  data,
}: {
  data: BlueskyPostData | null;
}) {
  if (!data) return null;

  const url = blueskyPostUrl(data);

  return (
    <div className="not-prose my-6 flex flex-col gap-3 rounded-lg border-2 border-rose-200 bg-rose-50 p-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-3 no-underline"
      >
        <div className="flex items-center gap-3">
          {data.author.avatar && (
            <Image
              src={data.author.avatar}
              alt={data.author.displayName ?? data.author.handle}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-zinc-900">
              {data.author.displayName ?? data.author.handle}
            </span>
            <span className="text-sm text-zinc-500">
              @{data.author.handle}
            </span>
          </div>
          <FaBluesky className="ml-auto h-5 w-5 shrink-0 text-rose-400" />
        </div>

        <p className="whitespace-pre-line text-zinc-800">{data.text}</p>
      </a>

      {data.embed?.type === "images" && (
        <div className="grid grid-cols-2 gap-2">
          {data.embed.images.map((img) => (
            <Image
              key={img.thumb}
              src={img.thumb}
              alt={img.alt}
              width={400}
              height={300}
              className="rounded-md object-cover"
            />
          ))}
        </div>
      )}

      {data.embed?.type === "video" && (
        <BlueskyVideoPlayer
          playlist={data.embed.playlist}
          thumbnail={data.embed.thumbnail}
        />
      )}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 text-sm text-zinc-500 no-underline"
      >
        <span>{formatDate(data.createdAt)}</span>
        <span className="flex items-center gap-1">
          <Heart className="h-4 w-4" /> {data.likeCount}
        </span>
        <span className="flex items-center gap-1">
          <Repeat2 className="h-4 w-4" /> {data.repostCount}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" /> {data.replyCount}
        </span>
      </a>
    </div>
  );
}
