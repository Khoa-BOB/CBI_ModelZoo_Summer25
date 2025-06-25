import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ResroucesGrid } from "@/components/ResroucesGrid";
import SideBar from "@/components/SideBar/SideBar";
import SearchBar from "@/components/SearchBar/SearchBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Model Zoo",
  description: "Intern Summer 25 - Model Zoo",
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

        <noscript>You need to enable JavaScript to run this app</noscript>
        <div className="flex min-h-screen">
          <SideBar />
          <div className="
                flex-1
                bg-white
                p-4 
                transition-all duration-300 ease-out
          ">
            <header>
              
            </header>    
            <main>
              {children}
            </main>
          </div>  
        </div>
      </body>
    </html>
  );
}
