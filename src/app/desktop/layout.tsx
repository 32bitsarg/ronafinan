import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import DesktopSidebar from "@/components/DesktopSidebar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "RoNa Finance Desktop",
    description: "Personal finance simplified.",
};

export default function DesktopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', display: 'flex' }}>
            <DesktopSidebar />
            <main style={{ marginLeft: '240px', width: 'calc(100% - 240px)', minHeight: '100vh', padding: '2rem 3rem' }}>
                {children}
            </main>
        </div>
    );
}
