import React, { createContext, useContext, useRef, useState } from 'react';
import type { ViewToken } from 'react-native';

const VisibleItemsContext = createContext<Set<string>>(new Set());

// A card only has to come into view once; keeping it in the set afterwards
// means scrolling back does not throw away what was already fetched.
const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 10,
  minimumViewTime: 100,
};

/**
 * Tracks which items of a list have been scrolled into view.
 *
 * Spread the returned `listProps` onto the FlatList and put `seen` in a
 * {@link VisibleItemsProvider} around it; items then call
 * {@link useHasBeenVisible} to load what only a visible item needs.
 *
 * FlatList refuses to have `onViewableItemsChanged` or `viewabilityConfig`
 * change identity between renders, hence the refs.
 */
export function useVisibleItems() {
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const seenRef = useRef(seen);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const added = viewableItems
        .map(token => token.key)
        .filter(key => !seenRef.current.has(key));

      if (added.length === 0) {
        return;
      }

      const next = new Set(seenRef.current);
      added.forEach(key => next.add(key));
      seenRef.current = next;
      setSeen(next);
    },
  ).current;

  return {
    seen,
    listProps: {
      onViewableItemsChanged,
      viewabilityConfig: VIEWABILITY_CONFIG,
    },
  };
}

export function VisibleItemsProvider({
  seen,
  children,
}: {
  seen: Set<string>;
  children: React.ReactNode;
}) {
  return (
    <VisibleItemsContext.Provider value={seen}>
      {children}
    </VisibleItemsContext.Provider>
  );
}

/**
 * Whether the item with this key has been on screen. Outside a list that
 * tracks visibility it stays false, so callers must cope with never loading.
 */
export function useHasBeenVisible(key: string): boolean {
  return useContext(VisibleItemsContext).has(key);
}
