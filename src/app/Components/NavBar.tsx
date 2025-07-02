// src/app/Components/NavBar.tsx - מתוקן עם העברת פונקציית פוסט חדש
import React, { useState } from 'react';
import { Search, Moon, Sun, Home, Film, Play, Bookmark, MessageCircle, Menu, ChevronDown, Plus, LogIn } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import UserProfileDropdown from './UserProfileDropdown';
import LoginModal from './LoginModal';

interface NavBarProps {
  isDark: boolean;
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  onCreatePost: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  themeClasses: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
  };
}

const NavBar: React.FC<NavBarProps> = ({ 
  isDark, 
  toggleTheme, 
  activeTab, 
  setActiveTab, 
  isMenuOpen, 
  toggleMenu,
  onCreatePost,
  onProfileClick,
  onSettingsClick,
  themeClasses 
}) => {
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  return (
    <>
      <nav className={`${themeClasses.cardBg} ${themeClasses.border} border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
                <Film className="mr-2 text-blue-500" />
                אנימה פורום
              </h1>
              <button
                onClick={toggleMenu}
                className={`flex items-center space-x-2 ${themeClasses.hover} px-3 py-2 rounded-md transition-colors`}
              >
                <Menu className={`w-5 h-5 ${themeClasses.text}`} />
                <span className={`font-medium ${themeClasses.text}`}>תפריט</span>
                <ChevronDown className={`w-4 h-4 ${themeClasses.text} transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className="hidden md:flex space-x-6">
                {[
                  { id: 'home', icon: Home, label: 'בית' },
                  { id: 'posts', icon: MessageCircle, label: 'פוסטים' },
                  { id: 'series', icon: Film, label: 'סדרות' },
                  { id: 'movies', icon: Play, label: 'סרטים' },
                  { id: 'watchlist', icon: Bookmark, label: 'רשימת צפייה' }
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      activeTab === id 
                        ? 'bg-blue-500 text-white' 
                        : `${themeClasses.text} ${themeClasses.hover}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* חיפוש */}
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="חיפוש..."
                  className={`w-64 pl-10 pr-4 py-2 ${themeClasses.cardBg} ${themeClasses.border} border rounded-lg ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeClasses.textSecondary}`} />
              </div>

              {/* כפתור ערכת נושא */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md ${themeClasses.hover} transition-colors`}
              >
                {isDark ? (
                  <Sun className={`w-5 h-5 ${themeClasses.text}`} />
                ) : (
                  <Moon className={`w-5 h-5 ${themeClasses.text}`} />
                )}
              </button>



              {/* פרופיל משתמש או כפתור התחברות */}
              {isAuthenticated ? (
                <UserProfileDropdown 
                  themeClasses={themeClasses} 
                  onCreatePost={onCreatePost}
                />
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>התחבר</span>
                </button>
              )}
            </div>
          </div>

          {/* תפריט נייד */}
          {isMenuOpen && (
            <div className={`md:hidden mt-4 pb-4 ${themeClasses.border} border-t`}>
              <div className="flex flex-col space-y-2 mt-4">
                {[
                  { id: 'home', icon: Home, label: 'בית' },
                  { id: 'posts', icon: MessageCircle, label: 'פוסטים' },
                  { id: 'series', icon: Film, label: 'סדרות' },
                  { id: 'movies', icon: Play, label: 'סרטים' },
                  { id: 'watchlist', icon: Bookmark, label: 'רשימת צפייה' }
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id);
                      toggleMenu();
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-right ${
                      activeTab === id 
                        ? 'bg-blue-500 text-white' 
                        : `${themeClasses.text} ${themeClasses.hover}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* מודאל התחברות */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        themeClasses={themeClasses}
      />
    </>
  );
};

export default NavBar;