import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Home, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { Project, Service } from '../types';

export const ResidentialPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getProjects('Residential').then(setProjects).catch(console.error);
    api.getServices().then(res => {
      setServices(res.filter(s => s.category === 'Residential' || s.category === 'Kitchen & Bath' || s.category === 'Joinery'));
    }).catch(console.error);
  }, []);

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-20 md:pt-44 md:pb-28 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 border-b border-beige/60">
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block mb-4">
          Private Residential Living
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-charcoal max-w-4xl leading-tight">
          Private Sanctuaries Tailored to the Rhythm of Your Life.
        </h1>
        <p className="mt-6 text-base sm:text-xl text-charcoal/70 max-w-2xl font-light leading-relaxed">
          Comprehensive interior architecture for penthouses, family estates, and luxury apartments centered on calm, proportion, and bespoke craftsmanship.
        </p>
      </section>

      {/* Editorial Overview */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-3xl sm:text-5xl text-charcoal leading-tight">
              Homes That Decompress the Mind
            </h2>
            <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed">
              True residential luxury is not loud or ornate; it is the feeling of entering your home and immediately exhaling. We calibrate lighting to circadian rhythms, conceal modern technology behind fluted panels, and select stones that feel warm underfoot.
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-terracotta" />
                <span>End-to-end spatial replanning and structural zoning</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-terracotta" />
                <span>Custom European kitchen systems and integrated concealed pantries</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-terracotta" />
                <span>Walk-in wardrobe dressing suites with custom lighting</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-terracotta" />
                <span>Acoustic fabric panels and calm master bedrooms</span>
              </div>
            </div>
            <div className="pt-4">
              <Link
                to="/contact?type=Residential"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-terracotta text-white text-xs uppercase tracking-widest font-medium hover:bg-terracotta-dark transition-colors"
              >
                <span>Plan Your Residence</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/5] bg-charcoal overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
                alt="Residential Sanctuary Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Residential Projects */}
      {projects.length > 0 && (
        <section className="py-20 bg-ivory-light border-t border-beige/60">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block">
                  Demonstration Portfolio
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-charcoal">
                  Residential Design Studies
                </h3>
              </div>
              <Link to="/projects" className="text-xs uppercase tracking-widest text-charcoal hover:text-terracotta flex items-center space-x-1">
                <span>View Full Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

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
