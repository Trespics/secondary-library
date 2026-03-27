import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, Bell, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';
import Logo from "../assets/logo1.png"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const navLinks = [
    { name: 'Discover', path: '/', icon: BookOpen },
    { name: 'My Dashboard', path: '/dashboard', icon: User },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setShowUserMenu(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          
          {/* Logo */}
          <Link to="/" className="navbar-logo">
              <img src={Logo} alt="Logo" className="logo-icon" />
            <span className="logo-text">
              FloranteHub &nbsp; Library
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            <div className="nav-links">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="nav-link-icon" />
                    <span>{link.name}</span>
                    {isActive && <span className="nav-link-indicator"></span>}
                  </Link>
                );
              })}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-wrapper">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="submit" className="search-submit">
                    Go
                  </button>
                )}
              </div>
            </form>

            {/* Actions */}
            <div className="navbar-actions">
              {isAuthenticated ? (
                <>
                  <button className="notification-button">
                    <Bell className="notification-icon" />
                    <span className="notification-dot"></span>
                  </button>
                  
                  <div className="user-menu-wrapper">
                    <button 
                      className="profile-button"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <User className="profile-icon" />
                    </button>
                    
                    {showUserMenu && (
                      <div className="user-dropdown">
                        <div className="user-dropdown-header">
                          <p className="user-name">{user?.first_name} {user?.last_name}</p>
                          <p className="user-role">{user?.role}</p>
                        </div>
                        <div className="user-dropdown-divider"></div>
                        <Link to="/dashboard" className="dropdown-item">
                          <User size={16} />
                          <span>Dashboard</span>
                        </Link>
                        <button onClick={handleLogout} className="dropdown-item logout-item">
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login" className="login-nav-button">
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="navbar-mobile-toggle">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`menu-button ${isOpen ? 'active' : ''}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-container">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mobile-search">
            <div className="mobile-search-container">
              <Search className="mobile-search-icon" />
              <input
                type="text"
                placeholder="Search..."
                className="mobile-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Mobile Navigation Links */}
          <div className="mobile-nav-links">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="mobile-nav-icon" />
                  <span>{link.name}</span>
                  {isActive && <span className="mobile-nav-indicator"></span>}
                </Link>
              );
            })}
          </div>

          {/* Mobile Actions */}
          <div className="mobile-actions">
            {isAuthenticated ? (
              <>
                <div className="mobile-user-info">
                  <p className="mobile-user-name">{user?.first_name} {user?.last_name}</p>
                  <p className="mobile-user-role">{user?.role}</p>
                </div>
                <button className="mobile-action-button">
                  <Bell className="mobile-action-icon" />
                  <span>Notifications</span>
                  <span className="mobile-notification-badge">3</span>
                </button>
                <button onClick={handleLogout} className="mobile-action-button logout-button">
                  <LogOut className="mobile-action-icon" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="mobile-login-button">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Footer */}
          <div className="mobile-footer">
            <p className="mobile-footer-text">
              &copy; 2026 CBC Library. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}