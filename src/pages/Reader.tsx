import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Settings, Bookmark, Loader2 } from 'lucide-react';
import api from '../lib/api';
import '../styles/Reader.css';

export default function Reader() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/library/items/${id}`);
        setItem(response.data);
      } catch (err) {
        console.error('Error fetching reader item:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const bookMetadata = item?.library_books?.[0];
  const sections = item?.library_book_sections || [];
  const currentSection = sections[currentSectionIndex];
  const license = bookMetadata?.library_licenses;

  if (isLoading) {
    return (
      <div className="reader-loading">
        <Loader2 className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="reader-page">
      {/* Reader Toolbar */}
      <div className="reader-toolbar">
        <div className="toolbar-left">
          <Link to={`/item/${id}`} className="back-button">
            <ArrowLeft />
          </Link>
          <div className="item-info">
            <h1 className="item-title">{item?.title || 'Loading Resource...'}</h1>
            <p className="item-author">
              {item?.library_book_authors?.map((ba: any) => ba.library_authors.name).join(', ') || item?.author}
            </p>
          </div>
        </div>
        
        <div className="toolbar-right">
          {sections.length > 0 && (
            <div className="section-indicator">
              Section {currentSectionIndex + 1} of {sections.length}
            </div>
          )}
          <div className="toolbar-actions">
            <button className="icon-button" title="Bookmark">
              <Bookmark />
            </button>
            <button className="icon-button" title="Display Settings">
              <Settings />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="reader-content">
        <div className="content-wrapper">
          {currentSection ? (
            <>
              <h2 className="section-title">{currentSection.section_title}</h2>
              <div 
                className="section-body prose"
                dangerouslySetInnerHTML={{ __html: currentSection.content_body || '<p>No content available for this section.</p>' }}
              />
            </>
          ) : item?.file_url?.toLowerCase().endsWith('.pdf') ? (
            <div className="pdf-viewer">
              <iframe 
                src={`${item.file_url}#toolbar=1`} 
                className="pdf-iframe"
                title={item.title}
              />
            </div>
          ) : (
            <div className="content-placeholder">
              <h2 className="placeholder-title">{item?.title}</h2>
              <p className="placeholder-description">
                This item is available for reading.
              </p>
              <div className="placeholder-box">
                <p className="placeholder-text">Content placeholder for non-sectioned book.</p>
                {item?.file_url && (
                  <a 
                    href={item.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="open-source-button"
                  >
                    Open Source File
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Persistent Section Navigation */}
        {sections.length > 0 && (
          <div className="section-navigation">
            <button 
              disabled={currentSectionIndex === 0}
              onClick={() => setCurrentSectionIndex(i => i - 1)}
              className="nav-button"
            >
              Previous
            </button>
            <span className="nav-counter">
              {currentSectionIndex + 1} / {sections.length}
            </span>
            <button 
              disabled={currentSectionIndex === sections.length - 1}
              onClick={() => setCurrentSectionIndex(i => i + 1)}
              className="nav-button nav-button-primary"
            >
              Next Section
            </button>
          </div>
        )}
      </div>

      {/* Persistent Attribution Footer */}
      {(bookMetadata?.book_type === 'oer' || license?.attribution_required) && (
        <div className="attribution-footer">
          <div className="attribution-info">
            <span>{item?.title}</span>
            
            <span className="attribution-separator">|</span>
            <span>By {item?.library_book_authors?.map((ba: any) => ba.library_authors.name).join(', ') || item?.author}</span>
            <span className="attribution-separator">|</span>
            <span className="attribution-license">{license?.name || 'Standard License'}</span>
          </div>
          
          <div className="attribution-link">
            {bookMetadata?.book_type === 'oer' ? (
              <>
                <span>Access for free at: </span>
                <a href={currentSection?.section_url || bookMetadata?.source_url} target="_blank" rel="noopener noreferrer">
                  {currentSection?.section_url || bookMetadata?.source_url}
                </a>
              </>
            ) : (
              <span className="attribution-text">{license?.attribution_text || 'Proper attribution required.'}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}