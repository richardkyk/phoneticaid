"use client";

import { useEffect, useRef } from "react";
import { useDocumentStore } from "~/lib/store";

export function GetClientDimensions() {
  const pageRef = useRef<HTMLDivElement>(null);
  const setDocument = useDocumentStore((state) => state.setDocument);

  useEffect(() => {
    if (!pageRef.current) return;
    void useDocumentStore.persist.rehydrate();
    const dimensions = pageRef.current.getBoundingClientRect();
    const { height, width } = dimensions;
    setDocument({ pageHeight: height, pageWidth: width });
  }, [setDocument]);

  return (
    <div
      ref={pageRef}
      className="absolute h-[297mm] w-[210mm] -translate-x-[100%] print:hidden"
    ></div>
  );
}
