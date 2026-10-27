import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Building2, Briefcase } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { Project } from '../types';

export const CommercialPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getProjects('Commercial').then(setProjects).catch(console.error);
  }, []);

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-20 md:pt-44 md:pb-28 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 border-b border-beige/60">
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block mb-4">
          Workplace & Commercial Environments
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-charcoal max-w-4xl leading-tight">
          Commercial Environments That Cultivate Focus, Collaboration, and Identity.
        </h1>
        <p className="mt-6 text-base sm:text-xl text-charcoal/70 max-w-2xl font-light leading-relaxed">
          Forward-thinking corporate headquarters, boutique client lounges, and multidisciplinary creative studios.
        </p>
      </section>

      {/* Narrative */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-3xl sm:text-5xl text-charcoal leading-tight">
              Merging Residential Tactility With Commercial Rigor
            </h2>
            <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed">
              Modern employees and discerning clients expect more than sterile corporate cubicles. We craft commercial environments infused with residential warmth—incorporating acoustic wool felt, warm timber wall paneling, and curated art pieces.
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-terracotta" />
                <span>Activity-based spatial layout & privacy acoustic zoning</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-terracotta" />
                <span>Executive conference suites and bespoke board tables</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-terracotta" />
                <span>High-durability commercial material specifications</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-terracotta" />
                <span>Branded reception and experiential client presentation areas</span>
              </div>
            </div>
            <div className="pt-4">
              <Link
                to="/contact?type=Commercial"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-terracotta text-white text-xs uppercase tracking-widest font-medium hover:bg-terracotta-dark transition-colors"
              >
                <span>Plan Your Workplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/5] bg-charcoal overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85"
                alt="Commercial Interior Design Architecture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Studies */}
      {projects.length > 0 && (
        <section className="py-20 bg-ivory-light border-t border-beige/60">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
            <h3 className="font-serif text-3xl sm:text-4xl text-charcoal mb-12">
              Commercial Concepts & Workplace Studies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((p) => (
                <Link
                  key={p.slug}
                  to={`/projects/${p.slug}`}
                  className="group bg-ivory border border-beige/60 overflow-hidden block"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-charcoal">
                    <img
                      src={p.featured_image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-olive font-medium">
                      {p.location || 'Concept Study'}
                    </span>
                    <h4 className="font-serif text-xl text-charcoal group-hover:text-terracotta transition-colors">
                      {p.title}
                    </h4>
                    <p className="text-xs text-charcoal/70 line-clamp-2 font-light">
                      {p.short_description}
                    </p>
                  </div>
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
