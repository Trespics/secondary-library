import { Sparkles, Loader2, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Link } from 'react-router-dom';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get('/library/items');
        // Simple recommendation: just pick some random items or the newest ones
        setRecommendations(data.slice(0, 3).map((item: any) => ({
          id: item.id,
          title: item.title,
          author: item.author,
          cover: item.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
          reason: 'Recommended for you'
        })));
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-primary" size={20} />
      </div>
    );
  }

  return (
    <section className="recommendations-section">
      <div className="section-header">
        <Sparkles className="section-icon" />
        <h2 className="section-title">Recommended for You</h2>
      </div>
      
      <div className="recommendations-list">
        {recommendations.length > 0 ? (
          recommendations.map((book) => (
            <div key={book.id} className="recommendation-card">
              <Link to={`/items/${book.id}`} className="recommendation-cover" target="_blank">
                <img src={book.cover} alt={book.title} />
              </Link>
              <div className="recommendation-info">
                <Link to={`/items/${book.id}`} target="_blank">
                  <h3 className="recommendation-title">{book.title}</h3>
                </Link>
                <p className="recommendation-author">{book.author}</p>
                <p className="recommendation-reason">{book.reason}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground italic">
            <BookOpen size={24} className="mb-2 opacity-20" />
            <p className="text-sm text-center">No recommendations yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}