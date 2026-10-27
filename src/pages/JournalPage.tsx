import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { JournalArticle } from '../types';

export const JournalPage: React.FC = () => {
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getJournalArticles()
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      {/* Header */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-24 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 border-b border-beige/60">
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block mb-4">
          Inspiration & Spatial Theory
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-charcoal max-w-4xl leading-tight">
          The WROP Journal: Notes on Architecture, Light, and Craft.
        </h1>
        <p className="mt-6 text-base sm:text-xl text-charcoal/70 max-w-2xl font-light leading-relaxed">
          Essays and design observations on materiality, acoustics, circadian lighting, and the philosophy of meaningful spaces.
        </p>
      </section>

      {/* Articles Grid */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {articles.map((art) => (
            <article
              key={art.slug}
              className="group flex flex-col justify-between space-y-4"
            >
              <Link to={`/journal/${art.slug}`} className="block overflow-hidden aspect-[16/10] bg-charcoal">
                <img
                  src={art.featured_image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </Link>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-[11px] uppercase tracking-widest text-olive font-medium">
                  <span>{art.category}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{art.read_time}</span>
                  </span>
                </div>

                <h2 className="font-serif text-2xl text-charcoal group-hover:text-terracotta transition-colors">
                  <Link to={`/journal/${art.slug}`}>{art.title}</Link>
                </h2>

                <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to={`/journal/${art.slug}`}
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-charcoal font-semibold group-hover:text-terracotta"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};
