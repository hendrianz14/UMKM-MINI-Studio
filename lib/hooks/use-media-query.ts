"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const updateMatch = () => setMatches(mediaQuery.matches);

    updateMatch();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMatch);
      return () => mediaQuery.removeEventListener("change", updateMatch);
    }

    mediaQuery.addListener(updateMatch);
    return () => mediaQuery.removeListener(updateMatch);
  }, [query]);

  return matches;
}
