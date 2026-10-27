import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Layers, Compass, Check, Image as ImageIcon } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { Project } from '../types';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [related, setRelated] = useState<Project[]>([]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    api.getProjectBySlug(slug)
      .then((data) => {
        setProject(data.project);
        setRelated(data.related || []);
      })
      .catch(() => {
        navigate('/projects');
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading || !project) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center">
        <div className="font-serif text-2xl text-charcoal/60 animate-pulse">Loading case study...</div>
      </div>
    );
  }

  const allImages = [project.featured_image, ...(project.gallery || [])];

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      {/* Hero Header */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-20 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 border-b border-beige/60">
        <Link
          to="/projects"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-olive hover:text-terracotta mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center space-x-3 mb-3">
          <span className="text-xs uppercase tracking-ultra text-terracotta font-medium">
            {project.category}
          </span>
          <span className="text-xs text-charcoal/40">•</span>
          <span className="text-xs uppercase tracking-widest text-olive">
            {project.location || 'Concept Study'}
          </span>
          {project.is_demo === 1 && (
            <span className="text-[10px] bg-beige/60 text-charcoal/80 px-2 py-0.5 rounded font-mono uppercase">
              Demonstration Study
            </span>
          )}
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-charcoal max-w-4xl leading-tight">
          {project.title}
        </h1>
        <p className="mt-6 text-base sm:text-xl text-charcoal/70 max-w-3xl font-light leading-relaxed">
          {project.short_description}
        </p>
      </section>

      {/* Main Full-Width Gallery Viewport */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="aspect-[16/9] md:aspect-[21/9] bg-charcoal overflow-hidden shadow-2xl relative">
          <img
            src={allImages[activeGalleryIndex]}
            alt={`${project.title} - View ${activeGalleryIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-700"
          />
        </div>

        {/* Gallery Thumbnails */}
        {allImages.length > 1 && (
          <div className="mt-4 flex items-center space-x-3 overflow-x-auto pb-2">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveGalleryIndex(idx)}
                className={`relative w-24 h-16 sm:w-32 sm:h-20 shrink-0 overflow-hidden border-2 transition-all ${
                  activeGalleryIndex === idx
                    ? 'border-terracotta scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Editorial Content Breakdown */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 border-t border-beige/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">
                Architectural Intent & Narrative
              </h2>
              <p className="text-base sm:text-lg text-charcoal/80 font-light leading-relaxed whitespace-pre-line">
                {project.full_description}
              </p>
            </div>

            {project.concept && (
              <div className="p-6 bg-ivory-light border-l-2 border-terracotta space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-olive font-semibold block">
                  DESIGN CONCEPT
                </span>
                <p className="font-serif text-xl sm:text-2xl text-charcoal italic">
                  “{project.concept}”
                </p>
              </div>
            )}
          </div>

          {/* Project Specifications Sidebar (5 cols) */}
          <div className="lg:col-span-5 bg-ivory-light border border-beige/60 p-8 space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-ultra text-terracotta font-semibold mb-6 pb-3 border-b border-beige/60">
                Spatial Specifications
              </h3>
              <dl className="space-y-5 text-xs">
                <div>
                  <dt className="text-olive uppercase tracking-wider text-[10px] mb-1">Typology</dt>
                  <dd className="font-medium text-sm text-charcoal">{project.category} Space</dd>
                </div>
                <div>
                  <dt className="text-olive uppercase tracking-wider text-[10px] mb-1">Status</dt>
                  <dd className="font-medium text-sm text-charcoal">
                    {project.location || 'Architectural Exploration'}
                  </dd>
                </div>
                {project.materials_finishes && (
                  <div>
                    <dt className="text-olive uppercase tracking-wider text-[10px] mb-1">Primary Materiality</dt>
                    <dd className="font-light text-xs text-charcoal/80 leading-relaxed">
                      {project.materials_finishes}
                    </dd>
                  </div>
                )}
                {project.scope && (
                  <div>
                    <dt className="text-olive uppercase tracking-wider text-[10px] mb-1">Project Scope</dt>
                    <dd className="font-light text-xs text-charcoal/80 leading-relaxed">
                      {project.scope}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Inquire CTA */}
            <div className="pt-6 border-t border-beige/60 space-y-3">
              <h4 className="font-serif text-xl text-charcoal">Inspired by this project?</h4>
              <p className="text-xs text-charcoal/70 font-light">
                We can adapt this spatial language and material palette to your residence or workplace.
              </p>
              <div className="pt-2">
                <Link
                  to={`/contact?reference=${encodeURIComponent(project.title)}`}
                  className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-terracotta text-white text-xs uppercase tracking-widest font-medium hover:bg-terracotta-dark transition-colors"
                >
                  <span>Inquire for Similar Space</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {related.length > 0 && (
        <section className="py-20 bg-ivory-light border-t border-beige/60">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
            <h3 className="font-serif text-3xl text-charcoal mb-10">
              Related Spatial Studies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/projects/${rel.slug}`}
                  className="group block space-y-3"
                >
                  <div className="aspect-[4/3] bg-charcoal overflow-hidden">
                    <img
                      src={rel.featured_image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-olive font-medium">
                      {rel.category}
                    </span>
                    <h4 className="font-serif text-xl text-charcoal group-hover:text-terracotta transition-colors">
                      {rel.title}
                    </h4>
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
