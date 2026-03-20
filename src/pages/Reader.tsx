
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Maximize2, Settings, Bookmark, Loader2 } from 'lucide-react';
import api from '../lib/api';

export default function Reader() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col pt-0 pb-0 w-full h-screen h-[100svh]">
      
      {/* Reader Toolbar */}
      <div className="glass h-14 w-full border-b border-border flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Link to={`/item/${id}`} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="hidden sm:block">
            <h1 className="font-semibold text-sm line-clamp-1">{item?.title || 'Loading Resource...'}</h1>
            <p className="text-xs text-muted-foreground">{item?.author || 'Standardized Curriculum'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground" title="Bookmark">
            <Bookmark className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground" title="Display Settings">
            <Settings className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hidden sm:block" title="Fullscreen">
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Content Area - PDF or Text */}
      <div className="flex-1 w-full bg-secondary/30 flex justify-center overflow-auto p-4 sm:p-8 relative">
        {/* Dummy PDF Container */}
        <div className="w-full max-w-4xl bg-white text-black min-h-screen shadow-2xl p-8 sm:p-16 rounded-sm">
          <h2 className="text-3xl font-serif font-bold mb-6">{item?.title}</h2>
          <p className="font-serif text-lg leading-relaxed mb-6 text-justify italic text-muted-foreground">
            This is a preview mode for the selected {item?.type || 'resource'}.
          </p>
          <p className="font-serif text-lg leading-relaxed mb-6 text-justify">
            Calculus is the mathematical study of continuous change, in the same way that geometry 
            is the study of shape, and algebra is the study of generalizations of arithmetic operations.
            The derivative of a function of a real variable measures the sensitivity to change of the 
            function value (output value) with respect to a change in its argument (input value).
          </p>
          <p className="font-serif text-lg leading-relaxed mb-6 text-justify">
            Derivatives are a fundamental tool of calculus. For example, the derivative of the 
            position of a moving object with respect to time is the object's velocity: this measures 
            how quickly the position of the object changes when time advances.
          </p>
          <div className="my-10 p-6 bg-slate-100 rounded-lg border-l-4 border-slate-400">
            <p className="font-mono text-center text-xl">
              f'(x) = lim (h→0) [f(x+h) - f(x)] / h
            </p>
          </div>
          <p className="font-serif text-lg leading-relaxed mb-6 text-justify">
            The process of finding a derivative is called differentiation. The reverse process 
            is called antidifferentiation. The fundamental theorem of calculus relates antidifferentiation 
            with integration. Differentiation and integration constitute the two fundamental operations in 
            single-variable calculus.
          </p>
        </div>
      </div>
      
    </div>
  );
}
