"use client";

import { useEffect, useState } from "react";
import { useDocumentStore } from "~/lib/store";

interface HydrationCheckerProps {
  children: React.ReactNode;
}
export function HydrationChecker(props: HydrationCheckerProps) {
  const { children } = props;

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    void useDocumentStore.persist.rehydrate();
    setIsHydrated(true);
    console.log("hydrated");
  }, []);

  if (!isHydrated) return null;

  return children;
}
