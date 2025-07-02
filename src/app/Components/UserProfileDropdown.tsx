// src/app/Components/UserProfileDropdown.tsx - עם פונקציית פוסט חדש
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, ChevronDown, Plus } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

interface UserProfileDropdownProps {
  themeClasses: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
  };
  onCreatePost?: () => void; // פרופ אופציונלי לפתיחת מודאל פוסט
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ 
  themeClasses, 
  onCreatePost 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleProfileClick = () => {
    router.push(`/${user.username}`);
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    router.push('/settings');
    setIsOpen(false);
  };

  const handleCreatePostClick = () => {
    if (onCreatePost) {
      onCreatePost(); // קורא לפונקציה שפותחת את המודאל
    } else {
      // אם אין פונקציה, נווט לעמוד הבית עם פרמטר
      router.push('/?create=true');
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-3 ${themeClasses.hover} px-3 py-2 rounded-md transition-colors`}
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            user.username.substring(0, 2).toUpperCase()
          )}
        </div>
        <span className={`font-medium ${themeClasses.text} hidden md:block`}>
          {user.username}
        </span>
        <ChevronDown className={`w-4 h-4 ${themeClasses.text} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute right-0 mt-2 w-48 ${themeClasses.cardBg} ${themeClasses.border} border rounded-md shadow-lg z-20`}>
            <div className="py-1">
              <button
                onClick={handleCreatePostClick}
                className={`w-full text-right px-4 py-2 text-sm ${themeClasses.text} ${themeClasses.hover} flex items-center space-x-2`}
              >
                <Plus className="w-4 h-4" />
                <span>צור פוסט חדש</span>
              </button>
              <hr className={`my-1 ${themeClasses.border}`} />
              <button
                onClick={handleProfileClick}
                className={`w-full text-right px-4 py-2 text-sm ${themeClasses.text} ${themeClasses.hover} flex items-center space-x-2`}
              >
                <User className="w-4 h-4" />
                <span>הפרופיל שלי</span>
              </button>
              <button
                onClick={handleSettingsClick}
                className={`w-full text-right px-4 py-2 text-sm ${themeClasses.text} ${themeClasses.hover} flex items-center space-x-2`}
              >
                <Settings className="w-4 h-4" />
                <span>הגדרות</span>
              </button>
              <hr className={`my-1 ${themeClasses.border}`} />
              <button
                onClick={handleLogout}
                className={`w-full text-right px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white flex items-center space-x-2`}
              >
                <LogOut className="w-4 h-4" />
                <span>התנתק</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileDropdown;