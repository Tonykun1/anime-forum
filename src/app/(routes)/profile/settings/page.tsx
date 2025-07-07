// app/profile/settings/page.tsx - עם טיפול בשגיאות
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../Context/AuthContext';
import { 
  User, 
  Save, 
  ArrowLeft,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ProfileSettingsPage = () => {
  const { user, isAuthenticated, updateUserProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
    cover_image: ''
  });

  // בדיקת הרשאה ואתחול
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }

    // טעינת נתוני המשתמש
    try {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        cover_image: user.cover_image || user.coverImage || ''
      });
      
      console.log('📋 User data loaded:', {
        username: user.username,
        cover_image: user.cover_image,
        coverImage: user.coverImage
      });
      
      setError(null);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('שגיאה בטעינת הפרופיל');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, router]);

  // שמירת פרופיל
  const handleSave = async () => {
    if (!user || !updateUserProfile) {
      setError('לא ניתן לעדכן פרופיל - משתמש לא מחובר');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    
    try {
      console.log('💾 Saving profile with cover_image:', profileForm.cover_image);
      
      // עדכון בקונטקסט (מיידי)
      updateUserProfile({
        username: profileForm.username,
        bio: profileForm.bio,
        avatar: profileForm.avatar,
        cover_image: profileForm.cover_image,
        coverImage: profileForm.cover_image // שני השמות
      });

      console.log('✅ Profile updated in context');

      // נסה לשלוח לAPI גם (אופציונלי)
      try {
        const response = await fetch('/api/profile/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: profileForm.username,
            bio: profileForm.bio,
            avatar: profileForm.avatar,
            cover_image: profileForm.cover_image
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Profile updated via API:', data);
        } else {
          console.log('⚠️ API update failed, but context updated');
        }
      } catch (apiError) {
        console.log('⚠️ API not available, but context updated');
      }

      // הצגת הודעת הצלחה
      setSaveSuccess(true);
      
      // הפניה לפרופיל אחרי 2 שניות
      setTimeout(() => {
        router.push(`/profile/${profileForm.username}`);
      }, 2000);

    } catch (error: any) {
      console.error('❌ Error updating profile:', error);
      setError('שגיאה בעדכון הפרופיל: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      
      {/* הודעת הצלחה */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>הפרופיל נשמר בהצלחה! מעביר לפרופיל...</span>
        </div>
      )}

      {/* הודעת שגיאה */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">שגיאה</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-8 px-4">
        
        {/* כותרת עליונה */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-bold text-white">
                עריכת פרופיל
              </h1>
            </div>
            
            {/* קישור לפרופיל */}
            <button
              onClick={() => router.push(`/profile/${user.username}`)}
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>צפה בפרופיל</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* תפריט צדדי */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-right rounded-lg bg-blue-900/20 text-blue-400 border border-blue-800">
                  <User className="w-5 h-5" />
                  <span>פרטים אישיים</span>
                </button>
              </div>
            </div>
          </div>

          {/* תוכן עיקרי */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                פרטים אישיים
              </h2>

              <div className="space-y-6">
                
                {/* תמונת פרופיל */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={profileForm.avatar || `https://via.placeholder.com/80x80/6366F1/FFFFFF?text=${profileForm.username.charAt(0).toUpperCase()}`}
                      alt="תמונת פרופיל"
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-600"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      תמונת פרופיל
                    </label>
                    <input
                      type="url"
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, avatar: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>

                {/* שם משתמש */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    שם משתמש
                  </label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="שם משתמש"
                  />
                </div>

                {/* אימייל */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    כתובת אימייל
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-600 text-gray-400 cursor-not-allowed"
                    placeholder="אימייל"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    לא ניתן לשנות את כתובת האימייל
                  </p>
                </div>

                {/* ביוגרפיה */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    אודות (ביוגרפיה)
                  </label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="ספר על עצמך..."
                    rows={4}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {profileForm.bio.length}/200 תווים
                  </p>
                </div>

                {/* תמונת רקע */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    תמונת רקע
                  </label>
                  
                  {/* תצוגה נוכחית של תמונת הרקע */}
                  {profileForm.cover_image ? (
                    <div className="mb-4">
                      <div className="relative h-32 rounded-lg overflow-hidden border border-gray-600">
                        <img
                          src={profileForm.cover_image}
                          alt="תמונת רקע נוכחית"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('❌ Error loading cover image preview');
                            e.currentTarget.src = '';
                            e.currentTarget.alt = 'שגיאה בטעינת התמונה';
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">תמונת הרקע הנוכחית</p>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="h-32 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">אין תמונת רקע</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* שדה עריכת תמונת רקע */}
                  <input
                    type="url"
                    value={profileForm.cover_image}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, cover_image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/cover.jpg"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    הכנס קישור לתמונת רקע חדשה
                  </p>
                  
                  {/* מידע debug */}
                  <div className="mt-3 p-3 bg-gray-700 rounded text-xs">
                    <p className="text-gray-400 mb-1">מצב נוכחי:</p>
                    <p className="text-white">בקונטקסט: {user.cover_image || user.coverImage || 'ריק'}</p>
                    <p className="text-white">בטופס: {profileForm.cover_image || 'ריק'}</p>
                  </div>
                </div>

                {/* כפתור שמירה */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={saving || saveSuccess}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : saveSuccess ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? 'שומר...' : saveSuccess ? 'נשמר!' : 'שמור שינויים'}
                  </button>

                  <button
                    onClick={() => router.push(`/profile/${user.username}`)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;