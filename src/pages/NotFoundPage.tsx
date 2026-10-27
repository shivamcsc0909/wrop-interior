import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-ivory text-charcoal min-h-screen flex flex-col justify-between">
      <Header />

      <main className="pt-44 pb-28 px-6 text-center max-w-xl mx-auto space-y-6">
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block">
          Error 404
        </span>
        <h1 className="font-serif text-5xl sm:text-7xl text-charcoal">
          Spatial Void
        </h1>
        <p className="text-sm sm:text-base text-charcoal/70 font-light leading-relaxed">
          The architectural route you are seeking does not exist or has been relocated to another corridor.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-charcoal text-white text-xs uppercase tracking-widest hover:bg-terracotta transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 border border-charcoal/30 text-charcoal text-xs uppercase tracking-widest hover:border-charcoal hover:bg-charcoal/5 transition-colors"
          >
            <span>Explore Portfolio</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
