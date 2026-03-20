import { useState } from 'react';
import Sidebar from './dashboard/Sidebar';
import StatsGrid from './dashboard/StatsGrid';
import WelcomeBanner from './dashboard/WelcomeBanner';
import ReadingProgress from './dashboard/ReadingProgress';
import BookSections from './dashboard/BookSections';
import RecentActivity from './dashboard/RecentActivity';
import Recommendations from './dashboard/Recommendations';
import LogoutModal from './dashboard/LogoutModal';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('library');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const stats = [
    { icon: 'BookOpen', label: 'Books Read', value: '12', color: '#3b82f6' },
    { icon: 'Clock', label: 'Reading Hours', value: '34', color: '#8b5cf6' },
    { icon: 'Award', label: 'Achievements', value: '8', color: '#10b981' },
    { icon: 'Star', label: 'Bookmarks', value: '23', color: '#f59e0b' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={() => setShowLogoutConfirm(true)} 
        />
        
        <main className="dashboard-main">
          <WelcomeBanner />
          <StatsGrid stats={stats} />
          <ReadingProgress />
          <BookSections />
          
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