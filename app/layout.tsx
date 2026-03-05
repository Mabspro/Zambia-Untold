import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZAMBIA UNTOLD | Interactive Historical Atlas",
  description: "The history you were never taught.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
