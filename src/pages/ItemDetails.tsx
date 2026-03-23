import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, Download, Play, BookOpen, Share2, Heart, MessageSquare, Loader2, AlertCircle, Bookmark } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!isAuthenticated) return;
      try {
        const [favRes, bookRes] = await Promise.all([
          api.get('/library/favorites'),
          api.get('/library/bookmarks')
        ]);
        
        const favoritStatus = favRes.data.some((f: any) => f.item_id === id);
        const bookmarkStatus = bookRes.data.some((b: any) => b.item_id === id);
        
        setIsFavorite(favoritStatus);
        setIsBookmarked(bookmarkStatus);
      } catch (err) {
        console.error('Error checking user status for item:', err);
      }
    };
    checkStatus();
  }, [id, isAuthenticated]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/library/items/${id}`);
        setItem(response.data);
      } catch (err: any) {
        console.error('Error fetching item:', err);
        setError('Failed to load item details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleReadNow = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/reader/${id}` } } });
      return;
    }

    try {
      // Save to library/progress automatically
      await api.post('/library/progress', { 
        item_id: id, 
        progress_percentage: 0 
      });
      window.open(`/reader/${id}`, '_blank');
    } catch (err) {
      console.error('Error saving to library:', err);
      // Still open even if saving fails
      window.open(`/reader/${id}`, '_blank');
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    try {
      const res = await api.post('/library/favorites', { item_id: id });
      setIsFavorite(res.data.favorited);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    try {
      const res = await api.post('/library/bookmarks', { item_id: id });
      setIsBookmarked(res.data.bookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleDownload = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      // Note: We can't easily "start download after login" without some complex state,
      // but redirecting to login is the first step.
      return;
    }
    // Implement actual download logic here if available
    alert('Download started...');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground text-lg">Fetching resource details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="bg-red-500/10 p-4 rounded-full mb-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md mb-8">{error || 'Resource not found'}</p>
        <Link to="/" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold">
          Back to Discover
        </Link>
      </div>
    );
  }
            
  const bookMetadata = item.library_books?.[0];
  const authors = item.library_book_authors?.map((ba: any) => ba.library_authors?.name).join(', ') || item.author;

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header / Book Info */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        
        {/* Cover Image */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="glass-card rounded-2xl overflow-hidden shadow-2xl relative aspect-[3/4] group">
            <img 
              src={item.cover_image_url || 'https://images.unsplash.com/photo-1543004218-ee141d0ef114?auto=format&fit=crop&q=80&w=400'} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6 gap-4">
              <button 
                onClick={handleToggleFavorite}
                className="bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-md transition-colors"
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>
              <button 
                onClick={handleToggleBookmark}
                className="bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-md transition-colors"
                title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
              >
                <Bookmark className={`h-6 w-6 ${isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-white'}`} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Details Area */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-primary font-semibold mb-4 text-sm tracking-widest uppercase">
            <span>{item.type}</span>
            <span className="text-muted-foreground">&bull;</span>
            <span className={item.is_free ? 'text-green-500' : 'text-primary'}>
              {item.is_free ? 'FREE ACCESS' : 'PREMIUM'}
            </span>
            {bookMetadata?.book_type && (
               <>
                 <span className="text-muted-foreground">&bull;</span>
                 <span className="text-blue-500 uppercase">{bookMetadata.book_type.replace('_', ' ')}</span>
               </>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-4 leading-tight">{item.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">By <span className="text-foreground font-medium">{authors}</span></p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
            <div className="bg-secondary/30 p-4 rounded-xl border border-border flex flex-col items-center text-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mb-1" />
              <span className="font-bold text-foreground">{item.rating || '4.8'}</span>
              <span className="text-xs text-muted-foreground">Rating</span>
            </div>
            <div className="bg-secondary/30 p-4 rounded-xl border border-border flex flex-col items-center text-center">
              <BookOpen className="h-5 w-5 text-primary mb-1" />
              <span className="font-bold text-foreground">{item.library_book_sections?.length || '0'}</span>
              <span className="text-xs text-muted-foreground">Sections</span>
            </div>
            <div className="bg-secondary/30 p-4 rounded-xl border border-border flex flex-col items-center text-center">
              <span className="font-bold text-foreground mb-1">{bookMetadata?.publication_year || '---'}</span>
              <span className="text-xs text-muted-foreground">Year</span>
            </div>
            <div className="bg-secondary/30 p-4 rounded-xl border border-border flex flex-col items-center text-center">
              <span className="font-bold text-foreground mb-1 truncate w-full px-2" title={bookMetadata?.library_publishers?.name}>
                {bookMetadata?.library_publishers?.name || '---'}
              </span>
              <span className="text-xs text-muted-foreground">Publisher</span>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="font-bold mb-2">Description</h3>
            <p className="text-foreground/80 leading-relaxed text-lg max-w-3xl">
              {item.description}
            </p>
          </div>

          {bookMetadata?.library_licenses && (
            <div className="mb-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <h3 className="font-bold text-blue-700 mb-1 flex items-center gap-2">
                <AlertCircle size={16} /> Licensing & Attribution
              </h3>
              <p className="text-sm text-blue-900/70 mb-2">{bookMetadata.library_licenses.attribution_text}</p>
              <div className="flex gap-2 text-xs">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">License: {bookMetadata.library_licenses.name}</span>
                {bookMetadata.library_licenses.url && (
                  <a href={bookMetadata.library_licenses.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View License Details</a>
                )}
              </div>
            </div>
          )}
          
          {bookMetadata?.book_type === 'public_domain' && bookMetadata?.source_url && (
            <div className="mb-8 p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <h3 className="font-bold text-green-700 mb-1 flex items-center gap-2">
                <BookOpen size={16} /> Public Domain Source
              </h3>
              <p className="text-sm text-green-900/70 mb-2">This work is in the public domain. Source:</p>
              <a href={bookMetadata.source_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-xs">
                {bookMetadata.source_url}
              </a>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            {bookMetadata?.access_type === 'link_only' ? (
              <a 
                href={item.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/30"
              >
                <Share2 className="h-5 w-5" />
                <span>Read External</span>
              </a>
            ) : (
              <button 
                onClick={handleReadNow}
                className="flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/30"
              >
                <Play className="h-5 w-5 fill-current" />
                <span>Read Now</span>
              </button>
            )}
            
            {bookMetadata?.download_url && (
              <button 
                onClick={handleDownload}
                className="flex items-center space-x-2 px-6 py-4 glass border-border hover:bg-secondary transition-colors font-medium rounded-full"
              >
                <Download className="h-5 w-5" />
                <span>Download PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-border">
         {/* Citations */}
         {item.library_book_citations?.length > 0 && (
           <section>
             <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
               <BookOpen size={24} className="text-primary" /> Citations
             </h2>
             <div className="space-y-4">
               {item.library_book_citations.map((cit: any, idx: number) => (
                 <div key={idx} className="p-4 bg-secondary/20 rounded-xl border border-border">
                   <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-tighter">{cit.format} FORMAT</p>
                   <p className="text-sm italic text-foreground/80 leading-relaxed font-serif">"{cit.citation_text}"</p>
                 </div>
               ))}
             </div>
           </section>
         )}

         {/* Reviews Section */}
         <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span>Community Reviews</span>
            </h2>
            <button className="text-primary font-semibold hover:underline">Write a Review</button>
          </div>
          
          <div className="space-y-6">
            {item.reviews?.length > 0 ? item.reviews.map((rev: any, idx: number) => (
              <div key={idx} className="glass p-6 rounded-2xl flex space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0 uppercase">
                  {rev.users?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-foreground">{rev.users?.name}</h4>
                      <div className="flex items-center text-yellow-500 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-muted'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    {rev.review_text}
                  </p>
                </div>
              </div>
            )) : <p className="text-muted-foreground italic">No reviews yet. Be the first to share your thoughts!</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
