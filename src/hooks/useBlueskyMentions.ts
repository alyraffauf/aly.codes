import { useEffect, useState } from "react";
import { backlinkAtUri, fetchBacklinks } from "@/lib/atproto/backlinks";
import { getBlueskyPostsByUris, type BlueskyPostData } from "@/lib/atproto/bluesky";

export type UseBlueskyMentionsResult = {
  posts: BlueskyPostData[] | null;
  isLoading: boolean;
  loadFailed: boolean;
};

export function useBlueskyMentions(subject: string): UseBlueskyMentionsResult {
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

  return { posts, isLoading, loadFailed };
}
