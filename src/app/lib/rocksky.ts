import type { AtprotoDidDocument, RockskyScrobbleRecord } from "../types";
import { ATPROTO_DID } from "@/data/atproto";

const PDS = await getPds(ATPROTO_DID)

type ListRecordsResponse = {
  records: Array<{
    uri: string;
    cid: string;
    value: RockskyScrobbleRecord;
  }>;
  cursor?: string;
};

export async function resolveDidDocument(did: string): Promise<AtprotoDidDocument> {
  const didUrl = getDidDocumentUrl(did);

  const response = await fetch(didUrl);

  if (!response.ok) {
    throw new Error(`Failed to resolve DID: ${did}`);
  }

  return (await response.json()) as AtprotoDidDocument;
}

function getDidDocumentUrl(did: string): string {
  if (did.startsWith("did:plc:")) {
    return `https://plc.directory/${encodeURIComponent(did)}`;
  }

  if (did.startsWith("did:web:")) {
    const [, , identifier, ...pathParts] = did.split(":");
    const hostname = decodeURIComponent(identifier);

    if (pathParts.length === 0) {
      return `https://${hostname}/.well-known/did.json`;
    }

    const path = pathParts
      .map((part) => decodeURIComponent(part))
      .join("/");

    return `https://${hostname}/${path}/did.json`;
  }

  throw new Error(`Unsupported DID method: ${did}`);
}

export async function getPds(did: string): Promise<string> {
  const document = await resolveDidDocument(did);

  const pds = document.service.find(
    (service) =>
      service.type === "AtprotoPersonalDataServer" &&
      service.id.endsWith("#atproto_pds"),
  );

  if (!pds) {
    throw new Error(`No PDS found for DID: ${did}`);
  }

  return pds.serviceEndpoint;
}

export async function getRecentRocksky(
  limit = 4,
): Promise<RockskyScrobbleRecord[]> {
  try {
    const params = new URLSearchParams({
      repo: ATPROTO_DID,
      collection: "app.rocksky.scrobble",
      limit: String(limit),
      reverse: "false",
    });

    const response = await fetch(
      `${PDS}/xrpc/com.atproto.repo.listRecords?${params}`,
    );

    if (!response.ok) return [];

    const data = (await response.json()) as ListRecordsResponse;

    return data.records.map(({ value }) => value);
  } catch {
    return [];
  }
}