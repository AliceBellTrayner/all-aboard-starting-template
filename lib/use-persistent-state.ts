"use client";

import { useEffect, useState } from "react";

/**
 * State persisted to localStorage so choices survive tab switches and reloads.
 * Starts from `initial` and reads storage after mount to keep server and client
 * markup identical. Stored values are shallow-merged over `initial`, so new
 * fields added later still get their defaults.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue({ ...initial, ...JSON.parse(raw) });
      else setValue(initial);
    } catch {
      // Ignore unreadable storage; defaults are fine.
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- read once per key
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be unavailable; in-memory state still works.
    }
  }, [key, value, loaded]);

  return [value, setValue, loaded] as const;
}
