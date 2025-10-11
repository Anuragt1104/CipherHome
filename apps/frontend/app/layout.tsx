import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CipherHome - Sovereign Personal Cloud',
  description: 'Your Black Box, Your Digital Kingdom. Built for DAWN.',
  keywords: ['DAWN', 'Black Box', 'DePIN', 'Privacy', 'AI', 'Blockchain', 'Solana'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
