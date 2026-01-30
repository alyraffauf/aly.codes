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
};

export type Project = {
  title: string;
  github: string;
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
