import type { Metadata } from "next";
import { Footer, Navbar } from "@/components";
import "./globals.css";

export const metadata: Metadata = {
  title: "U1R",
  description: "U1R Food Products",
  icons: {
    icon: "/u1r-2.jpg",
    apple: "/apple-touch-icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
