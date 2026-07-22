export type NavBarLink = {
  href: string;
  label: string;
};

export type NavBarLinkProps = {
  href: string;
  children: React.ReactNode;
};

export type MobileNavProps = {
  links: NavBarLink[];
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  cover?: string;
  hideCover?: boolean;
  tags?: string[];
  atUri?: string;
};

export type PostProps = {
  params: Promise<{ slug: string }>;
};

export type ProjectProps = {
  title: string;
  description: string;
  link: string;
  stars?: number;
  language: string;
};

export type PostPreviewProps = {
  slug: string;
  title: string;
  date: string;
  description: string;
  cover?: string | null;
  hideCover?: boolean;
};

export type ScrobbleProps = {
  album: string;
  artist: string;
  title: string;
  spotifyLink?: string;
  albumArt?: string;
};

type GithubProject = {
  title: string;
  source: "github";
  repo: string; // "owner/repo", e.g. "alyraffauf/nynx"
};

type TangledProject = {
  title: string;
  source: "tangled";
  repo: string; // "owner/repo", e.g. "aly.codes/nynx"
  repoDid: string;
  language: string;
};

export type Project = GithubProject | TangledProject;

export type TangledRepoRecord = {
  repoDid: string;
  description?: string;
  website?: string;
  topics?: string[];
};

export type RepoData = {
  description: string | null;
  homepage: string | null;
  html_url: string;
  language: string;
  stargazers_count: number;
};

export type SocialLink = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export type SocialLinkProps = {
  href: string;
  children: React.ReactNode;
  icon: React.ElementType;
};


export type RockskyScrobbleRecord = {
  $type: "app.rocksky.scrobble";
  album: string;
  albumArtUrl: string;
  albumArtist: string;
  artist: string;
  artists: RockskyArtist[];
  createdAt: string;
  discNumber: number;
  duration: number;
  isrc: string;
  mbid: string;
  releaseDate: string;
  spotifyLink: string;
  tags: string[];
  title: string;
  trackNumber: number;
  year: number;
};

export type RockskyArtist = {
  mbid: string;
  name: string;
};
