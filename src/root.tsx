import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import type { LinksFunction, MetaFunction } from "react-router";
import BackgroundRoses from "@/app/components/BackgroundRoses";
import MobileNav from "@/app/components/MobileNav";
import NavBarLink from "@/app/components/NavBarLink";
import { ATPROTO_DID } from "@/config/atproto";
import { PUBLICATION_URI } from "@/config/standard-site";
import { navBarLinks } from "@/content/navigation";
import "./app/globals.css";

const personSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://aly.codes/#aly-raffauf",
  name: "Aly Raffauf",
  url: "https://aly.codes/",
  image: "https://aly.codes/profile.jpg",
  jobTitle: "Software engineer",
  sameAs: [
    "https://github.com/alyraffauf",
    "https://linkedin.com/in/alyraffauf",
    "https://bsky.app/profile/aly.codes",
    "https://tangled.org/aly.codes",
  ],
}).replace(/</g, "\\u003c");

export const meta: MetaFunction = () => [
  { title: "Aly Raffauf" },
  { name: "description", content: "Aly's corner of the internet." },
  { name: "robots", content: "index, follow" },
  { property: "og:type", content: "website" },
  { property: "og:site_name", content: "Aly Raffauf" },
  { property: "og:title", content: "Aly Raffauf" },
  { property: "og:description", content: "Aly's corner of the internet." },
  { property: "og:url", content: "https://aly.codes/" },
  { property: "og:image", content: "https://aly.codes/opengraph-image.png" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Aly Raffauf" },
  { name: "twitter:description", content: "Aly's corner of the internet." },
  { name: "twitter:image", content: "https://aly.codes/opengraph-image.png" },
  { name: "at:author", content: `at://${ATPROTO_DID}` },
  { name: "at:me", content: `at://${ATPROTO_DID}` },
];

export const links: LinksFunction = () => [
  { rel: "alternate", type: "application/rss+xml", href: "/rss.xml" },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  ...(PUBLICATION_URI
    ? [{ rel: "site.standard.publication", href: PUBLICATION_URI }]
    : []),
];

export default function Root() {
  const location = useLocation();

  return (
    <html lang="en" className="bg-pink-100 text-zinc-900">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personSchema }}
        />
        <Meta />
        <Links />
      </head>
      <body className="font-sans antialiased">
        <BackgroundRoses />
        <main className="min-h-screen max-w-3xl mx-auto p-8 text-zinc-900">
          <header className="mb-12 flex items-center justify-between">
            {location.pathname === "/" ? (
              <h1 className="text-4xl font-bold">
                <Link to="/">Aly Raffauf</Link>
              </h1>
            ) : (
              <div className="text-4xl font-bold">
                <Link to="/">Aly Raffauf</Link>
              </div>
            )}
            <nav className="hidden gap-4 md:flex">
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
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
