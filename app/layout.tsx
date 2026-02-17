import type { Metadata } from 'next';
import { DM_Mono, DM_Serif_Display, Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const dmSerif = DM_Serif_Display({
  variable: '--font-dm-serif',
  subsets: ['latin'],
  weight: ['400'],
  // DM Serif Display only has 400 weight typically available in google fonts for this family,
  // but checking docs/types implies it might be just weight: '400' or array if multiple.
  // Google Fonts usually has 400 for DM Serif Display.
});

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'SouthMindly Docs',
  description: 'Sistema de Geração de Documentos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${outfit.variable} ${dmSerif.variable} ${dmMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
