import { useDocumentStore } from "~/lib/store";

interface PrintablePageProps {
  children: React.ReactNode;
  pageNum: number;
  marginX: number;
  marginY: number;
  layout: "portrait" | "landscape";
}
export function PrintablePage(props: PrintablePageProps) {
  const { children, pageNum, marginX, marginY, layout } = props;

  const zoom = useDocumentStore((state) => state.config.zoom);

  return (
    <div
      id="printable"
      className="relative flex flex-col border"
      style={{
        padding: `${marginY}px ${marginX}px`,
        height: layout === "portrait" ? "297mm" : "210mm",
        width: layout === "portrait" ? "210mm" : "297mm",
        scale: zoom,
      }}
    >
      {pageNum !== 0 && <div className="page-break-before"></div>}
      <div
        className="absolute inset-x-0 h-px w-full border-t border-dashed print:border-transparent"
        style={{ top: `${marginY}px` }}
      ></div>
      <div
        className="absolute inset-x-0 h-px w-full border-b border-dashed print:border-transparent"
        style={{ bottom: `${marginY}px` }}
      ></div>
      <div
        className="absolute inset-y-0 h-full w-px border-l border-dashed print:border-transparent"
        style={{ left: `${marginX}px` }}
      ></div>
      <div
        className="absolute inset-y-0 h-full w-px border-r border-dashed print:border-transparent"
        style={{ right: `${marginX}px` }}
      ></div>
      {children}
    </div>
  );
}
