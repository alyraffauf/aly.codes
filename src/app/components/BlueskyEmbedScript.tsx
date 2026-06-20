"use client";

import Script from "next/script";

declare global {
  interface Window {
    bluesky?: { scan: (node?: ParentNode) => void };
  }
}

export default function BlueskyEmbedScript() {
  return (
    <Script
      src="https://embed.bsky.app/static/embed.js"
      strategy="afterInteractive"
      onReady={() => window.bluesky?.scan()}
    />
  );
}
