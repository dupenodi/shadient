import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shadient - Gradient Playground",
  description: "Create beautiful gradients with ease. Design, animate, and export stunning gradients for web and motion design.",
  keywords: ["gradient", "design", "playground", "CSS", "SVG", "animation", "export"],
  authors: [{ name: "Gradient Playground" }],
  creator: "Gradient Playground",
  publisher: "Gradient Playground",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Shadient - Gradient Playground",
    description: "Create beautiful gradients with ease. Design, animate, and export stunning gradients.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadient - Gradient Playground",
    description: "Create beautiful gradients with ease. Design, animate, and export stunning gradients.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
