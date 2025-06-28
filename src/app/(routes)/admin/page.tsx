// app/admin/page.tsx - פאנל ניהול
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Film, 
  MessageSquare, 
  Image as ImageIcon, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  Settings
} from 'lucide-react';

interface PendingItem {
  id: number;
  type: 'anime' | 'post' | 'image';
  title: string;
  author: string;
  created_at: string;
  preview?: string;
}

interface Stats {
  totalUsers: number;
  totalAnimes: number;
  totalPosts: number;
  pendingApprovals: number;
  todayViews: number;
  todayPosts: number;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch pending items
      const pendingResponse = await fetch('/api/admin/pending');
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingItems(pendingData.items);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, type: string) => {
    try {
      const response = await fetch(`/api/admin/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      });

      if (response.ok) {
        setPendingItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
        fetchDashboardData(); // Refresh stats
      }
    } catch (error) {
      console.error('Error approving item:', error);
    }
  };

  const handleReject = async (id: number, type: string) => {
    try {
      const response = await fetch(`/api/admin/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      });

      if (response.ok) {
        setPendingItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
        fetchDashboardData(); // Refresh stats
      }
    } catch (error) {
      console.error('Error rejecting item:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'anime': return <Film className="w-5 h-5 text-blue-500" />;
      case 'post': return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-purple-500" />;
      default: return null;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'anime': return 'אנימה';
      case 'post': return 'פוסט';
      case 'image': return 'תמונה';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">משתמשים רשומים</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">אנימות באתר</p>
                <p className="text-2xl font-bold text-white">{stats.totalAnimes.toLocaleString()}</p>
              </div>
              <Film className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">פוסטים פעילים</p>
                <p className="text-2xl font-bold text-white">{stats.totalPosts.toLocaleString()}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">ממתינים לאישור</p>
                <p className="text-2xl font-bold text-white">{stats.pendingApprovals}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">צפיות היום</p>
                <p className="text-2xl font-bold text-white">{stats.todayViews.toLocaleString()}</p>
              </div>
              <Eye className="w-10 h-10 text-indigo-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">פוסטים היום</p>
                <p className="text-2xl font-bold text-white">{stats.todayPosts}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-pink-500" />
            </div>
          </div>
        </div>
      )}

      {/* Pending Approvals */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          ממתינים לאישור
        </h2>

        {pendingItems.length > 0 ? (
          <div className="space-y-4">
            {pendingItems.map(item => (
              <div key={`${item.type}-${item.id}`} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(item.type)}
                    <div>
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <p className="text-sm text-gray-400">
                        {getTypeText(item.type)} • {item.author} • {formatDate(item.created_at)}
                      </p>
                      {item.preview && (
                        <p className="text-sm text-gray-300 mt-1 line-clamp-2">{item.preview}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-blue-400 hover:text-blue-300 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApprove(item.id, item.type)}
                      className="p-2 text-green-400 hover:text-green-300 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(item.id, item.type)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-400">אין פריטים הממתינים לאישור</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-500" />
          פעילות אחרונה
        </h2>
        
        <div className="space-y-3">
          {[
            { action: 'משתמש חדש נרשם', user: 'AnimeUser123', time: 'לפני 5 דקות' },
            { action: 'פוסט חדש פורסם', user: 'OtakuFan', time: 'לפני 15 דקות' },
            { action: 'אנימה חדשה נוספה', user: 'Editor1', time: 'לפני שעה' },
            { action: 'תגובה חדשה נכתבה', user: 'AnimeLover', time: 'לפני שעתיים' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
              <div>
                <p className="text-white">{activity.action}</p>
                <p className="text-sm text-gray-400">על ידי {activity.user}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">ניהול משתמשים</h2>
      <p className="text-gray-400">בקרוב...</p>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'animes':
        return <div className="bg-gray-800 rounded-lg p-6"><h2 className="text-xl font-bold text-white mb-6">ניהול אנימות</h2><p className="text-gray-400">בקרוב...</p></div>;
      case 'posts':
        return <div className="bg-gray-800 rounded-lg p-6"><h2 className="text-xl font-bold text-white mb-6">ניהול פוסטים</h2><p className="text-gray-400">בקרוב...</p></div>;
      case 'settings':
        return <div className="bg-gray-800 rounded-lg p-6"><h2 className="text-xl font-bold text-white mb-6">הגדרות מערכת</h2><p className="text-gray-400">בקרוב...</p></div>;
      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-6">
          <h1 className="text-2xl font-bold mb-8">פאנל ניהול</h1>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'לוח בקרה', icon: TrendingUp },
              { id: 'users', label: 'משתמשים', icon: Users },
              { id: 'animes', label: 'אנימות', icon: Film },
              { id: 'posts', label: 'פוסטים', icon: MessageSquare },
              { id: 'settings', label: 'הגדרות', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
                  activeTab === id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {activeTab === 'dashboard' && 'לוח בקרה'}
              {activeTab === 'users' && 'ניהול משתמשים'}
              {activeTab === 'animes' && 'ניהול אנימות'}
              {activeTab === 'posts' && 'ניהול פוסטים'}
              {activeTab === 'settings' && 'הגדרות מערכת'}
            </h1>
            <p className="text-gray-400 mt-2">ברוכים הבאים לפאנל הניהול</p>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;