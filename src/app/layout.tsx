import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { GetClientDimensions } from "~/components/get-client-dimensions";
import { HydrationChecker } from "~/components/hydration-checker";
import ToolBar from "~/components/tool-bar";
import { Toaster } from "~/components/ui/sonner";

export const metadata = {
  title: "PhoneticAid",
  description: "A app to generate phonetic aids for Chinese characters",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} text-gray-700`}>
      <body>
        <HydrationChecker>
          <GetClientDimensions />
          <ToolBar />
          <Toaster />
          {children}
        </HydrationChecker>
      </body>
    </html>
  );
}
