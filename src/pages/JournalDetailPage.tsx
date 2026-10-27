import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, Bookmark } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { JournalArticle } from '../types';

export const JournalDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<JournalArticle | null>(null);
  const [related, setRelated] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    api.getJournalArticleBySlug(slug)
      .then((data) => {
        setArticle(data.article);
        setRelated(data.related || []);
      })
      .catch(() => {
        navigate('/journal');
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading || !article) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center">
        <div className="font-serif text-2xl text-charcoal/60 animate-pulse">Loading article...</div>
      </div>
    );
  }

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      {/* Header */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-20 max-w-4xl mx-auto px-6 sm:px-8">
        <Link
          to="/journal"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-olive hover:text-terracotta mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        <div className="flex items-center space-x-3 text-xs uppercase tracking-widest text-olive font-medium mb-4">
          <span>{article.category}</span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.read_time}</span>
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl text-charcoal leading-tight">
          {article.title}
        </h1>

        <p className="mt-6 text-base sm:text-xl text-charcoal/70 font-light leading-relaxed italic">
          “{article.excerpt}”
        </p>
      </section>

      {/* Hero Image */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 mb-16">
        <div className="aspect-[16/9] bg-charcoal overflow-hidden shadow-2xl">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-6 sm:px-8 pb-24 text-base sm:text-lg text-charcoal/80 font-light leading-relaxed space-y-6">
        {article.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </article>

      {/* Related Reading */}
      {related.length > 0 && (
        <section className="py-20 bg-ivory-light border-t border-beige/60">
          <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <h3 className="font-serif text-3xl text-charcoal mb-10">
              Further Reading
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/journal/${rel.slug}`}
                  className="group block space-y-3"
                >
                  <div className="aspect-[16/10] bg-charcoal overflow-hidden">
                    <img
                      src={rel.featured_image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-olive font-medium">
                    {rel.category} • {rel.read_time}
                  </span>
                  <h4 className="font-serif text-2xl text-charcoal group-hover:text-terracotta transition-colors">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};
