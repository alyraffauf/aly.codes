import { createAtprotoClient } from "@/lib/atproto/client";
import type { ResourceUri } from "@atcute/lexicons";

export type BlueskyEmbed =
  | { type: "images"; images: { thumb: string; alt: string }[] }
  | { type: "video"; thumbnail: string; playlist: string }
  | null;

export type BlueskyPostData = {
  uri: string;
  author: {
    handle: string;
    displayName?: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
  likeCount: number;
  repostCount: number;
  replyCount: number;
  embed: BlueskyEmbed;
};

export function blueskyPostUrl(data: BlueskyPostData): string {
  const rkey = data.uri.split("/").pop();
  return `https://bsky.app/profile/${data.author.handle}/post/${rkey}`;
}

const BLUESKY_CODE_BLOCK_REGEX = /```bsky\s*\n(.+?)\n```/g;

export function extractBlueskyEmbedRefs(content: string): string[] {
  return [...content.matchAll(BLUESKY_CODE_BLOCK_REGEX)].map((match) =>
    match[1].trim(),
  );
}

const BLUESKY_PUBLIC_API = "https://public.api.bsky.app";
const POST_BATCH_SIZE = 25;

type BlueskyPostView = {
  uri: string;
  author: { handle: string; displayName?: string; avatar?: string };
  record?: { text?: string; createdAt?: string };
  indexedAt?: string;
  likeCount?: number;
  repostCount?: number;
  replyCount?: number;
  embed?: {
    $type: string;
    images?: { thumb: string; alt?: string }[];
    thumbnail?: string;
    playlist?: string;
  };
};

function parseBlueskyPostView(post: BlueskyPostView): BlueskyPostData | null {
  let embed: BlueskyEmbed = null;
  if (post.embed?.$type === "app.bsky.embed.images#view") {
    embed = {
      type: "images",
      images: (post.embed.images ?? []).map((image) => ({
        thumb: image.thumb,
        alt: image.alt ?? "",
      })),
    };
  } else if (post.embed?.$type === "app.bsky.embed.video#view") {
    embed = {
      type: "video",
      thumbnail: post.embed.thumbnail ?? "",
      playlist: post.embed.playlist ?? "",
    };
  }

  return {
    uri: post.uri,
    author: {
      handle: post.author.handle,
      displayName: post.author.displayName,
      avatar: post.author.avatar,
    },
    text: post.record?.text ?? "",
    createdAt: post.record?.createdAt ?? post.indexedAt ?? "",
    likeCount: post.likeCount ?? 0,
    repostCount: post.repostCount ?? 0,
    replyCount: post.replyCount ?? 0,
    embed,
  };
}

export async function getBlueskyPostsByUris(
  atUris: string[],
): Promise<(BlueskyPostData | null)[]> {
  if (atUris.length === 0) return [];

  const found = new Map<string, BlueskyPostData>();

  for (let index = 0; index < atUris.length; index += POST_BATCH_SIZE) {
    const batch = atUris.slice(index, index + POST_BATCH_SIZE);
    let posts: BlueskyPostView[] = [];
    try {
      const response = await createAtprotoClient(BLUESKY_PUBLIC_API).get(
        "app.bsky.feed.getPosts",
        { params: { uris: batch as ResourceUri[] } },
      );
      if (response.ok) posts = response.data.posts as BlueskyPostView[];
    } catch {
      posts = [];
    }

    for (const post of posts) {
      const parsed = parseBlueskyPostView(post);
      if (parsed) found.set(parsed.uri, parsed);
    }
  }

  return atUris.map((uri) => found.get(uri) ?? null);
}

export async function getBlueskyPost(atUri: string): Promise<BlueskyPostData | null> {
  const [post] = await getBlueskyPostsByUris([atUri]);
  return post;
}
