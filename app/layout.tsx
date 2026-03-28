import type { Metadata } from "next";
import { getCanonicalUrl, getSiteName } from "../src/blog/seo";

export const metadata: Metadata = {
  title: getSiteName(),
  description: "SEO-first corporate publishing platform.",
  alternates: {
    canonical: getCanonicalUrl("/")
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
