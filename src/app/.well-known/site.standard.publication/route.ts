import { PUBLICATION_URI } from "@/config/standard-site";

export const dynamic = "force-static";

export function GET() {
  return new Response(PUBLICATION_URI, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
