import '@/styles/globals.css';
import { Inter as FontSans } from 'next/font/google';

import Footer from '@/components/footer';
import { Navbar } from '@/components/navbar';
import Providers from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/utils/ui';
import type { Metadata } from 'next';
import Script from 'next/script';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Blink',
  description: 'Blink - это самое крутое приложение!!!11',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased px-4', fontSans.variable)}>
        <Providers>
          <div className="flex flex-col min-h-screen py-2">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </div>

          <div id="yandex_rtb_R-A-8083294-1"></div>

          <Script
            id="important-script"
            src="https://yandex.ru/ads/system/context.js"
            async
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.yaContextCb=window.yaContextCb||[];window.yaContextCb.push((()=>{Ya.Context.AdvManager.render({blockId:"R-A-8083294-1",renderTo:"yandex_rtb_R-A-8083294-1"})}));`,
            }}
          ></Script>
        </Providers>
      </body>
    </html>
  );
}
