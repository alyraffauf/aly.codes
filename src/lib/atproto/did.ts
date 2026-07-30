import { SLINGSHOT } from "@/config/atproto";
import { createAtprotoClient } from "@/lib/atproto/client";
import type { ActorIdentifier, Did } from "@atcute/lexicons";

export type AtprotoMiniDoc = {
  did: Did;
  handle: string;
  pds: string;
  signing_key: string;
};

/**
 * Resolves an AT Protocol identity through Slingshot's verified MiniDoc
 * endpoint. Unlike a raw DID document, this returns the PDS and handle we
 * actually need, after Slingshot has validated them against the DID.
 */
export async function resolveAtprotoMiniDoc(
  identifier: ActorIdentifier,
): Promise<AtprotoMiniDoc> {
  const response = await createAtprotoClient(SLINGSHOT).get(
    "blue.microcosm.identity.resolveMiniDoc",
    { params: { identifier } },
  );

  if (!response.ok) {
    throw new Error(`Failed to resolve AT Protocol identity: ${identifier}`);
  }

  return response.data;
}
