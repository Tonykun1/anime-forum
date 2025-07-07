// src/app/Components/ImageUpload.tsx - מעודכן למבנה API החדש
import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Link, Camera, AlertCircle, Check } from 'lucide-react';

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
  maxSize?: number;
  allowedTypes?: string[];
  showPreview?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label,
  placeholder = "הכנס קישור לתמונה או העלה מהמחשב",
  className = "",
  previewClassName = "w-20 h-20",
  themeClasses,
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  showPreview = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [urlInput, setUrlInput] = useState(value || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // בדיקת תקינות URL של תמונה
  const isValidImageUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const urlLower = url.toLowerCase();
      return imageExtensions.some(ext => urlLower.includes(ext)) || 
             urlLower.includes('placeholder') || 
             urlLower.includes('via.placeholder') ||
             urlLower.includes('picsum') ||
             urlLower.includes('unsplash') ||
             urlLower.includes('ui-avatars') ||
             urlLower.includes('/uploads/'); // תמיכה בתמונות שהועלו לשרת
    } catch {
      return false;
    }
  };

  // המרת קובץ ל-Base64 (fallback)
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // העלאת קובץ לשרת
  const uploadToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בהעלאה לשרת');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Server upload failed, using base64:', error);
      // אם השרת לא זמין, נשתמש ב-base64
      return convertToBase64(file);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    // בדיקת סוג הקובץ
    if (!allowedTypes.includes(file.type)) {
      setError(`סוג קובץ לא נתמך. הסוגים המותרים: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`);
      return;
    }

    // בדיקת גודל הקובץ
    if (file.size > maxSize) {
      setError(`הקובץ גדול מדי. גודל מקסימלי: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadToServer(file);
      onChange(imageUrl);
      setUrlInput(imageUrl);
      setSuccess('התמונה הועלתה בהצלחה!');
      
      // הסתר הודעת הצלחה אחרי 3 שניות
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('שגיאה בהעלאת הקובץ:', error);
      setError('שגיאה בהעלאת הקובץ: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    setError(null);
    setSuccess(null);
    
    if (url && isValidImageUrl(url)) {
      onChange(url);
    } else if (url && !isValidImageUrl(url)) {
      setError('כתובת URL לא תקינה לתמונה');
    } else {
      onChange('');
    }
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // בדיקת תקינות התמונה לתצוגה
  const getImageSrc = () => {
    if (!value) return null;
    
    if (value.startsWith('data:image/') || isValidImageUrl(value)) {
      return value;
    }
    
    return null;
  };

  const imageSrc = getImageSrc();

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className={`block text-sm font-medium ${themeClasses.text}`}>
          {label}
        </label>
      )}

      {/* כפתורי בחירת שיטה */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${
            uploadMethod === 'url'
              ? 'bg-blue-500 text-white'
              : `${themeClasses.cardBg} ${themeClasses.text} border ${themeClasses.border} hover:${themeClasses.hover}`
          }`}
        >
          <Link className="w-4 h-4" />
          קישור
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('file')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${
            uploadMethod === 'file'
              ? 'bg-blue-500 text-white'
              : `${themeClasses.cardBg} ${themeClasses.text} border ${themeClasses.border} hover:${themeClasses.hover}`
          }`}
        >
          <Upload className="w-4 h-4" />
          העלאה
        </button>
      </div>

      {/* תצוגת התמונה הנוכחית */}
      {showPreview && imageSrc && (
        <div className="relative inline-block">
          <img
            src={imageSrc}
            alt="תצוגה מקדימה"
            className={`${previewClassName} object-cover border rounded-md ${themeClasses.border}`}
            onError={(e) => {
              console.error('Image failed to load:', imageSrc);
              setError('שגיאה בטעינת התמונה');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* הודעות */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-green-500 text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* שדה URL */}
      {uploadMethod === 'url' && (
        <div className="space-y-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md ${themeClasses.border} ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
          />
          <p className={`text-xs ${themeClasses.textSecondary}`}>
            תומך ב: JPG, PNG, GIF, WebP, SVG
          </p>
        </div>
      )}

      {/* העלאת קובץ */}
      {uploadMethod === 'file' && (
        <div className="space-y-2">
          <div
            onClick={openFileDialog}
            className={`border-2 border-dashed ${themeClasses.border} rounded-md p-6 text-center cursor-pointer transition-colors ${
              isUploading 
                ? 'opacity-50 cursor-not-allowed' 
                : `hover:${themeClasses.hover} hover:border-blue-400`
            }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className={themeClasses.text}>מעלה...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Camera className={`w-8 h-8 ${themeClasses.textSecondary}`} />
                <p className={`${themeClasses.text} font-medium`}>לחץ כדי לבחור תמונה</p>
                <p className={`text-xs ${themeClasses.textSecondary}`}>
                  מקסימום {(maxSize / (1024 * 1024)).toFixed(1)}MB • {allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;