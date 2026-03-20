import { BookOpen, TrendingUp } from 'lucide-react';

export default function ReadingProgress() {
  const currentBook = {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
    progress: 65,
    pagesRead: 120,
    totalPages: 185
  };

  return (
    <section className="reading-progress-section">
      <div className="section-header">
        <div className="header-left">
          <BookOpen className="section-icon" />
          <h2 className="section-title">Currently Reading</h2>
        </div>
        <button className="view-all-button">View All</button>
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
              <span>{currentBook.pagesRead} pages read</span>
              <span>{currentBook.totalPages - currentBook.pagesRead} pages left</span>
            </div>
          </div>
          
          <button className="continue-reading-btn">
            Continue Reading
            <TrendingUp className="btn-icon" />
          </button>
        </div>
      </div>
    </section>
  );
}