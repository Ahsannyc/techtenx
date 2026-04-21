import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechTenX | AI Agents, Automation & Websites",
  description: "Build AI agents, automate workflows, create stunning websites. For individuals and businesses.",
  keywords: ["AI agents", "automation", "website builder", "AI automation", "no-code"],
  authors: [{ name: "TechTenX" }],
  openGraph: {
    title: "TechTenX | AI Agents, Automation & Websites",
    description: "Build AI agents, automate workflows, create stunning websites.",
    url: "https://techtenx.com",
    siteName: "TechTenX",
    images: [
      {
        url: "https://techtenx.com/og-image.png",
        width: 1200,
        height: 630
      }
    ],
    type: "website"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
