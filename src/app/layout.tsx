import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./custom.css";
import Sidebar from "@/components/Sidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AURA | Luxury Wedding Planner",
  description: "The ultimate luxury planner workspace for your perfect day",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        <Providers>
          <div className="app-layout">
            {session && <Sidebar />}
            <main className={session ? "main-content" : "full-content"}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
