import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Anton, Geist, Geist_Mono, Inter_Tight } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Chat } from '@/app/_components/chat';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
});

const anton = Anton({
  variable: '--font-anton',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'FIT.AI',
  description: 'O app que vai transformar a forma como você treina.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'FIT.AI — Treine com inteligência',
    description: 'Planos de treino personalizados criados por IA.',
    images: [{ url: '/opengraph-image.svg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIT.AI — Treine com inteligência',
    description: 'Planos de treino personalizados criados por IA.',
    images: ['/opengraph-image.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable} ${anton.variable} antialiased`}
      >
        <NuqsAdapter>
          {children}
          <Suspense>
            <Chat />
          </Suspense>
        </NuqsAdapter>
      </body>
    </html>
  );
}
