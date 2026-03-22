'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster position="bottom-right" />
      {children}
    </Provider>
  );
}
