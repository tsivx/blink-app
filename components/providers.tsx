'use client';

import { fetcher } from '@/utils/blink';
import { SWRConfig } from 'swr';
import { ThemeProvider } from './theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{
      fetcher,
      revalidateOnFocus: false,
    }}>
      <ThemeProvider enableSystem attribute="class" defaultTheme="dark">
        {children}
      </ThemeProvider>
    </SWRConfig>
  );
}
