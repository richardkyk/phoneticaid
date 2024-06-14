import { GetClientDimensions } from "~/components/get-client-dimensions";
import { MainGrid } from "~/components/main-grid";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center py-8 print:py-0">
      <GetClientDimensions />
      <MainGrid />
    </main>
  );
}
