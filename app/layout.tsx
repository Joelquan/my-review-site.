import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1628",
};

export const metadata: Metadata = {
  title: {
    default: "Speaking Saints – 24/7 Christian Audio Platform",
    template: "%s | Speaking Saints",
  },
  description:
    "Speaking Saints is an AI-powered 24/7 faith-based audio experience featuring scripture, devotionals, prayer, and Christian radio programming.",
  keywords: ["Christian radio", "faith", "devotionals", "scripture", "prayer", "audio", "streaming"],
  authors: [{ name: "Speaking Saints" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Speaking Saints",
    title: "Speaking Saints – 24/7 Christian Audio Platform",
    description:
      "AI-powered 24/7 faith-based audio experience featuring scripture, devotionals, and Christian programming.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Speaking Saints – 24/7 Christian Audio Platform",
    description: "AI-powered 24/7 faith-based audio experience.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy-950 text-white antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0d1f3c",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
            success: { iconTheme: { primary: "#e8a820", secondary: "#0d1f3c" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#0d1f3c" } },
          }}
        />
      </body>
    </html>
  );
}
