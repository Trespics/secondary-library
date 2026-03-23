import { Heart, Bookmark, BookOpen, Star, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Link } from 'react-router-dom';

export default function BookSections({ activeTab }: { activeTab?: string }) {
  const [activeSection, setActiveSection] = useState('reading');
  const [sections, setSections] = useState<any>({
    reading: [],
    read: [],
    favorites: [],
    bookmarks: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeTab) {
      if (['reading', 'read', 'favorites', 'bookmarks'].includes(activeTab)) {
        setActiveSection(activeTab);
      } else if (activeTab === 'library') {
        setActiveSection('reading');
      }
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [progressRes, favoritesRes, bookmarksRes] = await Promise.all([
        api.get('/library/progress'),
        api.get('/library/favorites'),
        api.get('/library/bookmarks')
      ]);

      const progressData = progressRes.data || [];
      const favoritesData = favoritesRes.data || [];
      const bookmarksData = bookmarksRes.data || [];

      setSections({
        reading: progressData.filter((p: any) => p.progress_percentage < 100).map((p: any) => ({
          ...p.library_items,
          progress: p.progress_percentage,
          id: p.library_items.id
        })),
        read: progressData.filter((p: any) => p.progress_percentage === 100).map((p: any) => ({
          ...p.library_items,
          completed: true,
          id: p.library_items.id
        })),
        favorites: favoritesData.map((f: any) => ({
          ...f.library_items,
          id: f.library_items.id
        })),
        bookmarks: bookmarksData.map((b: any) => ({
          ...b.library_items,
          id: b.library_items.id
        }))
      });
    } catch (err) {
      console.error('Error fetching library data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleFavorite = async (itemId: string) => {
    try {
      await api.post('/library/favorites', { item_id: itemId });
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleToggleBookmark = async (itemId: string) => {
    try {
      await api.post('/library/bookmarks', { item_id: itemId });
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const tabs = [
    { id: 'reading', label: 'Currently Reading', icon: BookOpen },
    { id: 'read', label: 'Finished Reading', icon: Star },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <section className="books-section">
      <div className="section-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeSection === tab.id ? 'active' : ''}`}
              onClick={() => setActiveSection(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="books-grid">
        {sections[activeSection].length > 0 ? (
          sections[activeSection].map((book: any) => (
            <div key={book.id} className="book-card">
              <div className="book-cover-wrapper">
                <Link to={`/items/${book.id}`} target="_blank">
                  <img src={book.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'} alt={book.title} className="book-cover" />
                </Link>
                <div className="book-actions">
                  <button 
                    className={`action-btn ${activeSection === 'favorites' ? 'active text-red-500' : ''}`} 
                    title="Toggle Favorite"
                    onClick={() => handleToggleFavorite(book.id)}
                  >
                    <Heart size={16} fill={activeSection === 'favorites' ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    className={`action-btn ${activeSection === 'bookmarks' ? 'active text-blue-500' : ''}`} 
                    title="Toggle Bookmark"
                    onClick={() => handleToggleBookmark(book.id)}
                  >
                    <Bookmark size={16} fill={activeSection === 'bookmarks' ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              
              <div className="book-info">
                <Link to={`/items/${book.id}`}>
                  <h4 className="book-title">{book.title}</h4>
                </Link>
                <p className="book-author">{book.author}</p>
                
                {book.progress !== undefined && (
                  <div className="mini-progress">
                    <div className="progress-bar-mini">
                      <div className="progress-fill-mini" style={{ width: `${book.progress}%` }}></div>
                    </div>
                    <span className="progress-text">{book.progress}%</span>
                  </div>
                )}
                
                {book.rating && (
                  <div className="rating">
                    {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground italic">
            No books found in this section.
          </div>
        )}
      </div>
    </section>
  );
}