export type NavBarLink = {
  href: string;
  label: string;
};

export const navBarLinks: NavBarLink[] = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
];
