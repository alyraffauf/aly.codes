import { ATPROTO_DID } from "@/data/atproto";

export const dynamic = "force-static";

export function GET() {
  return new Response(ATPROTO_DID, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
