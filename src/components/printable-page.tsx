import { useDocumentStore } from "~/lib/store";

interface PrintablePageProps {
  children: React.ReactNode;
  pageNum: number;
}
export function PrintablePage(props: PrintablePageProps) {
  const { children, pageNum } = props;

  const marginX = useDocumentStore((state) => state.config.marginX);
  const marginY = useDocumentStore((state) => state.config.marginY);

  return (
    <div
      className="relative flex h-[297mm] w-[210mm] flex-col border"
      style={{
        padding: `${marginY}px ${marginX}px`,
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
