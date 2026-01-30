import type { NavBarLinkProps } from "@/app/types";
import Link from "next/link";

export default function NavBarLink({ href, children }: NavBarLinkProps) {
  return (
    <Link href={href} className="mr-4 hover:underline">
      {children}
    </Link>
  );
}
