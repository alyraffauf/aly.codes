import Link from "next/link";

type NavBarLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function NavBarLink({ href, children }: NavBarLinkProps) {
  return (
    <Link href={href} className="mr-4 hover:underline">
      {children}
    </Link>
  );
}
