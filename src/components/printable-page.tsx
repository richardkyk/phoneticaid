import { useEffect, useRef } from "react";
import { useDocumentStore } from "~/lib/store";

interface PrintablePageProps {
  children: React.ReactNode;
}
export function PrintablePage(props: PrintablePageProps) {
  const { children } = props;

  const pageRef = useRef<HTMLDivElement>(null);
  const marginX = useDocumentStore((state) => state.config.marginX);
  const marginY = useDocumentStore((state) => state.config.marginY);

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
      className="relative flex h-[297mm] w-[210mm] flex-col border print:border-transparent"
      style={{
        padding: `${marginY}px ${marginX}px`,
      }}
    >
      <div
        className="absolute inset-x-0 h-px w-full border-t border-dashed"
        style={{ top: `${marginY}px` }}
      ></div>
      <div
        className="absolute inset-x-0 h-px w-full border-b border-dashed"
        style={{ bottom: `${marginY}px` }}
      ></div>
      <div
        className="absolute inset-y-0 h-full w-px border-l border-dashed"
        style={{ left: `${marginX}px` }}
      ></div>
      <div
        className="absolute inset-y-0 h-full w-px border-r border-dashed"
        style={{ right: `${marginX}px` }}
      ></div>
      {children}
      <div className="break-before-page"></div>
    </div>
  );
}
