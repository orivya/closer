import React from 'react';
import { ViewState } from '../types';
import { Home, ArrowLeft, Compass, BookOpen, Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NotFoundProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onChangeView }) => {
  const { user } = useAuth();

  const handleGoHome = () => {
    if (user) {
      onChangeView(ViewState.HOME);
    } else {
      // For non-logged-in users, go to landing page
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white flex flex-col items-center justify-center px-6 py-12">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sage-subtle rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-lavender-subtle rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-sage-subtle rounded-full flex items-center justify-center">
            <Leaf className="w-12 h-12 text-sage" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl text-text-primary mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-text-secondary text-lg mb-8 leading-relaxed">
          It seems you've wandered off the path. The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Primary CTA */}
        <button
          onClick={handleGoHome}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-full font-medium shadow-lg hover:bg-sage-dark transition-all mb-8"
        >
          <Home className="w-5 h-5" />
          Return Home
        </button>

        {/* Quick links */}
        <div className="border-t border-stone-200 pt-8">
          <p className="text-text-muted text-sm mb-4">Or explore these pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onChangeView(ViewState.JOURNAL)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-sm text-text-secondary hover:border-sage/30 hover:text-text-primary transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Journal
            </button>
            <button
              onClick={() => onChangeView(ViewState.EXPLORE)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-sm text-text-secondary hover:border-sage/30 hover:text-text-primary transition-all"
            >
              <Compass className="w-4 h-4" />
              Explore
            </button>
            <button
              onClick={() => onChangeView(ViewState.BLOG)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-sm text-text-secondary hover:border-sage/30 hover:text-text-primary transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

