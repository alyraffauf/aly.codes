import { resolveAtprotoMiniDoc } from "@/lib/atproto/did";
import type { Did } from "@atcute/lexicons";

export type AtprotoIdentity = {
  did: string;
  handle: string | null;
  pds: string;
};

const identityPromises = new Map<string, Promise<AtprotoIdentity | null>>();

export function getAtprotoIdentity(did: Did): Promise<AtprotoIdentity | null> {
  const cachedIdentity = identityPromises.get(did);
  if (cachedIdentity) return cachedIdentity;

  const identityPromise = resolveAtprotoIdentity(did);
  identityPromises.set(did, identityPromise);
  return identityPromise;
}

async function resolveAtprotoIdentity(did: Did): Promise<AtprotoIdentity | null> {
  try {
    const miniDoc = await resolveAtprotoMiniDoc(did);

    return {
      did: miniDoc.did,
      handle: miniDoc.handle === "handle.invalid" ? null : miniDoc.handle,
      pds: miniDoc.pds,
    };
  } catch {
    return null;
  }
}
