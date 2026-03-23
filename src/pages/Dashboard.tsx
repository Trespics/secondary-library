import { useState, useEffect } from 'react';
import Sidebar from './dashboard/Sidebar';
import StatsGrid from './dashboard/StatsGrid';
import WelcomeBanner from './dashboard/WelcomeBanner';
import ReadingProgress from './dashboard/ReadingProgress';
import BookSections from './dashboard/BookSections';
import RecentActivity from './dashboard/RecentActivity';
import Recommendations from './dashboard/Recommendations';
import LogoutModal from './dashboard/LogoutModal';
import api from '../lib/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [stats, setStats] = useState([
    { icon: 'BookOpen', label: 'Books Read', value: '0', color: '#3b82f6' },
    { icon: 'Clock', label: 'Reading Hours', value: '0', color: '#8b5cf6' },
    { icon: 'Award', label: 'Achievements', value: '0', color: '#10b981' },
    { icon: 'Star', label: 'Bookmarks', value: '0', color: '#f59e0b' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [progressRes, bookmarksRes] = await Promise.all([
          api.get('/library/progress'),
          api.get('/library/bookmarks')
        ]);

        const booksRead = progressRes.data?.filter((p: any) => p.progress_percentage === 100).length || 0;
        const bookmarksCount = bookmarksRes.data?.length || 0;

        setStats([
          { icon: 'BookOpen', label: 'Books Read', value: booksRead.toString(), color: '#3b82f6' },
          { icon: 'Clock', label: 'Reading Hours', value: '0', color: '#8b5cf6' }, // Not tracked yet
          { icon: 'Award', label: 'Achievements', value: '0', color: '#10b981' }, // Not tracked yet
          { icon: 'Star', label: 'Bookmarks', value: bookmarksCount.toString(), color: '#f59e0b' },
        ]);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Sidebar 
          onLogout={() => setShowLogoutConfirm(true)} 
        />
        
        <main className="dashboard-main">
          <WelcomeBanner />
          <StatsGrid stats={stats} />
          <ReadingProgress />
          <BookSections activeTab="library" />
          
          <div className="dashboard-grid">
            <RecentActivity />
            <Recommendations />
          </div>
        </main>
      </div>

      <LogoutModal 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
      />
    </div>
  );
}