import MuLoader from "@components/Loader";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import type React from "react";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { clientEnv } from "@/lib/env/env.client";
import "./globals.css";
import BackToTop from "@/components/BacktoTop";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "µLearn",
  description: "Break the echo chamber",
  authors: [{ name: "µLearn" }],
  openGraph: {
    title: "µLearn",
    description:
      "µLearn is a synergic philosophy of education, with a culture of mutual learning through micro groups of peers. µLearn is here to assist you in breaking through the echo chambers and free you from the shackles that have you grounded.",
    siteName: "µLearn",
    url: "https://mulearn.org/",
    type: "website",
    images: ["/assets/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://mulearn.org/"),
};

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const circe = localFont({
  src: "../components/fonts/CirceRounded-Bold.otf",
  variable: "--font-display",
  display: "swap",
});

const retro = localFont({
  src: "../components/fonts/Retro_Team.otf",
  variable: "--font-retro",
  display: "swap",
});

const cdnurl = clientEnv.NEXT_PUBLIC_CDN_URL;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${circe.variable} ${retro.variable}`}
    >
      <head>
        {cdnurl && (
          <>
            <link rel="preconnect" href={cdnurl} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={cdnurl} />
          </>
        )}
        {/* Preconnect to S3 for faster remote image loading */}
        <link rel="preconnect" href="https://s3.ap-south-1.amazonaws.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://s3.ap-south-1.amazonaws.com" />
      </head>
      <body className="font-sans antialiased">
        <Navbar />
        <Suspense fallback={<MuLoader />}>{children}</Suspense>
        <Footer />
        <Toaster reverseOrder={true} position="top-center" />
        <SonnerToaster />
        <div className="fixed bottom-4 right-4 z-50">
          <BackToTop />
        </div>
      </body>
    </html>
  );
}
