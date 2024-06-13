interface PrintablePageProps {
  children: React.ReactNode;
}
export function PrintablePage(props: PrintablePageProps) {
  const { children } = props;

  return (
    <div className="relative flex h-[297mm] w-[210mm] flex-col border px-[30mm] py-[45mm] print:h-[297mm] print:w-[210mm] print:border-transparent">
      <div className="absolute inset-x-0 top-[45mm] h-px w-full border-t border-dashed"></div>
      <div className="absolute inset-x-0 bottom-[45mm] h-px w-full border-b border-dashed"></div>
      <div className="absolute inset-y-0 left-[30mm] h-full w-px border-l border-dashed"></div>
      <div className="absolute inset-y-0 right-[30mm] h-full w-px border-r border-dashed"></div>
      {children}
      <div className="break-before-page"></div>
    </div>
  );
}
