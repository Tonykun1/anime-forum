// src/app/Components/LoginModal.tsx - מתוקן לעבוד עם API החדש
import React, { useState } from 'react';
import { X, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { LoginFormData, RegisterFormData } from '../types/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeClasses: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
  };
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, themeClasses }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const { login, register } = useAuth();

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: ''
  });

  const resetForms = () => {
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ username: '', email: '', password: '', confirmPassword: '', avatar: '' });
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(loginForm);
      if (success) {
        handleClose();
      } else {
        setError('אימייל או סיסמה שגויים');
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // בדיקות validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('הסיסמאות לא תואמות');
      setLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      setLoading(false);
      return;
    }

    if (!registerForm.username.trim()) {
      setError('שם משתמש נדרש');
      setLoading(false);
      return;
    }

    if (!registerForm.email.trim()) {
      setError('אימייל נדרש');
      setLoading(false);
      return;
    }

    try {
      const success = await register(registerForm);
      if (success) {
        handleClose();
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה ברישום');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${themeClasses.cardBg} rounded-lg shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${themeClasses.text}`}>
              {isLogin ? 'התחברות' : 'הרשמה'}
            </h2>
            <button
              onClick={handleClose}
              className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className={`${themeClasses.textSecondary} mb-6 text-center`}>
            הצטרפו לקהילת חובבי האנימה
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>
                  אימייל
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="הכנס את האימייל שלך"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>
                  סיסמה
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                    placeholder="הכנס את הסיסמה שלך"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary}`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    התחבר
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>
                  שם משתמש
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                  className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="בחר שם משתמש"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>
                  אימייל
                </label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="הכנס את האימייל שלך"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>
                  תמונת פרופיל (קישור)
                </label>
                <input
                  type="url"
                  value={registerForm.avatar}
                  onChange={(e) => setRegisterForm({...registerForm, avatar: e.target.value})}
                  className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://example.com/avatar.jpg (אופציונלי)"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>
                  סיסמה
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                    placeholder="בחר סיסמה (לפחות 6 תווים)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary}`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>
                  אישור סיסמה
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    className={`w-full px-3 py-2 border ${themeClasses.border} rounded-md ${themeClasses.cardBg} ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                    placeholder="הכנס את הסיסמה שוב"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    הירשם
                  </>
                )}
              </button>
            </form>
          )}

          {/* מעבר בין התחברות לרישום */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${themeClasses.textSecondary}`}>
              {isLogin ? 'עדיין לא רשום?' : 'כבר יש לך חשבון?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  resetForms();
                }}
                className="text-blue-500 hover:text-blue-600 font-medium mr-1"
              >
                {isLogin ? 'הירשם כאן' : 'התחבר כאן'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;