import { useDocumentStore } from "~/lib/store";

interface ScaledDocumentProps {
  children: React.ReactNode;
}
export function ScaledDocument(props: ScaledDocumentProps) {
  const { children } = props;

  const zoom = useDocumentStore((state) => state.config.zoom);

  console.log("scaled document");

  return (
    <div
      id="scaled-document"
      className="mx-auto flex w-max flex-col gap-8 after:h-px after:w-[calc(100%+2rem)] after:content-[''] print:gap-0 print:after:h-0"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "0 0",
      }}
    >
      {children}
    </div>
  );
}
