import { Client, simpleFetchHandler } from "@atcute/client";
import type {} from "@atcute/atproto";
import type {} from "@atcute/bluesky";
import type {} from "@atcute/microcosm";
import type {} from "@atcute/standard-site";
import type {} from "@atcute/tangled";

export function createAtprotoClient(service: string): Client {
  return new Client({ handler: simpleFetchHandler({ service }) });
}
