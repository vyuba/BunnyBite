import type { Metadata } from "next";
import LocalFont from "next/font/local";
import "./globals.css";
import { CounterStoreProvider } from "./providers/counter-store-provider";
import { Toaster } from "sonner";
const neueMontreal = LocalFont({
  src: [
    {
      path: "../../public/font/NeueMontreal-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/font/NeueMontreal-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/NeueMontreal-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/NeueMontreal-Bold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-neue",
  style: "normal",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bunny-bite.vercel.app"),
  title: "BunnyBite",
  description:
    "AI chatbot that connects to your Shopify and e-commerce store. Automate refunds, order tracking, and customer support connect your store and let us handle the rest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
      <meta
        name="theme-color"
        content="#f1f1f1"
        media="(prefers-color-scheme: light)"
      />
      <meta
        name="theme-color"
        content="#151515"
        media="(prefers-color-scheme: dark)"
      />
      <body
        className={`${neueMontreal.variable} ${neueMontreal.variable} antialiased`}
      >
        <Toaster richColors />
        <HomeLayout>{children}</HomeLayout>
      </body>
    </html>
  );
}

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  "use client";
  return <CounterStoreProvider>{children}</CounterStoreProvider>;
};
