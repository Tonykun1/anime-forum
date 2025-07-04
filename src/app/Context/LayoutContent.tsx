// src/app/LayoutContent.tsx - עם ניווט מעודכן לפרופיל
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Context/AuthContext';
import { NavBar } from '../Components';

// הגדרת theme classes
const lightTheme = {
  bg: 'bg-gray-50',
  cardBg: 'bg-white',
  text: 'text-gray-900',
  textSecondary: 'text-gray-600',
  border: 'border-gray-200',
  hover: 'hover:bg-gray-100'
};

const darkTheme = {
  bg: 'bg-gray-900',
  cardBg: 'bg-gray-800',
  text: 'text-white',
  textSecondary: 'text-gray-300',
  border: 'border-gray-700',
  hover: 'hover:bg-gray-700'
};

interface LayoutContentProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: LayoutContentProps) {
  const [isDark, setIsDark] = useState(true); // ברירת מחדל - מצב כהה
  const router = useRouter();
  const { user } = useAuth(); // קבלת המשתמש המחובר

  const themeClasses = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleCreatePost = () => {
    router.push('/newpost');
  };

  const handleProfileClick = () => {
    // ניווט לפרופיל של המשתמש המחובר
    if (user?.username) {
      router.push(`/profile/${user.username}`);
    } else {
      // אם אין משתמש מחובר, נווט לדף התחברות או בית
      router.push('/');
    }
  };

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      <NavBar
        isDark={isDark}
        toggleTheme={toggleTheme}
        onCreatePost={handleCreatePost}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        themeClasses={themeClasses}
      />
      <main className="relative">
        {children}
      </main>
    </div>
  );
}

export default LayoutContent;