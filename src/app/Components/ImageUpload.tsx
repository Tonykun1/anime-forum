// src/components/ImageUpload.tsx
import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Link, Camera } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
  previewClassName?: string;
  themeClasses: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
  };
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label,
  placeholder = "הכנס קישור לתמונה או העלה מהמחשב",
  className = "",
  previewClassName = "w-20 h-20",
  themeClasses
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');

  // המרת קובץ ל-Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // בדיקת סוג הקובץ
    if (!file.type.startsWith('image/')) {
      alert('אנא בחר קובץ תמונה בלבד');
      return;
    }

    // בדיקת גודל הקובץ (מקסימום 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('גודל הקובץ חייב להיות קטן מ-5MB');
      return;
    }

    setIsUploading(true);
    try {
      const base64 = await convertToBase64(file);
      onChange(base64);
    } catch (error) {
      console.error('שגיאה בהעלאת הקובץ:', error);
      alert('שגיאה בהעלאת הקובץ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className={`block text-sm font-medium ${themeClasses.text}`}>
        {label}
      </label>

      {/* כפתורי בחירת שיטה */}
      <div className="flex space-x-2 mb-3">
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm ${
            uploadMethod === 'url'
              ? 'bg-blue-500 text-white'
              : `${themeClasses.hover} ${themeClasses.text}`
          }`}
        >
          <Link className="w-4 h-4" />
          <span>קישור</span>
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('file')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm ${
            uploadMethod === 'file'
              ? 'bg-blue-500 text-white'
              : `${themeClasses.hover} ${themeClasses.text}`
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>העלה קובץ</span>
        </button>
      </div>

      {/* תצוגת תמונה נוכחית */}
      {value && (
        <div className="flex items-center space-x-3 mb-3">
          <div className={`${previewClassName} rounded-lg overflow-hidden border-2 border-blue-500 relative group`}>
            <img
              src={value}
              alt="תצוגה מקדימה"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `data:image/svg+xml;base64,${btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="#f3f4f6"/>
                    <text x="50" y="50" text-anchor="middle" dy=".3em" fill="#9ca3af">שגיאה</text>
                  </svg>
                `)}`;
              }}
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1">
            <p className={`text-sm ${themeClasses.text} font-medium`}>תמונה נטענה</p>
            <p className={`text-xs ${themeClasses.textSecondary}`}>
              {value.startsWith('data:') ? 'קובץ מועלה' : 'קישור חיצוני'}
            </p>
          </div>
        </div>
      )}

      {/* שדה קלט לפי השיטה הנבחרת */}
      {uploadMethod === 'url' ? (
        <div className="relative">
          <Link className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary} w-4 h-4`} />
          <input
            type="url"
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={openFileDialog}
            disabled={isUploading}
            className={`w-full flex flex-col items-center justify-center px-6 py-4 border-2 border-dashed ${themeClasses.border} rounded-lg ${themeClasses.hover} transition-colors disabled:opacity-50`}
          >
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className={`text-sm ${themeClasses.text}`}>מעלה...</span>
              </div>
            ) : (
              <>
                <Camera className={`w-8 h-8 ${themeClasses.textSecondary} mb-2`} />
                <span className={`text-sm font-medium ${themeClasses.text}`}>
                  לחץ להעלאת תמונה
                </span>
                <span className={`text-xs ${themeClasses.textSecondary} mt-1`}>
                  PNG, JPG, GIF עד 5MB
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* הדרכה */}
      <div className={`text-xs ${themeClasses.textSecondary} bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-2`}>
        <div className="flex items-start space-x-2">
          <ImageIcon className="w-3 h-3 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-700 dark:text-blue-300">טיפים להעלאת תמונות:</p>
            <ul className="mt-1 space-y-1">
              <li>• השתמש בקישור ישיר לתמונה או העלה מהמחשב</li>
              <li>• תמונות מועלות נשמרות במכשיר שלך בלבד</li>
              <li>• גודל מקסימלי: 5MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;