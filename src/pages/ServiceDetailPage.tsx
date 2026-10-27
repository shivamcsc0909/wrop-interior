import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Phone, Mail } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { Service, Project } from '../types';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    api.getServiceBySlug(slug)
      .then((data) => {
        setService(data.service);
        setRelatedProjects(data.related_projects || []);
      })
      .catch(() => {
        navigate('/services');
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading || !service) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center">
        <div className="font-serif text-2xl text-charcoal/60 animate-pulse">Loading discipline...</div>
      </div>
    );
  }

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      {/* Hero Header */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-20 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 border-b border-beige/60">
        <Link
          to="/services"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-olive hover:text-terracotta mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Disciplines</span>
        </Link>
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block mb-3">
          {service.category} Discipline
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-charcoal max-w-4xl leading-tight">
          {service.title}
        </h1>
        <p className="mt-6 text-base sm:text-xl text-charcoal/70 max-w-2xl font-light leading-relaxed">
          {service.short_description}
        </p>
      </section>

      {/* Main Content & Image */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Full Description and Feature Breakdown (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">
                Detailed Scope of Practice
              </h2>
              <p className="text-base sm:text-lg text-charcoal/80 font-light leading-relaxed whitespace-pre-line">
                {service.full_description}
              </p>
            </div>

            {/* Scope Deliverables */}
            {service.features && service.features.length > 0 && (
              <div className="pt-6 border-t border-beige/60 space-y-4">
                <h3 className="font-serif text-2xl text-charcoal">Key Inclusions & Deliverables</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-ivory-light border border-beige/60 flex items-start space-x-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-charcoal/80 font-light">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inquire CTA box */}
            <div className="p-8 bg-[#EBE5D8] border border-beige/80 space-y-4 mt-8">
              <span className="text-[10px] uppercase tracking-widest text-olive font-semibold block">
                DIRECT INQUIRY
              </span>
              <h3 className="font-serif text-2xl text-charcoal">
                Discuss Your {service.title} Project
              </h3>
              <p className="text-xs sm:text-sm text-charcoal/70 font-light">
                Our design team reviews spatial floor plans, budget allocations, and material intentions during an initial consultation.
              </p>
              <div className="pt-2">
                <Link
                  to={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-terracotta text-white text-xs uppercase tracking-widest font-medium hover:bg-terracotta-dark transition-colors"
                >
                  <span>Inquire for {service.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Image & Project Showcase (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="aspect-[4/5] bg-charcoal overflow-hidden shadow-2xl">
              <img
                src={service.featured_image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Related Demonstration Projects */}
            {relatedProjects.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-beige/60">
                <h4 className="text-xs uppercase tracking-widest text-charcoal font-semibold">
                  Related Spatial Studies
                </h4>
                <div className="space-y-3">
                  {relatedProjects.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/projects/${p.slug}`}
                      className="p-3 bg-ivory-light border border-beige/60 flex items-center space-x-4 hover:border-terracotta transition-colors group block"
                    >
                      <div className="w-16 h-16 bg-charcoal shrink-0 overflow-hidden">
                        <img
                          src={p.featured_image}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="truncate">
                        <p className="font-serif text-lg text-charcoal group-hover:text-terracotta truncate">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-olive uppercase tracking-wider">
                          {p.category} • Concept Study
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
