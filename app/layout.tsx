import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/markdown.css";
import AppContextProvider from "@/components/AppContext";
import EventBusContextProvider from "@/components/EventBusContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SimuGPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContextProvider>
          <EventBusContextProvider>{children}</EventBusContextProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
