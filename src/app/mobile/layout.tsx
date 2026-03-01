import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "RoNa Finance",
  description: "Personal finance simplified.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RoNa Finance",
  },
  formatDetection: {
    telephone: false,
  },
};

import BottomNav from "@/components/BottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Usamos un main para dar espacio en el margen inferior, así el BottomNav nunca tapa el contenido del usuario. */}
      <main style={{ paddingBottom: "5rem", minHeight: "100vh" }}>
        {children}
      </main>

      {/* Inyectamos nuestro menú de navegación inferior en toda la app */}
      <BottomNav />
    </>
  );
}
