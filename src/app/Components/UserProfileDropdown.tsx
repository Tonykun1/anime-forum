// src/components/UserProfileDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User as UserIcon, Calendar, Heart, MessageSquare, Plus } from 'lucide-react';
import { useAuth } from './../Context/AuthContext';

interface UserProfileDropdownProps {
  themeClasses: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
  };
  onProfileClick: () => void;
  onCreatePost: () => void;
  onSettingsClick: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ 
  themeClasses, 
  onProfileClick,
  onCreatePost,
  onSettingsClick 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // סגירת התפריט בלחיצה מחוץ לו
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleCreatePost = () => {
    onCreatePost();
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    onSettingsClick();
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    onProfileClick();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* תמונת פרופיל וכפתור */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 p-2 rounded-lg ${themeClasses.hover} transition-colors`}
      >
        <img
          src={user.avatar || `https://via.placeholder.com/32x32/6366F1/FFFFFF?text=${user.username?.charAt(0)?.toUpperCase() || 'U'}`}
          alt={user.username}
          className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
        />
        <span className={`hidden sm:block text-sm font-medium ${themeClasses.text}`}>
          {user.username}
        </span>
      </button>

      {/* תפריט נפתח */}
      {isOpen && (
        <div className={`absolute left-0 mt-2 w-80 ${themeClasses.cardBg} ${themeClasses.border} border rounded-lg shadow-lg z-50`}>
          {/* פרטי המשתמש */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar || `https://via.placeholder.com/48x48/6366F1/FFFFFF?text=${user.username?.charAt(0)?.toUpperCase() || 'U'}`}
                alt={user.username}
                className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
              />
              <div>
                <h3 className={`font-semibold ${themeClasses.text}`}>{user.username}</h3>
                <p className={`text-sm ${themeClasses.textSecondary}`}>{user.email}</p>
              </div>
            </div>
            
            {/* סטטיסטיקות משתמש */}
            <div className="mt-3 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center space-x-1">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className={`text-lg font-bold ${themeClasses.text}`}>{user.postsCount}</span>
                </div>
                <p className={`text-xs ${themeClasses.textSecondary}`}>פוסטים</p>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className={`text-lg font-bold ${themeClasses.text}`}>{user.likesCount}</span>
                </div>
                <p className={`text-xs ${themeClasses.textSecondary}`}>לייקים</p>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className={`text-sm font-bold ${themeClasses.text}`}>
                    {new Date(user.joinDate).getFullYear()}
                  </span>
                </div>
                <p className={`text-xs ${themeClasses.textSecondary}`}>הצטרף</p>
              </div>
            </div>
          </div>

          {/* פעולות */}
          <div className="py-2">
            <button
              onClick={handleCreatePost}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm ${themeClasses.text} ${themeClasses.hover} transition-colors`}
            >
              <Plus className="w-4 h-4" />
              <span>פוסט חדש</span>
            </button>

            <button
              onClick={handleProfileClick}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm ${themeClasses.text} ${themeClasses.hover} transition-colors`}
            >
              <UserIcon className="w-4 h-4" />
              <span>פרופיל שלי</span>
            </button>
            
            <button
              onClick={handleSettingsClick}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm ${themeClasses.text} ${themeClasses.hover} transition-colors`}
            >
              <Settings className="w-4 h-4" />
              <span>הגדרות</span>
            </button>
            
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>התנתק</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;