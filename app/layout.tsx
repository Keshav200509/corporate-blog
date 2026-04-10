import type { Metadata } from "next";
import "./globals.css";
import { getCanonicalUrl, getSiteName } from "../src/blog/seo";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";


export const metadata: Metadata = {
  metadataBase: new URL(getCanonicalUrl("/")),
  title: getSiteName(),
  description: "SEO-first corporate publishing platform.",
  alternates: {
    canonical: getCanonicalUrl("/")
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <div id="main-content">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
