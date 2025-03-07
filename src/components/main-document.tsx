import { CellContent, CellPopover } from "./cell-popover";
import { PageGrid } from "./page-grid";
import { PageSlices } from "./page-slices";
import { PrintablePage } from "./printable-page";
import { ScaledDocument } from "./scaled-document";

export function MainDocument() {
  return (
    <ScaledDocument>
      <PageSlices>
        <PrintablePage>
          <PageGrid>
            <CellPopover>
              <CellContent />
            </CellPopover>
          </PageGrid>
        </PrintablePage>
      </PageSlices>
    </ScaledDocument>
  );
}
