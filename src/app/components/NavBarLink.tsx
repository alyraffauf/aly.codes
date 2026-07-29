import { Link } from "react-router";

type NavBarLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function NavBarLink({ href, children }: NavBarLinkProps) {
  return (
    <Link to={href} className="mr-4 hover:underline">
      {children}
    </Link>
  );
}
