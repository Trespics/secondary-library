import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import type { LibraryItem } from '../components/BookCard';
import { Sparkles, TrendingUp, ArrowRight, BookOpen, Video, FileText, Headphones, Loader2 } from 'lucide-react';
import api from '../lib/api';
import '../styles/Home.css';

const CATEGORIES = ['All', 'Science', 'History', 'Literature', 'Textbooks', 'Past Papers'];
const BOOK_TYPES = ['All', 'public_domain', 'oer', 'licensed', 'external_reference', 'video', 'audio', 'paper'];

export default function Home() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookType, setSelectedBookType] = useState('All');
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/library/items');
        setItems(response.data);
      } catch (err: any) {
        console.error('Error fetching items:', err);
        setError('Failed to load resources. Please log in or try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    // Category Filter
    if (activeTab !== 'All') {
      if (activeTab === 'Science') {
        const titleLower = item.title.toLowerCase();
        if (!(titleLower.includes('calculus') || titleLower.includes('biology') || titleLower.includes('chemistry') || titleLower.includes('physics'))) return false;
      } else if (activeTab === 'History' && !item.title.toLowerCase().includes('history')) return false;
      else if (activeTab === 'Literature' && !item.title.toLowerCase().includes('gatsby')) return false;
      else if (activeTab === 'Textbooks' && item.type !== 'Book') return false;
      else if (activeTab === 'Past Papers' && item.type !== 'Paper') return false;
    }

    // Book Type Filter
    const bookMeta = item.library_books?.[0];
    if (selectedBookType !== 'All') {
      if (['video', 'audio', 'paper'].includes(selectedBookType)) {
        if (item.type.toLowerCase() !== selectedBookType) return false;
      } else {
        if (bookMeta?.book_type !== selectedBookType) return false;
      }
    }

    // Search Filter
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookMeta?.library_publishers?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-blur-circle hero-blur-circle-1"></div>
            <div className="hero-blur-circle hero-blur-circle-2"></div>
          </div>
          
          <div className="hero-content-wrapper">
            <div className="hero-badge">
              <Sparkles className="badge-icon" />
              <span className="badge-text">New Resources Added</span>
            </div>
            
            <h1 className="hero-title">
              Empower Your Mind with the{' '}
              <span className="hero-title-gradient">Ultimate Library</span>
            </h1>
            
            <p className="hero-description">
              Access thousands of books, past papers, multimedia courses, 
              and research materials completely tailored for the CBC curriculum.
            </p>
            
            <div className="hero-actions">
              <button className="hero-button hero-button-primary">
                Start Exploring
              </button>
              <button className="hero-button hero-button-secondary">
                Browse Categories
              </button>
            </div>

            {/* Quick Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Resources</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">5K+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Free Items</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="main-content">
          {/* Header with Search */}
          <div className="content-header">
            <div className="header-left">
              <div className="header-icon-wrapper">
                <TrendingUp className="header-icon" />
              </div>
              <h2 className="header-title">Trending Now</h2>
            </div>

            {/* Search Bar */}
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="categories-wrapper space-y-4">
            <div className="categories-scroll">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`category-button ${activeTab === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="text-muted-foreground mr-2 font-semibold uppercase">Type:</span>
              {BOOK_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedBookType(type)}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    selectedBookType === type 
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                      : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="results-info">
            <p className="results-text">
              Showing <span className="results-highlight">{filteredItems.length}</span> resources
              {activeTab !== 'All' && ` in ${activeTab}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading amazing resources for you...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <BookOpen className="empty-icon text-red-500" />
              </div>
              <h3 className="empty-title">Access Restricted</h3>
              <p className="empty-description">{error}</p>
              <Link to="/login" className="empty-button inline-block text-center no-underline">
                Sign In to View
              </Link>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <BookOpen className="empty-icon" />
              </div>
              <h3 className="empty-title">No resources found</h3>
              <p className="empty-description">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button 
                className="empty-button"
                onClick={() => {
                  setActiveTab('All');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="resources-grid">
              {filteredItems.map((item) => (
                <BookCard key={item.id} item={item} />
              ))}
            </div>
          )}
          
          {/* View All Link */}
          {filteredItems.length > 0 && (
            <div className="view-all-wrapper">
              <button className="view-all-button">
                <span>View All Materials</span>
                <ArrowRight className="view-all-icon" />
              </button>
            </div>
          )}
        </section>

        {/* Featured Categories Section */}
        <section className="featured-section">
          <h2 className="featured-title">Browse by Category</h2>
          <div className="featured-grid">
            {[
              { name: 'Books', icon: BookOpen, count: 245, color: '#3b82f6' },
              { name: 'Videos', icon: Video, count: 189, color: '#8b5cf6' },
              { name: 'Past Papers', icon: FileText, count: 156, color: '#10b981' },
              { name: 'Audio Books', icon: Headphones, count: 98, color: '#f59e0b' },
            ].map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="featured-card">
                  <div className="featured-card-content">
                    <div className="featured-icon-wrapper" style={{ background: `${category.color}15` }}>
                      <Icon className="featured-icon" style={{ color: category.color }} />
                    </div>
                    <div>
                      <h3 className="featured-category-name">{category.name}</h3>
                      <p className="featured-category-count">{category.count} resources</p>
                    </div>
                  </div>
                  <button className="featured-arrow" style={{ color: category.color }}>
                    <ArrowRight size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Stay Updated</h2>
            <p className="newsletter-description">
              Get notified when new resources are added to the library.
            </p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
            <p className="newsletter-note">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
          <div className="newsletter-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
          </div>
        </section>
      </div>
    </div>
  );
}