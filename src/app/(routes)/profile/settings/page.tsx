// app/(routes)/profile/settings/page.tsx - עדכון עם API אמיתי
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../Context/AuthContext';
import { 
  User, 
  Save, 
  Camera, 
  Lock, 
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Upload,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// רכיב Toast להודעות
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  } text-white max-w-md`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {type === 'success' && <CheckCircle className="w-5 h-5" />}
        {type === 'error' && <AlertCircle className="w-5 h-5" />}
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// רכיב להעלאת תמונות
interface ImageUploadProps {
  label: string;
  currentImage?: string;
  onImageChange: (url: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  label, 
  currentImage, 
  onImageChange, 
  className = "" 
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onImageChange(result.url);
      } else {
        throw new Error(result.error || 'שגיאה בהעלאת הקובץ');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('שגיאה בהעלאת התמונה: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
      >
        {currentImage ? (
          <div className="space-y-2">
            <img 
              src={currentImage} 
              alt={label}
              className="w-20 h-20 object-cover rounded-lg mx-auto"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              גרור תמונה חדשה או לחץ לשינוי
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Camera className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              גרור תמונה או לחץ להעלאה
            </p>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${label}`}
        />
        
        <label
          htmlFor={`file-upload-${label}`}
          className={`inline-flex items-center gap-2 mt-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
            uploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
              מעלה...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              בחר קובץ
            </>
          )}
        </label>
      </div>
    </div>
  );
};

const ProfileEditPage = () => {
  const { user, isAuthenticated, updateUserProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
    coverImage: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // בדיקת הרשאה ואתחול
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }

    setProfileForm({
      username: user.username || '',
      email: user.email || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      coverImage: user.coverImage || ''
    });

    setLoading(false);
  }, [isAuthenticated, user, router]);

  // הצגת Toast
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // שמירת פרופיל ב-API
  const handleProfileSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // הכן FormData לשליחה
      const formData = new FormData();
      formData.append('username', profileForm.username);
      formData.append('email', profileForm.email);
      formData.append('bio', profileForm.bio);
      formData.append('avatar_url', profileForm.avatar);
      formData.append('cover_url', profileForm.coverImage);

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'x-user-id': user.id.toString(),
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // עדכן את הקונטקסט עם הנתונים החדשים
        updateUserProfile(result.user);
        showToast('הפרופיל עודכן בהצלחה!', 'success');
      } else {
        throw new Error(result.error || 'שגיאה בעדכון הפרופיל');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showToast('שגיאה בעדכון הפרופיל: ' + (error as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // שינוי סיסמה
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('הסיסמאות החדשות לא תואמות', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('הסיסמה חייבת להיות באורך של לפחות 6 תווים', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id.toString() || '',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showToast('הסיסמה שונתה בהצלחה!', 'success');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error(result.error || 'שגיאה בשינוי הסיסמה');
      }
    } catch (error) {
      console.error('Password change error:', error);
      showToast('שגיאה בשינוי הסיסמה: ' + (error as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // validation
  const validateForm = () => {
    const errors = [];
    
    if (!profileForm.username.trim()) {
      errors.push('שם משתמש נדרש');
    }
    
    if (!profileForm.email.includes('@')) {
      errors.push('אימייל לא תקין');
    }
    
    if (profileForm.bio.length > 200) {
      errors.push('הביוגרפיה ארוכה מדי (מקסימום 200 תווים)');
    }
    
    return errors;
  };

  const formErrors = validateForm();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Toast notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* כותרת עליונה */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              עריכת פרופיל
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            ערוך את הפרטים האישיים שלך והגדרות האבטחה
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* תפריט צדדי */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-right rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <User className="w-5 h-5" />
                  <span>פרטים אישיים</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-right rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Shield className="w-5 h-5" />
                  <span>אבטחה וסיסמה</span>
                </button>
              </div>
            </div>
          </div>

                      {/* תוכן עיקרי */}
          <div className="lg:col-span-2 space-y-8">
            {/* פרטים אישיים */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                פרטים אישיים
              </h2>

              <div className="space-y-6">
                {/* תמונת פרופיל */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={profileForm.avatar || `https://via.placeholder.com/80x80/6366F1/FFFFFF?text=${profileForm.username.charAt(0).toUpperCase()}`}
                      alt="תמונת פרופיל"
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                    />
                    <button className="absolute -bottom-1 -right-1 p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <ImageUpload
                      label="תמונת פרופיל"
                      currentImage={profileForm.avatar}
                      onImageChange={(url) => setProfileForm(prev => ({ ...prev, avatar: url }))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* שם משתמש */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    שם משתמש
                  </label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="שם משתמש"
                  />
                </div>

                {/* אימייל */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    כתובת אימייל
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    placeholder="אימייל"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    לא ניתן לשנות את כתובת האימייל
                  </p>
                </div>

                {/* ביוגרפיה */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    אודות (ביוגרפיה)
                  </label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="ספר על עצמך..."
                    rows={4}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {profileForm.bio.length}/200 תווים
                  </p>
                </div>

                {/* תמונת רקע */}
                <div>
                  <ImageUpload
                    label="תמונת רקע"
                    currentImage={profileForm.coverImage}
                    onImageChange={(url) => setProfileForm(prev => ({ ...prev, coverImage: url }))}
                  />
                  {profileForm.coverImage && (
                    <div className="mt-2">
                      <img
                        src={profileForm.coverImage}
                        alt="תמונת רקע"
                        className="w-full h-20 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>

                {/* הצגת שגיאות validation */}
                {formErrors.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">שגיאות בטופס:</span>
                    </div>
                    <ul className="mt-2 text-sm text-red-600 dark:text-red-400 list-disc list-inside">
                      {formErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={handleProfileSave}
                  disabled={saving || formErrors.length > 0}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? 'שומר...' : 'שמור שינויים'}
                </button>
              </div>
            </div>

            {/* שינוי סיסמה */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                שינוי סיסמה
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    סיסמה נוכחית
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="הכנס סיסמה נוכחית"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    סיסמה חדשה
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="הכנס סיסמה חדשה"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    אימות סיסמה חדשה
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="חזור על הסיסמה החדשה"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  {saving ? 'משנה...' : 'שנה סיסמה'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;