import Link from "next/link";
import NavBarLink from "@/app/components/NavBarLink";
import MobileNav from "@/app/components/MobileNav";
import { navBarLinks } from "@/data/navBar";
import type { Metadata } from "next";
import BackgroundRoses from "@/app/components/BackgroundRoses";

import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aly Raffauf",
  description: "Aly Raffauf's personal website",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90' fill='%23fda4af'>A</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-pink-100 text-zinc-900">
      <body className={`${quicksand.variable} font-sans antialiased`}>
        <BackgroundRoses />
        <main className="min-h-screen p-8 max-w-3xl mx-auto text-zinc-900">
          <header className="mb-12 flex items-center justify-between">
            <h1 className="text-4xl font-bold">
              <Link href="/">Aly Raffauf</Link>
            </h1>
            <nav className="hidden md:flex gap-4">
              {navBarLinks.map((link) => (
                <NavBarLink key={link.href} href={link.href}>
                  {link.label}
                </NavBarLink>
              ))}
            </nav>

            <div className="md:hidden">
              <MobileNav links={navBarLinks} />
            </div>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
