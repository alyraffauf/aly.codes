"use client";

import { useState } from "react";
import Link from "next/link";
import type { MobileNavProps } from "@/app/types";

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
              href={link.href}
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
