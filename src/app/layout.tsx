// src/app/layout.tsx
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Providers from '@/components/Providers';
import SideBar from '@/components/SideBar/SideBar';
import './globals.css';

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'Model Zoo',
  description: 'Intern Summer 25 - Model Zoo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <noscript>You need to enable JavaScript to run this app</noscript>
        <Providers>
          <div className="flex min-h-screen">
            <SideBar />
            <div className="flex-1 p-4 transition-all duration-300 ease-out">
              <header />
              <main>{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
