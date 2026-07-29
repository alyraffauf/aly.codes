import { useState } from "react";
import { Link } from "react-router";
import type { NavBarLink } from "@/content/navigation";

type MobileNavProps = {
  links: NavBarLink[];
};

export default function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-2xl"
        aria-label="Toggle menu"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {isOpen && (
        <div className="absolute right-8 top-16 bg-pink-200 rounded-lg shadow-lg p-4 flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="hover:underline"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
