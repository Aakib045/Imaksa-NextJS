import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata = {
  title: 'IMAKSA Properties — Dubai Real Estate | Buy, Rent & Sell',
  description: 'IMAKSA — Dubai\'s trusted real estate partner. Buy, rent, sell, and discover off-plan properties across Palm Jumeirah, Downtown Dubai, Dubai Marina and more.',
  keywords: 'Dubai real estate, buy property Dubai, rent property Dubai, off-plan Dubai, luxury villas Dubai, IMAKSA properties',
  authors: [{ name: 'IMAKSA Properties' }],
  creator: 'IMAKSA Real Estate LLC',
  publisher: 'IMAKSA Real Estate LLC',
  metadataBase: new URL('https://imaksa.ae'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://imaksa.ae',
    siteName: 'IMAKSA Properties',
    title: 'IMAKSA Properties — Dubai Real Estate | Buy, Rent & Sell',
    description: 'Dubai\'s trusted real estate partner. Buy, rent, sell, and discover off-plan properties across Palm Jumeirah, Downtown Dubai, Dubai Marina and more.',
    images: [{
      url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
      width: 1200,
      height: 630,
      alt: 'IMAKSA Properties Dubai',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IMAKSA Properties — Dubai Real Estate',
    description: 'Dubai\'s trusted real estate partner. Buy, rent, sell, and discover off-plan properties.',
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '_pwV9S2EFZCMzH6EL0Q8-8WenmWy4gNmMevvibZXh1c',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'IMAKSA Real Estate LLC',
    description: "Dubai's trusted real estate partner specializing in luxury properties, off-plan investments and property management.",
    url: 'https://imaksa.ae',
    telephone: '+97142669295',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Suite 701, Churchill Executive Towers, Business Bay',
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.257169,
      longitude: 55.323983,
    },
    openingHours: 'Mo-Sa 09:00-19:00',
    priceRange: 'AED 500,000 - AED 50,000,000',
    areaServed: 'Dubai, UAE',
    sameAs: [
      'https://www.linkedin.com/company/imaksa',
      'https://www.instagram.com/imaksa',
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <Cursor />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <SpeedInsights />
      </body>
      <GoogleAnalytics gaId="G-PET39JQQJV" />
    </html>
  );
}
