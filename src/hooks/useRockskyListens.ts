"use client";

import { useEffect, useState } from "react";
import { getRecentRocksky } from "@/lib/providers/rocksky";
import type { RockskyScrobbleRecord } from "@/lib/providers/rocksky";

const REFRESH_INTERVAL = 20_000;

type UseRockskyListensOptions = {
  pds: string | null;
  limit?: number;
};

export function useRockskyListens({ pds, limit }: UseRockskyListensOptions) {
  const [scrobbles, setScrobbles] = useState<RockskyScrobbleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function refreshScrobbles() {
      const recentScrobbles = await getRecentRocksky(pds, limit ?? 4);

      if (!isMounted) return;

      setScrobbles(recentScrobbles);
      setIsLoading(false);
    }

    refreshScrobbles();

    const refreshTimer = window.setInterval(refreshScrobbles, REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(refreshTimer);
    };
  }, [limit, pds]);

  return { scrobbles, isLoading };
}
