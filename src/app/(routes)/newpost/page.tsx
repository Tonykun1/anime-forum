// app/newpost/page.tsx - גישה חלופית עם דף רגיל
'use client'
import React, { useState } from 'react'
import { X, MessageSquare, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/Context/AuthContext'
import ImageUpload from '@/app/Components/ImageUpload'
import { ForumPostData } from '@/app/types'

const themeClasses = {
  bg: 'bg-gray-900',
  cardBg: 'bg-gray-800',
  text: 'text-white',
  textSecondary: 'text-gray-300',
  border: 'border-gray-700',
  hover: 'hover:bg-gray-700'
}

function NewPost() {
  const router = useRouter()
  const { user, updateUserProfile } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postImage: '',
    category: 'דיונים'
  })
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const categories = [
    'דיונים',
    'ביקורות', 
    'המלצות',
    'שאלות',
    'חדשות',
    'מימים'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('אנא מלא את כל השדות הנדרשים')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          image_url: formData.postImage || null,
          category_name: formData.category
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'שגיאה ביצירת הפוסט')
      }

      const result = await response.json()
      console.log('Post created successfully:', result)

      if (user && updateUserProfile) {
        updateUserProfile({ postsCount: user.postsCount + 1 })
      }
      
      router.push('/')

    } catch (error: any) {
      console.error('Error creating post:', error)
      setError(error.message || 'שגיאה ביצירת הפוסט')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-gray-300" />
            </button>
            <h1 className="text-2xl font-bold text-white">יצירת פוסט חדש</h1>
          </div>
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm text-white">{showPreview ? 'עריכה' : 'תצוגה מקדימה'}</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {showPreview ? (
          /* Preview Mode */
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            {formData.postImage && (
              <div className="relative">
                <img 
                  src={formData.postImage} 
                  alt="תצוגה מקדימה"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={user?.avatar || `https://via.placeholder.com/40x40/6366F1/FFFFFF?text=${user?.username?.charAt(0)?.toUpperCase() || 'U'}`}
                  alt={user?.username}
                  className="w-10 h-10 rounded-full border-2 border-blue-500"
                />
                <div>
                  <h4 className="font-semibold text-white">{user?.username}</h4>
                  <p className="text-sm text-gray-300">עכשיו • {formData.category}</p>
                </div>
              </div>
              
              <h3 className="font-bold text-xl text-white mb-3">
                {formData.title}
              </h3>
              
              <p className="text-gray-300 whitespace-pre-wrap">
                {formData.content}
              </p>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              {/* User Info */}
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-700 mb-6">
                <img 
                  src={user?.avatar || `https://via.placeholder.com/48x48/6366F1/FFFFFF?text=${user?.username?.charAt(0)?.toUpperCase() || 'U'}`}
                  alt={user?.username}
                  className="w-12 h-12 rounded-full border-2 border-blue-500"
                />
                <div>
                  <h4 className="font-semibold text-white">{user?.username}</h4>
                  <p className="text-sm text-gray-300">יוצר פוסט חדש</p>
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  קטגוריה
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  כותרת הפוסט *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="מה הנושא שברצונך לדן בו?"
                  maxLength={100}
                />
                <p className="text-xs text-gray-300 mt-1">
                  {formData.title.length}/100 תווים
                </p>
              </div>

              {/* Post Image */}
              <ImageUpload
                value={formData.postImage}
                onChange={(url) => setFormData(prev => ({ ...prev, postImage: url }))}
                label="תמונת פוסט"
                placeholder="הוסף תמונה לפוסט שלך"
                previewClassName="w-full h-32"
                themeClasses={themeClasses}
              />

              {/* Content */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-white mb-2">
                  תוכן הפוסט *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="שתף את המחשבות שלך עם הקהילה..."
                  rows={8}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-300 mt-1">
                  {formData.content.length}/1000 תווים
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <MessageSquare className="w-4 h-4" />
                )}
                <span>{loading ? 'מפרסם...' : 'פרסם פוסט'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default NewPost