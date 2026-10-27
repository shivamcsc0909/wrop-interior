import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { Project } from '../types';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Residential', 'Commercial'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      {/* Header */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-24 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 border-b border-beige/60">
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block mb-4">
          Selected Portfolio & Concepts
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-charcoal max-w-4xl leading-tight">
          Spatial Explorations & Architectural Interiors.
        </h1>
        <p className="mt-6 text-base sm:text-xl text-charcoal/70 max-w-2xl font-light leading-relaxed">
          An editorial collection of residential sanctuaries and commercial creative volumes. Demonstration studies are noted for transparency.
        </p>

        {/* Category Filters */}
        <div className="mt-12 flex flex-wrap gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 text-xs uppercase tracking-widest transition-all duration-200 border ${
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

      {/* Projects Grid */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          {filteredProjects.map((project, index) => {
            const isWide = index % 3 === 0;
            return (
              <div
                key={project.slug}
                className={`${
                  isWide ? 'md:col-span-12 lg:col-span-8' : 'md:col-span-6 lg:col-span-4'
                } group flex flex-col justify-between`}
              >
                <Link to={`/projects/${project.slug}`} className="block overflow-hidden relative">
                  <div
                    className={`${
                      isWide ? 'aspect-[16/10]' : 'aspect-[4/5]'
                    } overflow-hidden bg-beige/30 relative`}
                  >
                    <img
                      src={project.featured_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-300" />
                  </div>

                  {project.is_demo === 1 && (
                    <div className="absolute top-4 right-4 bg-charcoal/85 backdrop-blur-sm text-beige text-[10px] tracking-widest uppercase px-2.5 py-1 border border-white/10">
                      Concept Study
                    </div>
                  )}
                </Link>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center space-x-3 text-[11px] tracking-widest uppercase text-olive font-medium">
                    <span>{project.category}</span>
                    <span>•</span>
                    <span>{project.location || 'Concept Study'}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-charcoal group-hover:text-terracotta transition-colors">
                    <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed line-clamp-2">
                    {project.short_description}
                  </p>
                  <div className="pt-2">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-charcoal group-hover:text-terracotta font-semibold"
                    >
                      <span>Explore Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Notice Disclaimer */}
      <section className="py-12 bg-ivory-light border-t border-beige/60">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-charcoal/60 leading-relaxed space-y-2">
          <p className="font-medium text-charcoal/80 uppercase tracking-widest text-[11px]">
            Portfolio Transparency Note
          </p>
          <p>
            All projects showcased in this initial digital portfolio are curated concept studies and architectural explorations. Genuine client commissions will be added upon completion and verification.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};
