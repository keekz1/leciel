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
  title: "Le Ciel Lounge",
  description: " Sunset View . Good vibes . ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="header">
          <img
            src="https://i.imgur.com/tcA55YZ.jpeg"
            alt="Le Ciel Logo"
            className="header-logo"
          />
          <h1 className="header-title">Le Ciel Lounge</h1>
        </header>

        {children}
      </body>
    </html>
  );
}
