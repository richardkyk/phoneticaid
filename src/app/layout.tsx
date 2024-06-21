import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import { GetClientDimensions } from "~/components/get-client-dimensions";
import { HydrationChecker } from "~/components/hydration-checker";
import ToolBar from "~/components/tool-bar";
import { Toaster } from "~/components/ui/sonner";

const font = localFont({ src: "../fonts/KaiTi2.ttf", variable: "--font-cn" });

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
    <html
      lang="en"
      className={`${GeistSans.variable} ${font.variable} text-gray-700`}
    >
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
