// import { Post } from "@/app/lib/posts";
import type { PostPreviewProps } from "@/app/types";
import Link from "next/link";
import Image from "next/image";

export default function PostPreview({
  slug,
  title,
  date,
  description,
  cover,
}: PostPreviewProps) {
  return (
    <>
      <Link
        key={slug}
        href={`/blog/${slug}`}
        className="block p-4 border-2 border-rose-200 rounded-lg hover:bg-rose-300 transition-colors hover:scale-105 hover:animate-jiggle"
      >
        {cover && (
          <div className="relative h-80 mb-3">
            <Image
              src={`/${cover}`}
              alt={title}
              fill
              className="object-cover rounded"
            />
          </div>
        )}

        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="text-xs text-zinc-600 mt-1">{date}</p>

        <p className="text-sm text-zinc-600 mt-1">{description}</p>
      </Link>
    </>
  );
}
