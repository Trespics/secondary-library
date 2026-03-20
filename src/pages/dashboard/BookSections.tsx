import { Heart, Bookmark, BookOpen, Star } from 'lucide-react';
import { useState } from 'react';

export default function BookSections() {
  const [activeSection, setActiveSection] = useState('reading');

  const sections = {
    reading: [
      { id: 1, title: "1984", author: "George Orwell", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400", progress: 45, bookmarked: false, favorite: false },
      { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400", progress: 30, bookmarked: true, favorite: false },
    ],
    read: [
      { id: 3, title: "The Alchemist", author: "Paulo Coelho", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400", completed: true, rating: 5 },
      { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400", completed: true, rating: 4 },
    ],
    wantToRead: [
      { id: 5, title: "Dune", author: "Frank Herbert", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400" },
      { id: 6, title: "The Midnight Library", author: "Matt Haig", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400" },
    ]
  };

  const tabs = [
    { id: 'reading', label: 'Currently Reading', icon: BookOpen },
    { id: 'read', label: 'Finished Reading', icon: Star },
    { id: 'wantToRead', label: 'Want to Read', icon: Heart },
  ];

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
        {sections[activeSection].map(book => (
          <div key={book.id} className="book-card">
            <div className="book-cover-wrapper">
              <img src={book.cover} alt={book.title} className="book-cover" />
              <div className="book-actions">
                <button className="action-btn" title="Add to favorites">
                  <Heart size={16} />
                </button>
                <button className="action-btn" title="Bookmark">
                  <Bookmark size={16} />
                </button>
              </div>
            </div>
            
            <div className="book-info">
              <h4 className="book-title">{book.title}</h4>
              <p className="book-author">{book.author}</p>
              
              {book.progress && (
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
        ))}
      </div>
    </section>
  );
}