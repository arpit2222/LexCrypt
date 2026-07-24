import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nyaya Setu",
  description: "Multilingual Legal AI for India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Pixel Code - https://analytics.techisfuture.com/ */}
        <script defer src="https://analytics.techisfuture.com/pixel/806wtVUQzgSk8fVP"></script>
        {/* END Pixel Code */}
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
