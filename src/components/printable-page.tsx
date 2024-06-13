interface PrintablePageProps {
  children: React.ReactNode;
}
export function PrintablePage(props: PrintablePageProps) {
  const { children } = props;

  const marginTop = 32;

  return (
    <div className="flex h-[297mm] w-[210mm] flex-col border px-[30mm] py-[45mm] print:border-transparent">
      {children}
      <div className="break-before-page"></div>
    </div>
  );
}
