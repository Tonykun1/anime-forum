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
  const [urlInput, setUrlInput] = useState(value);

  // המרת קובץ ל-Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // בדיקת תקינות URL של תמונה
  const isValidImageUrl = (url: string): boolean => {
    if (!url) return false;
    
    // בדיקה אם זה Base64
    if (url.startsWith('data:image/')) return true;
    
    // בדיקה אם זה URL תקין
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
    } catch {
      return false;
    }
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
      setUrlInput(base64);
    } catch (error) {
      console.error('שגיאה בהעלאת הקובץ:', error);
      alert('שגיאה בהעלאת הקובץ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
  };

  const handleUrlSubmit = () => {
    if (isValidImageUrl(urlInput)) {
      onChange(urlInput);
    } else if (urlInput.trim()) {
      alert('אנא הכנס URL תקין של תמונה');
    } else {
      onChange('');
    }
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
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
              ? `${themeClasses.bg} text-white`
              : `${themeClasses.cardBg} ${themeClasses.text} ${themeClasses.border} border hover:${themeClasses.hover}`
          }`}
        >
          <Link size={16} />
          <span>קישור</span>
        </button>
        
        <button
          type="button"
          onClick={() => setUploadMethod('file')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm ${
            uploadMethod === 'file'
              ? `${themeClasses.bg} text-white`
              : `${themeClasses.cardBg} ${themeClasses.text} ${themeClasses.border} border hover:${themeClasses.hover}`
          }`}
        >
          <Upload size={16} />
          <span>העלאה</span>
        </button>
      </div>

      {/* שדה קישור */}
      {uploadMethod === 'url' && (
        <div className="flex space-x-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            onBlur={handleUrlSubmit}
            onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
            placeholder={placeholder}
            className={`flex-1 px-3 py-2 rounded-md border ${themeClasses.border} ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {urlInput && (
            <button
              type="button"
              onClick={handleUrlSubmit}
              className={`px-3 py-2 ${themeClasses.bg} text-white rounded-md hover:opacity-80 transition-opacity`}
            >
              אישור
            </button>
          )}
        </div>
      )}

      {/* אזור העלאת קובץ */}
      {uploadMethod === 'file' && (
        <div 
          onClick={openFileDialog}
          className={`border-2 border-dashed ${themeClasses.border} rounded-lg p-6 cursor-pointer transition-colors hover:${themeClasses.hover} ${themeClasses.cardBg}`}
        >
          <div className="text-center">
            {isUploading ? (
              <div className="animate-spin mx-auto w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            ) : (
              <>
                <Camera className={`mx-auto w-12 h-12 ${themeClasses.textSecondary} mb-2`} />
                <p className={`${themeClasses.text} mb-1`}>לחץ להעלאת תמונה</p>
                <p className={`text-xs ${themeClasses.textSecondary}`}>
                  JPG, PNG, GIF עד 5MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* קובץ הקלט הנסתר */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* תצוגה מקדימה */}
      {value && isValidImageUrl(value) && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${themeClasses.text}`}>תצוגה מקדימה:</span>
            <button
              type="button"
              onClick={clearImage}
              className={`p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors`}
              title="הסר תמונה"
            >
              <X size={16} />
            </button>
          </div>
          <div className={`relative ${previewClassName} rounded-lg overflow-hidden ${themeClasses.border} border`}>
            <img
              src={value}
              alt="תצוגה מקדימה"
              className="w-full h-full object-cover"
              onError={() => {
                console.error('שגיאה בטעינת התמונה');
                clearImage();
              }}
            />
          </div>
        </div>
      )}

      {/* הודעת שגיאה אם URL לא תקין */}
      {value && !isValidImageUrl(value) && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            URL התמונה לא תקין או לא נטען כראוי
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;