import { BookOpen, TrendingUp, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Link } from 'react-router-dom';

export default function ReadingProgress() {
  const [currentBook, setCurrentBook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentBook = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get('/library/progress');
        const inProgress = data.filter((p: any) => p.progress_percentage < 100);
        if (inProgress.length > 0) {
          // Sort by last_read_at if available, otherwise just take the first one
          const latest = inProgress.sort((a: any, b: any) => 
            new Date(b.last_read_at).getTime() - new Date(a.last_read_at).getTime()
          )[0];
          
          setCurrentBook({
            id: latest.library_items.id,
            title: latest.library_items.title,
            author: latest.library_items.author,
            cover: latest.library_items.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
            progress: latest.progress_percentage,
            // Note: pagesRead and totalPages might not be in the basic schema, using progress % instead
          });
        }
      } catch (err) {
        console.error('Error fetching current reading book:', err);
      } finally {
        setIsLoading(false);
      }
    };     

    fetchCurrentBook();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  if (!currentBook) {
    return null; // Or show a prompt to start reading
  }

  return (
    <section className="reading-progress-section">
      <div className="section-header">
        <div className="header-left">
          <BookOpen className="section-icon" />
          <h2 className="section-title">Currently Reading</h2>
        </div>
        <Link to="/discover" className="view-all-button text-sm">Discover More</Link>
      </div>

      <div className="current-book-card">
        <div className="book-cover-large">
          <img src={currentBook.cover} alt={currentBook.title} />
        </div>
        
        <div className="book-details">
          <h3 className="book-title">{currentBook.title}</h3>
          <p className="book-author">{currentBook.author}</p>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${currentBook.progress}%` }}></div>
            </div>
            <div className="progress-stats">
              <span>{currentBook.progress}% completed</span>
            </div>
          </div>
          
          <Link 
            to={`/reader/${currentBook.id}`} 
            className="continue-reading-btn inline-flex items-center justify-center"
            target="_blank"
          >
            Continue Reading
            <TrendingUp className="btn-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}