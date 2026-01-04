import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from '@/providers/ThemeProvider/Theme.provider';
import ReactQueryProvider from '@/providers/ReactQueryProvider/ReactQuery.provider';

import { Toaster } from '@/components/ui/sonner';

import { router } from '@/routes/routes.config.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster richColors closeButton position="top-right" />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </ThemeProvider>
    </ReactQueryProvider>
  </StrictMode>,
);
