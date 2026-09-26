import type { Metadata } from 'next';
import { Inter, Prompt } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const prompt = Prompt({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-prompt' 
});

export const metadata: Metadata = {
  title: 'MotoWash - Mobile Motorcycle Wash',
  description: 'Book your mobile motorcycle wash today',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, prompt.variable)}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
