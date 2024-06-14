"use client";

import { useEffect, useRef } from "react";
import { useDocumentStore } from "~/lib/store";

export function GetClientDimensions() {
  const pageRef = useRef<HTMLDivElement>(null);
  const setDocument = useDocumentStore((state) => state.setDocument);

  useEffect(() => {
    if (!pageRef.current) return;
    const dimensions = pageRef.current.getBoundingClientRect();
    const { height } = dimensions;
    setDocument({ pageHeight: height });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageRef.current]);

  return (
    <div
      ref={pageRef}
      className="absolute h-[297mm] w-[210mm] translate-x-[100%] print:hidden"
    ></div>
  );
}
