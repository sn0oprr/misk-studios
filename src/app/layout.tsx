import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import ClientWrapper from '@/components/ClientWrapper';
import "./globals.css";

// SF UI Display isn't available on Google Fonts, so we'll use Inter as a close alternative
// or we can load it as a local font. For now, using Inter which is very similar.
const sfUIDisplay = Inter({
  variable: "--font-sf-ui-display",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Misk Studios - Location de Studios à Tunis",
  description: "Louez des studios professionnels pour podcast, enregistrement, streaming et production à Tunis. Équipement de pointe et espaces acoustiquement traités.",
  keywords: "studio, podcast, enregistrement, streaming, production, Tunis, Tunisie, location studio",
  openGraph: {
    title: "Misk Studios - Location de Studios à Tunis",
    description: "Louez des studios professionnels pour podcast, enregistrement, streaming et production à Tunis.",
    url: "https://misk-studios.com",
    siteName: "Misk Studios",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Misk Studios - Studios professionnels à Tunis",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Misk Studios - Location de Studios à Tunis",
    description: "Louez des studios professionnels pour podcast, enregistrement, streaming et production à Tunis.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${sfUIDisplay.variable} ${montserrat.variable} antialiased font-sf`}
      >
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
