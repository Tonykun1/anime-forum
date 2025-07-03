// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './Context/AuthContext';
import { CreatePostProvider } from './Context/CreatePostContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'אנימה פורום',
  description: 'פורום דיונים על אנימה',
};

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
            {children}
          </CreatePostProvider>
        </AuthProvider>
      </body>
    </html>
  );
}