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
  title: 'Le Ciel Lounge', // this sets the browser title
  description: ' Sunset View . Good Vibes', // optional description
  openGraph: {
    title: 'Le Ciel Lounge',
      siteName: 'Le Ciel Lounge',
    images: [
      {
        url: 'https://i.imgur.com/tcA55YZ.png', // your custom image
        width: 800,
        height: 600,
        alt: 'Le Ciel Lounge',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Ciel Lounge',
    description: 'Welcome to Le Ciel Lounge',
    images: ['https://imgur.com/tcA55YZ'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
