import { CellPopover } from "./cell-popover";
import { PageGrid } from "./page-grid";
import { PageSlices } from "./page-slices";
import { PrintablePage } from "./printable-page";
import { ScaledDocument } from "./scaled-document";

export function MainDocument() {
  console.log("main document");

  return (
    <ScaledDocument>
      <PageSlices>
        <PrintablePage>
          <PageGrid>
            <CellPopover />
          </PageGrid>
        </PrintablePage>
      </PageSlices>
    </ScaledDocument>
  );
}
