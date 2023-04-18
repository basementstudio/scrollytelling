import "./css/global.scss";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import { siteOrigin } from "~/lib/constants";

const jetBrainsMono = JetBrains_Mono({
  weight: "400",
  subsets: ["latin"],
});

const basementGrotesque = localFont({
  src: [
    { path: "./fonts/BasementGrotesque-Regular.woff2", weight: "400" },
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
  description: "BSMNT @ React Miami Conf",
  viewport: {
    height: "device-height",
    initialScale: 1,
    width: "device-width",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  twitter: {
    card: "summary_large_image",
    creator: "@basementstudio",
    description: "BSMNT @ React Miami Conf",
    images: [{ width: 1200, height: 630, url: `${siteOrigin}/og.jpeg` }],
    site: "@basementstudio",
    title: "BSMNT @ React Miami Conf",
  },
  openGraph: {
    description: "BSMNT @ React Miami Conf",
    images: [{ width: 1200, height: 630, url: `${siteOrigin}/og.jpeg` }],
    locale: "en-US",
    siteName: "BSMNT @ React Miami Conf",
    title: "BSMNT @ React Miami Conf",
    type: "website",
    url: siteOrigin,
  },
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
        ["--font-jetbrains-mono" as string]: `${jetBrainsMono.style.fontFamily}, var(--font-system), sans-serif`,
      }}
    >
      <body>{children}</body>
    </html>
  );
}
