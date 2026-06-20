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

const BLUESKY_POST_URL_REGEX =
  /^https:\/\/bsky\.app\/profile\/([^/]+)\/post\/([a-zA-Z0-9]+)\/?$/;
const BLUESKY_AT_URI_REGEX =
  /^at:\/\/([^/]+)\/app\.bsky\.feed\.post\/([a-zA-Z0-9]+)$/;

async function resolveHandleToDid(handle: string): Promise<string | null> {
  if (handle.startsWith("did:")) return handle;

  const res = await fetch(
    `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`,
  );
  if (!res.ok) return null;

  const { did } = await res.json();
  return did ?? null;
}

export async function getBlueskyPostByRef(
  ref: string,
): Promise<BlueskyPostData | null> {
  const match = ref.match(BLUESKY_AT_URI_REGEX) ?? ref.match(BLUESKY_POST_URL_REGEX);
  if (!match) return null;

  const [, authority, rkey] = match;
  const did = await resolveHandleToDid(authority);
  if (!did) return null;

  return getBlueskyPost(`at://${did}/app.bsky.feed.post/${rkey}`);
}

async function getBlueskyPost(atUri: string): Promise<BlueskyPostData | null> {
  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPosts?uris=${encodeURIComponent(atUri)}`,
  );
  if (!res.ok) return null;

  const json = await res.json();
  const post = json.posts?.[0];
  if (!post) return null;

  let embed: BlueskyEmbed = null;
  if (post.embed?.$type === "app.bsky.embed.images#view") {
    embed = {
      type: "images",
      images: post.embed.images.map(
        (img: { thumb: string; alt?: string }) => ({
          thumb: img.thumb,
          alt: img.alt ?? "",
        }),
      ),
    };
  } else if (post.embed?.$type === "app.bsky.embed.video#view") {
    embed = {
      type: "video",
      thumbnail: post.embed.thumbnail,
      playlist: post.embed.playlist,
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
    createdAt: post.record?.createdAt ?? post.indexedAt,
    likeCount: post.likeCount ?? 0,
    repostCount: post.repostCount ?? 0,
    replyCount: post.replyCount ?? 0,
    embed,
  };
}
