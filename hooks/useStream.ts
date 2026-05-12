"use client";

import { useState, useEffect, useCallback } from "react";
import type { StreamMetadata } from "@/types";

const POLL_INTERVAL = 15_000;

export function useStream() {
  const [metadata, setMetadata] = useState<StreamMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = useCallback(async () => {
    try {
      const res = await fetch("/api/stream-metadata", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch stream metadata");
      const data = await res.json() as StreamMetadata;
      setMetadata(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stream unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(fetchMetadata, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchMetadata]);

  return { metadata, loading, error, refresh: fetchMetadata };
}
