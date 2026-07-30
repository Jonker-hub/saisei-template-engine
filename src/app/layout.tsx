import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import WebflowInit from "@/components/WebflowInit";
import Loader from "@/components/Loader";

export const metadata: Metadata = {
  title: "Saisei – Innovative Architecture & Sustainable Design Studio",
  description: "Saisei is a cutting-edge architecture and design studio specializing in sustainable and modern architectural solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="/assets/css/saisei-sbj.shared.a0229ce79.min-3b74e292.css" rel="stylesheet" type="text/css" />
        <link href="/assets/css/inline.css" rel="stylesheet" type="text/css" />
        <link href="/assets/images/66de2f866644c088fa8747d1_Saisei%20-Favicon-d3bcd98e.png" rel="shortcut icon" type="image/x-icon" />
        <link href="/assets/images/66de2f8ab5d9589a9b1de8a3_Saisei%20-%20Webclip-6c809f92.png" rel="apple-touch-icon" />
        <Script id="webflow-touch-js" strategy="beforeInteractive">
          {`!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`}
        </Script>
      </head>
      <body data-theme="dark" data-page="home">
        <Loader />
        <div className="page_wrap">
          <Navbar />
          <Menu />
          {children}
          <Footer />
        </div>
        
        {/* Webflow/GSAP Initialization */}
        <WebflowInit />
      </body>
    </html>
  );
}
