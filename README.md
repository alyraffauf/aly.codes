# aly.codes

Personal site built with React Router framework mode and Tailwind CSS.

## Development

Install dependencies and start the Vite development server:

```bash
bun install
bun dev
```

## Static export

`bun run build` generates static HTML, route data, RSS, and AT Protocol discovery files in `build/client`. Every published post is pre-rendered, so its metadata is available to crawlers before JavaScript runs. Project stars, recent listens, and Bluesky mentions are fetched in the browser after hydration.

Deploy the contents of `build/client` to a static host. Configure the host to serve `__spa-fallback.html` for unmatched application routes if you want client-side fallback navigation for URLs that were not pre-rendered.
