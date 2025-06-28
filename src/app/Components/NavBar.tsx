// src/components/NavBar.tsx
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
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary} w-4 h-4`} />
                <input
                  type="text"
                  placeholder="חיפוש אנימה..."
                  className={`${themeClasses.cardBg} ${themeClasses.text} ${themeClasses.border} border rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${themeClasses.hover} ${themeClasses.text} transition-colors`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* כפתור פוסט חדש - רק למשתמשים מחוברים */}
             
              
              {/* אזור המשתמש */}
              {isAuthenticated ? (
                <UserProfileDropdown 
                  themeClasses={themeClasses} 
                  onProfileClick={onProfileClick}
                  onCreatePost={onCreatePost}
                  onSettingsClick={onSettingsClick}
                />
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">התחבר</span>
                </button>
              )}
            </div>
          </div>
          
          {/* תפריט נפתח בתוך הבר הראשי */}
          {isMenuOpen && (
            <div className="pb-4 border-t border-gray-300 dark:border-gray-600 mt-4 pt-4">
              {/* כפתור פוסט חדש בתפריט - רק למשתמשים מחוברים */}
              {isAuthenticated && (
                <div className="mb-6 pb-4 border-b border-gray-300 dark:border-gray-600">
                  <button
                    onClick={() => {onCreatePost(); toggleMenu();}}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    <span>צור פוסט חדש</span>
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-500">פוסטים ודיונים</h3>
                  <ul className="space-y-2">
                    <li>
                      <button 
                        onClick={() => {onCreatePost(); toggleMenu();}}
                        className={`block ${themeClasses.hover} px-3 py-2 rounded-md transition-colors w-full text-right ${themeClasses.text} font-medium`}
                      >
                        + צור פוסט חדש
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {setActiveTab('home'); toggleMenu();}}
                        className={`block ${themeClasses.hover} px-3 py-2 rounded-md transition-colors w-full text-right ${themeClasses.text}`}
                      >
                        עמוד ראשי
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {setActiveTab('posts'); toggleMenu();}}
                        className={`block ${themeClasses.hover} px-3 py-2 rounded-md transition-colors w-full text-right ${themeClasses.text}`}
                      >
                        כל הפוסטים
                      </button>
                    </li>
                    <li>
                      <button className={`block ${themeClasses.hover} px-3 py-2 rounded-md transition-colors w-full text-right ${themeClasses.text}`}>
                        דיונים חמים
                      </button>
                    </li>
                    <li>
                      <button className={`block ${themeClasses.hover} px-3 py-2 rounded-md transition-colors w-full text-right ${themeClasses.text}`}>
                        ביקורות
                      </button>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-500">סדרות</h3>
                  <ul className="space-y-2">
                    <li>
                      <button 
                        onClick={() => {setActiveTab('series'); toggleMenu();}}
                        className={`block ${themeClasses.hover} px-3 py-2 rounded-md transition-colors w-full text-right ${themeClasses.text}`}
                      >
                        כל הסדרות
                      </button>
                    </li>
                    <li>
                      <button className={`block ${themeClasses.hover} px-3 py-2 rounded-md transition-colors w-full text-right ${themeClasses.text}`}>
                        סדרות חדשות
                      </button>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-purple-500">סרטים</h3>
                  <ul className="space-y-2">
                    <li>
                      <button 
                        onClick={() => {setActiveTab('movies'); toggleMenu();}}
                        className={`block ${themeClasses.hover} px-3 py-2 rounded-md transition-colors w-full text-right ${themeClasses.text}`}
                      >
                        כל הסרטים
                      </button>
                    </li>
                    <li>
                      <button className={`block ${themeClasses.hover} px-3 py-2 rounded-md transition-colors w-full text-right ${themeClasses.text}`}>
                        סרטים חדשים
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* מודל התחברות */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        themeClasses={themeClasses}
      />
    </>
  );
};

export default NavBar;