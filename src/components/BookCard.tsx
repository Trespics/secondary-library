import { Link } from 'react-router-dom';
import { Star, FileText, Video, Headphones, BookOpen, Bookmark } from 'lucide-react';
import { useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  cover_image_url: string;
  type: 'Book' | 'Video' | 'Audio' | 'Paper';
  category?: { name: string };
  is_free: boolean;
  rating?: number;
  library_books?: any[];
  library_book_authors?: any[];
  library_book_sections?: any[];
  library_book_citations?: any[];
}

export default function BookCard({ item, isBookmarkedInitial = false }: { item: LibraryItem, isBookmarkedInitial?: boolean }) {
  const { isAuthenticated } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial);
  const [isToggling, setIsToggling] = useState(false);

  const Icon = {
    Book: BookOpen,
    Video: Video,
    Audio: Headphones,
    Paper: FileText,
  }[item.type] || BookOpen;

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;
    
    try {
      setIsToggling(true);
      // Assuming the API endpoint toggles the bookmark status
      // and returns the new status or just a success message.
      // For simplicity, we'll just toggle locally after a successful call.
      await api.post('/library/bookmarks', { item_id: item.id });
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Link 
      to={`/item/${item.id}`} 
      className="group flex flex-col glass-card rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        {item.cover_image_url ? (
          <img 
            src={item.cover_image_url} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <Icon className="h-16 w-16 text-primary/40" />
          </div>
        )}
        
        {/* Bookmark Tag */}
        <button 
          onClick={handleToggleBookmark}
          disabled={isToggling}
          className={`absolute top-3 right-3 p-2 rounded-full glass transition-all hover:scale-110 z-10 ${
            isBookmarked ? 'text-primary' : 'text-foreground/40 hover:text-primary'
          }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
        >
          <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Type Badge */}
        <div className="absolute top-3 left-3 glass px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-sm">
          <Icon className="h-3.5 w-3.5 text-foreground/80" />
          <span className="text-xs font-medium text-foreground/90">{item.type}</span>
        </div>
        
        {/* Access Badge - Moved down to not overlap bookmark */}
        <div className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
          item.is_free ? 'bg-green-500/90 text-white' : 'bg-primary/90 text-white'
        }`}>
          {item.is_free ? 'FREE' : 'PREMIUM'}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display font-semibold text-lg line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 flex-1">{item.author}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{item.rating || '4.5'}</span>
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-secondary/80 px-2 py-1 rounded-md">
            {item.category?.name || 'Education'}
          </span>
        </div>
      </div>
    </Link>
  );
}
