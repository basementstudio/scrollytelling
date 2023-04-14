import "./css/global.scss";
import type { Metadata } from "next";
import localFont from "next/font/local";

import { Providers } from "./providers";

const jetbrainsMono = localFont({
  src: [
    { path: "../../public/fonts/JetBrainsMono-Regular.woff2", weight: "400" },
  ],
});

const basementGrotesque = localFont({
  src: [
    { path: "./fonts/BasementGrotesque-Regular.woff2", weight: "400" },
    // { path: "./fonts/BasementGrotesque-Black.woff2", weight: "700" },
    { path: "./fonts/BasementGrotesque-BlackExpanded.woff2", weight: "800" },
    {
      path: "./fonts/BasementGrotesqueDisplay-UltraBlackExtraExpanded.woff2",
      weight: "900",
    },
  ],
  fallback: ["var(--font-system)"],
  preload: true,
});

export const metadata: Metadata = {
  title: "BSMNT @ React Miami Conf",
  description: "to-do",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{
        ["--font-basement-grotesque" as string]: `${basementGrotesque.style.fontFamily}, var(--font-system), sans-serif`,
        ["--font-jetbrains-mono" as string]: `${jetbrainsMono.style.fontFamily}, var(--font-system), sans-serif`,
      }}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
