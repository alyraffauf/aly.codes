export type AtprotoDidDocument = {
  "@context": string[];
  id: `did:${string}`;
  alsoKnownAs: string[];
  verificationMethod: AtprotoVerificationMethod[];
  service: AtprotoService[];
};

type AtprotoVerificationMethod = {
  id: string;
  type: "Multikey";
  controller: `did:${string}`;
  publicKeyMultibase: string;
};

type AtprotoService = {
  id: string;
  type: "AtprotoPersonalDataServer";
  serviceEndpoint: string;
};

export async function resolveDidDocument(did: string): Promise<AtprotoDidDocument> {
  const response = await fetch(getDidDocumentUrl(did));

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

    const path = pathParts.map(decodeURIComponent).join("/");
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
