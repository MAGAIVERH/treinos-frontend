import type { Metadata, Viewport } from 'next';
import { Anton, Geist, Geist_Mono, Inter_Tight } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
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

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://treinos-frontend-gold.vercel.app'),
  title: 'FIT.AI',
  description: 'The app that transforms how you train.',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'FIT.AI, Train smarter',
    description: 'AI powered personalized workout plans built for your body.',
    url: 'https://treinos-frontend-gold.vercel.app',
    siteName: 'FIT.AI',
    locale: 'en_US',
    images: [{ url: '/opengraph-image.svg', width: 1200, height: 630, alt: 'FIT.AI, AI personal trainer' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIT.AI, Train smarter',
    description: 'AI powered personalized workout plans built for your body.',
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
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
