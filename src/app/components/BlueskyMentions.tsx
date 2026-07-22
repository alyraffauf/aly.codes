"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import BlueskyEmbedCard from "./BlueskyEmbedCard";
import { backlinkAtUri, fetchBacklinks } from "@/lib/atproto/backlinks";
import { getBlueskyPostsByUris, type BlueskyPostData } from "@/lib/atproto/bluesky";

export default function BlueskyMentions({ subject }: { subject: string }) {
  const [posts, setPosts] = useState<BlueskyPostData[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const records = await fetchBacklinks(subject);
        const uris = records.map(backlinkAtUri);
        const fetched = await getBlueskyPostsByUris(uris);
        const resolved = fetched.filter(
          (post): post is BlueskyPostData => post !== null,
        );
        resolved.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        if (!cancelled) setPosts(resolved);
      } catch {
        if (!cancelled) setLoadFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [subject]);

  const isLoading = posts === null && !loadFailed;

  return (
    <section className="not-prose mt-12">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
        <MessageCircle className="h-5 w-5 text-rose-400" />
        Mentions
      </h2>

      {isLoading && <p className="text-sm text-zinc-500">Loading mentions…</p>}

      {loadFailed && (
        <p className="text-sm text-zinc-500">
          Mentions couldn&apos;t be loaded right now.
        </p>
      )}

      {posts !== null && posts.length === 0 && (
        <p className="text-sm text-zinc-500">
          No mentions yet. Share this post on Bluesky to start the conversation.
        </p>
      )}

      {posts !== null && posts.length > 0 && (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <BlueskyEmbedCard key={post.uri} data={post} />
          ))}
        </div>
      )}
    </section>
  );
}
