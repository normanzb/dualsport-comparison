"use client";

import { useSyncExternalStore } from "react";

type Store = { matches: boolean; subscribers: Set<() => void> };

/** One watcher per query, however many components ask for it. */
const stores = new Map<string, Store>();

function storeFor(query: string): Store {
  const existing = stores.get(query);
  if (existing) return existing;

  const list = window.matchMedia(query);
  const store: Store = { matches: list.matches, subscribers: new Set() };
  list.addEventListener("change", () => {
    store.matches = list.matches;
    for (const notify of store.subscribers) notify();
  });

  stores.set(query, store);
  return store;
}

/**
 * The server has no viewport, so it always answers false. Anything that would
 * look wrong on a phone for a frame belongs behind a Tailwind class, not here.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const store = storeFor(query);
      store.subscribers.add(onChange);
      return () => {
        store.subscribers.delete(onChange);
      };
    },
    () => storeFor(query).matches,
    () => false,
  );
}
