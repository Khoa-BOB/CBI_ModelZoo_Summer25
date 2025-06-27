import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import SideBar from "@/components/SideBar/SideBar";

const geistSans = GeistSans;

const geistMono = GeistMono;

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
