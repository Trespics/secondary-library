import { NavLink } from 'react-router-dom';
import { LogOut, Bell, Star, Bookmark, Library, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const { user } = useAuth();
  const initials = user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}` : 'U';

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/', icon: Library, label: 'Library' },   
    { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  ];    

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-card">
        <div className="profile-section">
          <div className="profile-avatar">   
            <span className="avatar-initials">{initials}</span>
            <div className="avatar-status"></div>
          </div>
          <h2 className="profile-name">{user?.first_name} {user?.last_name}</h2>
          <p className="profile-email">{user?.email}</p>
          
          <div className="membership-badge">
            <Star className="badge-icon" />
            <span className="badge-text">{user?.role} Member</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" />
              <span>{item.label}</span>
              <div className="nav-indicator" />
            </NavLink>
          ))}
        </nav>

        <div className="notification-badge-sidebar">
          <Bell className="notification-icon" />
          <span className="notification-count">3</span>
        </div>

        <div className="signout-container">
          <button className="signout-button" onClick={onLogout}>
            <LogOut className="signout-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="tips-card">
        <h3 className="tips-title">💡 Pro Tips</h3>
        <ul className="tips-list">
          <li>Set daily reading goals</li>
          <li>Use bookmarks to save progress</li>
          <li>Create your wishlist</li>
          <li>Join reading challenges</li>
        </ul>
      </div>
    </aside>
  );
}