'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import ThemeRegistry from './ThemeRegistry';

export default function Providers({ children }) {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </ThemeRegistry>
  );
}

