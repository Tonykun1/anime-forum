// src/components/UserSettingsPage.tsx
import React, { useState } from 'react';
import { 
  ArrowRight, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Eye, 
  EyeOff, 
  Save, 
  X,
  Mail,
  Lock,
  Image,
  Monitor,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Smartphone,
  Check
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import ImageUpload from './ImageUpload';

interface UserSettingsPageProps {
  themeClasses: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
  };
  onBack: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const UserSettingsPage: React.FC<UserSettingsPageProps> = ({ 
  themeClasses, 
  onBack,
  isDark,
  toggleTheme 
}) => {
  const { user, updateUserProfile } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  // טפסי הגדרות
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    coverImage: user?.coverImage || ''
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    postReplies: true,
    postLikes: true,
    newFollowers: true,
    weeklyDigest: false,
    soundEnabled: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showOnlineStatus: true,
    allowDirectMessages: true,
    showActivity: true
  });

  const [displaySettings, setDisplaySettings] = useState({
    theme: isDark ? 'dark' : 'light',
    fontSize: 'medium',
    language: 'he',
    postsPerPage: 10,
    autoplayVideos: true
  });

  const handleSaveProfile = () => {
    if (updateUserProfile) {
      updateUserProfile(profileForm);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleSaveSecurity = () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('הסיסמאות החדשות לא תואמות');
      return;
    }
    // כאן תהיה לוגיקה לשמירת הגדרות אבטחה
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactorEnabled: securityForm.twoFactorEnabled });
  };

  const handleThemeChange = (newTheme: string) => {
    if (newTheme === 'dark' && !isDark) {
      toggleTheme();
    } else if (newTheme === 'light' && isDark) {
      toggleTheme();
    }
    setDisplaySettings(prev => ({ ...prev, theme: newTheme }));
  };

  const sections = [
    { id: 'profile', label: 'פרופיל אישי', icon: User },
    { id: 'security', label: 'אבטחה וסיסמה', icon: Shield },
    { id: 'notifications', label: 'התראות', icon: Bell },
    { id: 'privacy', label: 'פרטיות', icon: Eye },
    { id: 'display', label: 'תצוגה ונושא', icon: Palette }
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>הגדרות פרופיל</h3>
      
      {/* תמונת פרופיל */}
      <ImageUpload
        value={profileForm.avatar}
        onChange={(url) => setProfileForm(prev => ({ ...prev, avatar: url }))}
        label="תמונת פרופיל"
        placeholder="העלה תמונת פרופיל או הכנס קישור"
        previewClassName="w-20 h-20 rounded-full"
        themeClasses={themeClasses}
      />

      {/* שם משתמש */}
      <div>
        <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
          שם משתמש
        </label>
        <input
          type="text"
          value={profileForm.username}
          onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
          className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="שם משתמש"
        />
      </div>

      {/* אימייל */}
      <div>
        <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
          כתובת אימייל
        </label>
        <input
          type="email"
          value={profileForm.email}
          onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
          className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="אימייל"
        />
      </div>

      {/* ביוגרפיה */}
      <div>
        <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
          אודות (ביוגרפיה)
        </label>
        <textarea
          value={profileForm.bio}
          onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
          className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
          placeholder="ספר על עצמך..."
          rows={4}
          maxLength={200}
        />
        <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>
          {profileForm.bio.length}/200 תווים
        </p>
      </div>

      {/* תמונת רקע */}
      <ImageUpload
        value={profileForm.coverImage}
        onChange={(url) => setProfileForm(prev => ({ ...prev, coverImage: url }))}
        label="תמונת רקע"
        placeholder="העלה תמונת רקע או הכנס קישור"
        previewClassName="w-full h-20"
        themeClasses={themeClasses}
      />

      <button
        onClick={handleSaveProfile}
        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        <Save className="w-4 h-4" />
        <span>שמור שינויים</span>
      </button>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>אבטחה וסיסמה</h3>
      
      {/* שינוי סיסמה */}
      <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-4`}>
        <h4 className={`font-semibold ${themeClasses.text} mb-4`}>שינוי סיסמה</h4>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              סיסמה נוכחית
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={securityForm.currentPassword}
                onChange={(e) => setSecurityForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                placeholder="הכנס סיסמה נוכחית"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary}`}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              סיסמה חדשה
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={securityForm.newPassword}
                onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                placeholder="הכנס סיסמה חדשה"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary}`}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              אישור סיסמה חדשה
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={securityForm.confirmPassword}
                onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                placeholder="הכנס סיסמה חדשה שוב"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary}`}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* אימות דו-שלבי */}
      <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-semibold ${themeClasses.text}`}>אימות דו-שלבי</h4>
            <p className={`text-sm ${themeClasses.textSecondary} mt-1`}>
              הגן על החשבון שלך עם שכבת אבטחה נוספת
            </p>
          </div>
          <button
            onClick={() => setSecurityForm(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              securityForm.twoFactorEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                securityForm.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={handleSaveSecurity}
        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        <Save className="w-4 h-4" />
        <span>שמור הגדרות אבטחה</span>
      </button>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>הגדרות התראות</h3>
      
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'התראות במייל', desc: 'קבל התראות בכתובת האימייל שלך' },
          { key: 'pushNotifications', label: 'התראות דחיפה', desc: 'התראות בדפדפן ובטלפון' },
          { key: 'postReplies', label: 'תגובות לפוסטים', desc: 'התראה כשמישהו מגיב לפוסט שלך' },
          { key: 'postLikes', label: 'לייקים לפוסטים', desc: 'התראה כשמישהו נותן לייק לפוסט שלך' },
          { key: 'newFollowers', label: 'עוקבים חדשים', desc: 'התראה כשמישהו מתחיל לעקוב אחריך' },
          { key: 'weeklyDigest', label: 'סיכום שבועי', desc: 'סיכום פעילות שבועי במייל' },
          { key: 'soundEnabled', label: 'צלילי התראה', desc: 'השמע צלילים עבור התראות' }
        ].map(({ key, label, desc }) => (
          <div key={key} className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-semibold ${themeClasses.text}`}>{label}</h4>
                <p className={`text-sm ${themeClasses.textSecondary} mt-1`}>{desc}</p>
              </div>
              <button
                onClick={() => setNotificationSettings(prev => ({ 
                  ...prev, 
                  [key]: !prev[key as keyof typeof prev] 
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings[key as keyof typeof notificationSettings] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings[key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>הגדרות פרטיות</h3>
      
      {/* נראות פרופיל */}
      <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-4`}>
        <h4 className={`font-semibold ${themeClasses.text} mb-3`}>נראות פרופיל</h4>
        <div className="space-y-3">
          {[
            { value: 'public', label: 'ציבורי', desc: 'כולם יכולים לראות את הפרופיל שלך' },
            { value: 'private', label: 'פרטי', desc: 'רק עוקבים יכולים לראות את הפרופיל שלך' },
            { value: 'friends', label: 'חברים בלבד', desc: 'רק חברים יכולים לראות את הפרופיל שלך' }
          ].map(({ value, label, desc }) => (
            <label key={value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="profileVisibility"
                value={value}
                checked={privacySettings.profileVisibility === value}
                onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                className="form-radio text-blue-500"
              />
              <div>
                <span className={`font-medium ${themeClasses.text}`}>{label}</span>
                <p className={`text-sm ${themeClasses.textSecondary}`}>{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* הגדרות פרטיות נוספות */}
      <div className="space-y-4">
        {[
          { key: 'showEmail', label: 'הצג אימייל בפרופיל', desc: 'משתמשים אחרים יוכלו לראות את האימייל שלך' },
          { key: 'showOnlineStatus', label: 'הצג סטטוס מחובר', desc: 'משתמשים יראו מתי אתה מחובר' },
          { key: 'allowDirectMessages', label: 'אפשר הודעות פרטיות', desc: 'משתמשים יוכלו לשלוח לך הודעות פרטיות' },
          { key: 'showActivity', label: 'הצג פעילות', desc: 'הצג פעילות אחרונה בפרופיל' }
        ].map(({ key, label, desc }) => (
          <div key={key} className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-semibold ${themeClasses.text}`}>{label}</h4>
                <p className={`text-sm ${themeClasses.textSecondary} mt-1`}>{desc}</p>
              </div>
              <button
                onClick={() => setPrivacySettings(prev => ({ 
                  ...prev, 
                  [key]: !prev[key as keyof typeof prev] 
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings[key as keyof typeof privacySettings] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings[key as keyof typeof privacySettings] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>תצוגה ונושא</h3>
      
      {/* נושא */}
      <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-4`}>
        <h4 className={`font-semibold ${themeClasses.text} mb-3`}>נושא האתר</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', label: 'בהיר', icon: Sun },
            { value: 'dark', label: 'כהה', icon: Moon },
            { value: 'auto', label: 'אוטומטי', icon: Monitor }
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleThemeChange(value)}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                displaySettings.theme === value 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : `border-gray-200 dark:border-gray-600 ${themeClasses.hover}`
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 ${displaySettings.theme === value ? 'text-blue-500' : themeClasses.text}`} />
              <span className={`text-sm font-medium ${displaySettings.theme === value ? 'text-blue-500' : themeClasses.text}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* גודל טקסט */}
      <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-4`}>
        <h4 className={`font-semibold ${themeClasses.text} mb-3`}>גודל טקסט</h4>
        <div className="space-y-3">
          {[
            { value: 'small', label: 'קטן' },
            { value: 'medium', label: 'בינוני' },
            { value: 'large', label: 'גדול' }
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="fontSize"
                value={value}
                checked={displaySettings.fontSize === value}
                onChange={(e) => setDisplaySettings(prev => ({ ...prev, fontSize: e.target.value }))}
                className="form-radio text-blue-500"
              />
              <span className={`${themeClasses.text}`}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* שפה */}
      <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-4`}>
        <h4 className={`font-semibold ${themeClasses.text} mb-3`}>שפת האתר</h4>
        <select
          value={displaySettings.language}
          onChange={(e) => setDisplaySettings(prev => ({ ...prev, language: e.target.value }))}
          className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="he">עברית</option>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>

      {/* פוסטים בעמוד */}
      <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-4`}>
        <h4 className={`font-semibold ${themeClasses.text} mb-3`}>מספר פוסטים בעמוד</h4>
        <input
          type="range"
          min="5"
          max="50"
          step="5"
          value={displaySettings.postsPerPage}
          onChange={(e) => setDisplaySettings(prev => ({ ...prev, postsPerPage: parseInt(e.target.value) }))}
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-2">
          <span className={themeClasses.textSecondary}>5</span>
          <span className={`font-medium ${themeClasses.text}`}>{displaySettings.postsPerPage}</span>
          <span className={themeClasses.textSecondary}>50</span>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'display':
        return renderDisplaySettings();
      default:
        return renderProfileSettings();
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* כפתור חזרה */}
      <button
        onClick={onBack}
        className={`mb-6 flex items-center space-x-2 px-4 py-2 rounded-lg ${themeClasses.hover} ${themeClasses.text} transition-colors`}
      >
        <ArrowRight className="w-4 h-4" />
        <span>חזור לפורום</span>
      </button>

      {/* הודעת שמירה */}
      {saved && (
        <div className="mb-6 flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 border border-green-400 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
          <Check className="w-5 h-5" />
          <span>ההגדרות נשמרו בהצלחה!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* תפריט צד */}
        <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-4 h-fit`}>
          <h2 className={`text-xl font-bold ${themeClasses.text} mb-4`}>הגדרות</h2>
          <nav className="space-y-2">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-right transition-colors ${
                  activeSection === id 
                    ? 'bg-blue-500 text-white' 
                    : `${themeClasses.text} ${themeClasses.hover}`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* תוכן הגדרות */}
        <div className="lg:col-span-3">
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6`}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;