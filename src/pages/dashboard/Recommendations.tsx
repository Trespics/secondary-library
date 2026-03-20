import { Download, Sparkles } from 'lucide-react';

export default function Recommendations() {
  const recommendations = [
    { id: 1, title: 'Atomic Habits', author: 'James Clear', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400', reason: 'Based on your interests' },
    { id: 2, title: 'The Psychology of Money', author: 'Morgan Housel', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400', reason: 'Popular in your genre' },
  ];

  return (
    <section className="recommendations-section">
      <div className="section-header">
        <Sparkles className="section-icon" />
        <h2 className="section-title">Recommended for You</h2>
      </div>
      
      <div className="recommendations-list">
        {recommendations.map((book) => (
          <div key={book.id} className="recommendation-card">
            <div className="recommendation-cover">
              <img src={book.cover} alt={book.title} />
              <button className="download-button">
                <Download size={14} />
              </button>
            </div>
            <div className="recommendation-info">
              <h3 className="recommendation-title">{book.title}</h3>
              <p className="recommendation-author">{book.author}</p>
              <p className="recommendation-reason">{book.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}