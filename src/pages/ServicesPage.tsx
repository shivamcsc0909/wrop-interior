import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { Service } from '../types';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getServices()
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Residential', 'Kitchen & Bath', 'Joinery', 'Commercial', 'Architecture', 'Curation'];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      {/* Header */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-24 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 border-b border-beige/60">
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block mb-4">
          Capabilities & Disciplines
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-charcoal max-w-4xl leading-tight">
          Comprehensive Interior Design & Spatial Architecture.
        </h1>
        <p className="mt-6 text-base sm:text-xl text-charcoal/70 max-w-2xl font-light leading-relaxed">
          From holistic architectural space planning and residential renovations to bespoke millwork design and commercial headquarters.
        </p>

        {/* Category Filters */}
        <div className="mt-12 flex flex-wrap gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 text-xs uppercase tracking-widest transition-all duration-200 border ${
                selectedCategory === cat
                  ? 'bg-charcoal text-ivory border-charcoal'
                  : 'bg-ivory border-beige/60 text-charcoal/70 hover:border-charcoal hover:text-charcoal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredServices.map((srv) => (
            <div
              key={srv.slug}
              className="bg-ivory border border-beige/60 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-terracotta/40 transition-all duration-300 group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
                <img
                  src={srv.featured_image}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-charcoal/80 backdrop-blur-sm text-beige text-[10px] uppercase tracking-widest px-2.5 py-1">
                  {srv.category}
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h2 className="font-serif text-2xl text-charcoal group-hover:text-terracotta transition-colors">
                    {srv.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
                    {srv.short_description}
                  </p>

                  {/* Feature preview */}
                  {srv.features && srv.features.length > 0 && (
                    <ul className="pt-3 space-y-1.5 border-t border-beige/40">
                      {srv.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="text-xs text-charcoal/70 flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-olive shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4 border-t border-beige/40 flex items-center justify-between text-xs tracking-widest uppercase">
                  <Link
                    to={`/services/${srv.slug}`}
                    className="font-semibold text-charcoal hover:text-terracotta flex items-center space-x-1.5"
                  >
                    <span>View Discipline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/contact"
                    className="text-olive hover:text-terracotta"
                  >
                    Inquire
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Banner */}
      <section className="py-20 bg-charcoal text-ivory-light">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl text-ivory">
            Need a Bespoke Combination of Services?
          </h2>
          <p className="text-sm sm:text-base text-beige/70 font-light max-w-xl mx-auto">
            Most commissions begin with space planning and transition into end-to-end bespoke interior architecture. Tell us about your project.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-terracotta text-white text-xs uppercase tracking-widest font-medium hover:bg-terracotta-dark transition-colors"
            >
              <span>Schedule Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
