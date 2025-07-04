// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './Context/AuthContext';
import { CreatePostProvider } from './Context/CreatePostContext';
import LayoutContent  from './Context/LayoutContent';

export const metadata: Metadata = {
  title: 'אנימה פורום',
  description: 'פורום דיונים על אנימה',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={inter.className}>
        <AuthProvider>
          <CreatePostProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </CreatePostProvider>
        </AuthProvider>
      </body>
    </html>
  );
}