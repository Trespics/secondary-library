import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, Download, Play, BookOpen, Share2, Heart, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
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

  const handleReadNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/reader/${id}` } } });
      return;
    }
    navigate(`/reader/${id}`);
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-md transition-colors"
                title="Add to Favorites"
              >
                <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
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
          </div>
          
          <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-4 leading-tight">{item.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">By <span className="text-foreground font-medium">{item.author}</span></p>
          
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm bg-secondary/50 p-4 rounded-xl border border-border">
            <div className="flex items-center space-x-1 border-r border-border pr-6">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-foreground text-base">{item.rating || '4.8'}</span>
              <span className="text-muted-foreground">({item.reviews || '124'} reviews)</span>
            </div>
            <div className="flex items-center space-x-2 border-r border-border pr-6">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{item.pages || '---'} Pages</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Language:</span>
              <span className="font-medium">{item.language || 'English'}</span>
            </div>
          </div>
          
          <p className="text-foreground/80 leading-relaxed mb-8 max-w-3xl text-lg text-balance">
            {item.description}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={handleReadNow}
              className="flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/30"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>Read Now</span>
            </button>
            
            <button 
              onClick={handleDownload}
              className="flex items-center space-x-2 px-6 py-4 glass border-border hover:bg-secondary transition-colors font-medium rounded-full"
            >
              <Download className="h-5 w-5" />
              <span>Download PDF</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-4 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <hr className="border-border" />
      
      {/* Reviews Section */}
      <section className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span>Community Reviews</span>
          </h2>
          <button className="text-primary font-semibold hover:underline">Write a Review</button>
        </div>
        
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl flex space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              JD
            </div>
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-foreground">John Doe</h4>
                  <div className="flex items-center text-yellow-500 mt-1">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed">
                This book is an absolute lifesaver. It breaks down complex calculus concepts into very understandable pieces aligned exactly with the CBC syllabus. Highly recommended!
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
