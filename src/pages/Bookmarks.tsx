import { useState, useEffect } from 'react';
import api from '../lib/api';
import BookCard from '../components/BookCard';
import { Bookmark, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/library/bookmarks');
      setBookmarks(data.map((b: any) => b.library_items));
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setIsLoading(false);
    }
  };
     
  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 mt-16 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex items-center space-x-2">
            <Bookmark className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold">My Bookmarks</h1>
          </div>
        </div>
        <div className="text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full text-sm font-medium">
          {bookmarks.length} {bookmarks.length === 1 ? 'Item' : 'Items'} Saved
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">Loading your bookmarks...</p>
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {bookmarks.map((item) => (
            <BookCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-3xl p-12 max-w-2xl mx-auto">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="h-10 w-10 text-primary opacity-40" />
          </div>
          <h3 className="text-2xl font-display font-bold mb-3">No bookmarks yet</h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Start exploring our library and save your favorite resources here for quick access.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20"
          >
            Browse Library
          </Link>
        </div>
      )}
    </div>
  );
}
