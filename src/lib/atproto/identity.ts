import type { AtprotoDidDocument } from "@/lib/atproto/did";
import { resolveDidDocument } from "@/lib/atproto/did";

export type AtprotoIdentity = {
  did: string;
  handle: string | null;
  pds: string;
  document: AtprotoDidDocument;
};

const identityPromises = new Map<string, Promise<AtprotoIdentity | null>>();

export function getAtprotoIdentity(did: string): Promise<AtprotoIdentity | null> {
  const cachedIdentity = identityPromises.get(did);
  if (cachedIdentity) return cachedIdentity;

  const identityPromise = resolveAtprotoIdentity(did);
  identityPromises.set(did, identityPromise);
  return identityPromise;
}

async function resolveAtprotoIdentity(did: string): Promise<AtprotoIdentity | null> {
  try {
    const document = await resolveDidDocument(did);
    const pds = document.service.find(
      (service) =>
        service.type === "AtprotoPersonalDataServer" &&
        service.id.endsWith("#atproto_pds"),
    )?.serviceEndpoint;

    if (!pds) return null;

    const handleUri = document.alsoKnownAs.find((uri) => uri.startsWith("at://"));

    return {
      did,
      handle: handleUri?.slice("at://".length) ?? null,
      pds,
      document,
    };
  } catch {
    return null;
  }
}
