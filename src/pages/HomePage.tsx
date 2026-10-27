import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Sparkles, 
  Maximize2, 
  Eye, 
  Sliders,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { FocalImage } from '../components/ui/FocalImage';
import { api } from '../services/api';
import { HomepageSection, Service, Project, JournalArticle } from '../types';

export const HomePage: React.FC = () => {
  const [sections, setSections] = useState<Record<string, HomepageSection>>({});
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [activeMaterial, setActiveMaterial] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadHomeData = async () => {
      try {
        const data = await api.getHomepage();
        if (data) {
          setSections(data.sections || {});
          setServices(data.featured_services || []);
          setProjects(data.featured_projects || []);
          setArticles(data.recent_articles || []);
        }
      } catch (err) {
        console.error('Failed to load homepage data from API:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const heroSec = sections['hero'];
  const heroSettings = heroSec?.settings || {
    desktop_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85',
    mobile_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1080&q=85',
    focal_point_x: 50,
    focal_point_y: 50,
    cta_primary_text: 'EXPLORE OUR PROJECTS',
    cta_primary_url: '/projects',
    cta_secondary_text: "LET'S DISCUSS YOUR SPACE",
    cta_secondary_url: '/contact',
  };

  const materials = [
    {
      title: 'Honed Roman Travertine',
      category: 'Natural Stone',
      image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=85',
      description: 'Porous limestone with natural earth cavities, honed to a velvety matte finish that softly absorbs room lighting.'
    },
    {
      title: 'Oiled American White Oak',
      category: 'Architectural Timber',
      image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1000&q=85',
      description: 'Slow-grown architectural hardwood with straight open grains, treated with natural organic plant waxes.'
    },
    {
      title: 'Belgian Washed Linen',
      category: 'Textiles & Drapery',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85',
      description: 'Heavyweight organic flax woven in Western Europe, lending relaxed structure and acoustic dampening to high-ceiling volumes.'
    },
    {
      title: 'Patinated Unlacquered Brass',
      category: 'Metal Finishes',
      image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=85',
      description: 'Hand-finished solid alloy that responds naturally to oxygen and human touch, developing organic richness over decades.'
    }
  ];

  const processSteps = [
    { number: '01', title: 'Discovery & Consultation', desc: 'We begin with an in-depth conversation exploring your lifestyle, functional aspirations, spatial requirements, and design sensibilities.' },
    { number: '02', title: 'Space Assessment', desc: 'Thorough dimensional survey, structural review, daylight orientation mapping, and architectural sightline evaluation.' },
    { number: '03', title: 'Concept & Design Direction', desc: 'Development of moodboards, volumetric sketches, spatial zoning, and primary materiality palettes.' },
    { number: '04', title: 'Material & Finish Selection', desc: 'Curating physical samples of stones, timber veneers, textiles, architectural brass, and custom millwork finishes.' },
    { number: '05', title: 'Design Approval & Detailing', desc: 'Comprehensive technical drawings, 3D spatial visualizations, lighting schedules, and bespoke joinery plans.' },
    { number: '06', title: 'Execution Coordination', desc: 'Artisan alignment, contractor collaboration, procurement coordination, and strict material quality inspections.' },
    { number: '07', title: 'Final Review & Handover', desc: 'Careful styling, spatial staging, lighting calibration, and the transition of your bespoke finished interior.' }
  ];

  return (
    <div className="bg-ivory text-charcoal min-h-screen selection:bg-terracotta selection:text-white">
      {/* 2. Transparent Header over Hero */}
      <Header isHeroOverlay={true} />

      {/* 3. Cinematic Full-Viewport Hero (100svh) */}
      <section className="relative w-full h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Full-bleed Architectural Photograph with Focal Point */}
        <div className="absolute inset-0 z-0">
          <FocalImage
            desktopSrc={heroSettings.desktop_image || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85'}
            mobileSrc={heroSettings.mobile_image}
            focalPointX={heroSettings.focal_point_x ?? 50}
            focalPointY={heroSettings.focal_point_y ?? 50}
            alt="WROP Interior — Architectural Living Space"
            priority={true}
          />
          {/* Subtle cinematic gradient overlays for high-contrast typography readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-charcoal/40" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center text-white mt-16 md:mt-24 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-white/20 bg-charcoal/30 backdrop-blur-sm text-[11px] uppercase tracking-widest text-beige">
            <Sparkles className="w-3.5 h-3.5 text-beige" />
            <span>Architecture & Space Transformation</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight font-medium text-white max-w-4xl mx-auto leading-[1.08] text-balance">
            {heroSec?.title || 'Spaces That Feel Like You.'}
          </h1>

          <p className="font-sans text-base sm:text-lg md:text-xl text-beige/90 max-w-2xl mx-auto font-light leading-relaxed text-balance">
            {heroSec?.subtitle || 'Thoughtfully designed interiors that bring together functionality, aesthetics, and the way you live.'}
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-medium tracking-widest uppercase">
            <Link
              to={heroSettings.cta_primary_url || '/projects'}
              className="w-full sm:w-auto px-8 py-4 bg-ivory text-charcoal hover:bg-terracotta hover:text-white transition-all duration-300 rounded-none shadow-lg text-center"
            >
              {heroSettings.cta_primary_text || 'EXPLORE OUR PROJECTS'}
            </Link>
            <Link
              to={heroSettings.cta_secondary_url || '/contact'}
              className="w-full sm:w-auto px-8 py-4 border border-white/40 text-white hover:border-white hover:bg-white/10 transition-all duration-300 rounded-none text-center"
            >
              {heroSettings.cta_secondary_text || "LET'S DISCUSS YOUR SPACE"}
            </Link>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <a
          href="#brand-intro"
          aria-label="Scroll to content"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center space-y-2 text-white/60 hover:text-white transition-colors duration-300"
        >
          <span className="text-[10px] tracking-widest uppercase font-medium">SCROLL</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </section>

      {/* 4. Section A — Brand Introduction */}
      <section id="brand-intro" className="py-24 md:py-32 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Large Architectural Image */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] overflow-hidden bg-beige/20 shadow-xl relative">
              <img
                src={sections['brand_intro']?.settings?.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85'}
                alt="WROP Interior Design Architecture"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden sm:block bg-charcoal text-ivory p-6 max-w-xs shadow-2xl">
              <p className="text-[10px] uppercase tracking-widest text-beige mb-1">CRAFT & PROPORTION</p>
              <p className="text-xs font-light text-ivory/80 leading-relaxed">
                Interiors conceived as enduring architectural sanctuaries, avoiding fleeting trend cycles.
              </p>
            </div>
          </div>

          {/* Short Introduction & Editorial Copy */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block">
                Brand Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-charcoal leading-tight">
                {sections['brand_intro']?.title || 'Design That Goes Beyond the Surface.'}
              </h2>
            </div>

            <p className="text-base sm:text-lg text-charcoal/80 font-light leading-relaxed">
              {sections['brand_intro']?.subtitle || 'At WROP Interior, every space begins with an idea. We bring together thoughtful planning, carefully considered materials, and a distinctive design approach to create spaces that feel personal and purposeful.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-beige/60">
              <div className="space-y-2">
                <span className="font-serif text-2xl text-terracotta block">Bespoke Living</span>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  Every joinery profile, lighting layer, and textile is calibrated to your daily movement.
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-serif text-2xl text-terracotta block">Tactile Authenticity</span>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  Real unvarnished stones, brushed brass, and natural woods that age with grace.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center space-x-3 text-xs uppercase tracking-widest font-semibold text-charcoal hover:text-terracotta transition-colors group"
              >
                <span>Read more about our approach</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section B — Our Services */}
      <section className="py-24 bg-ivory-light border-y border-beige/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block">
                Disciplines & Capabilities
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-charcoal">
                Curated Interior Solutions
              </h2>
              <p className="text-sm sm:text-base text-charcoal/70 font-light leading-relaxed">
                Comprehensive interior services tailored to residential residences and commercial workplaces.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-charcoal hover:text-terracotta transition-colors font-medium"
            >
              <span>Explore All Disciplines</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <div
                key={srv.slug}
                className="group bg-ivory border border-beige/60 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-terracotta/40 transition-all duration-300"
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
                    <h3 className="font-serif text-2xl text-charcoal group-hover:text-terracotta transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed line-clamp-3">
                      {srv.short_description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-beige/40 flex items-center justify-between text-xs tracking-widest uppercase">
                    <Link
                      to={`/services/${srv.slug}`}
                      className="font-semibold text-charcoal hover:text-terracotta flex items-center space-x-1.5"
                    >
                      <span>View Details</span>
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
        </div>
      </section>

      {/* 4. Section C — Featured Projects (Editorial Asymmetrical Grid) */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block">
              Portfolio Studies
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-charcoal">
              Selected Spatial Concepts
            </h2>
            <p className="text-sm sm:text-base text-charcoal/70 font-light leading-relaxed">
              An editorial gallery of interior transformations. Demonstration concepts are clearly marked for development transparency.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-charcoal hover:text-terracotta transition-colors font-medium"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetrical Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {projects.map((project, idx) => {
            const isLarge = idx % 3 === 0;
            return (
              <div
                key={project.slug}
                className={`${
                  isLarge ? 'md:col-span-12 lg:col-span-8' : 'md:col-span-6 lg:col-span-4'
                } group flex flex-col justify-between`}
              >
                <Link to={`/projects/${project.slug}`} className="block overflow-hidden relative">
                  <div
                    className={`${
                      isLarge ? 'aspect-[16/10]' : 'aspect-[4/5]'
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

                  {/* Demo indicator tag */}
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
                  <h3 className="font-serif text-2xl sm:text-3xl text-charcoal group-hover:text-terracotta transition-colors">
                    <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
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

      {/* 4. Section D — Design Philosophy */}
      <section className="py-24 bg-charcoal text-ivory-light">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-8">
              <span className="text-xs uppercase tracking-ultra text-beige font-medium block">
                Design Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-ivory leading-tight">
                Every Detail Has a Purpose.
              </h2>
              <p className="text-base sm:text-lg text-beige/80 font-light leading-relaxed">
                We believe exceptional interiors are never accidental. They are shaped by the rigorous interplay of natural daylight, honest materiality, spatial circulation, and enduring proportion.
              </p>

              {/* Philosophy Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10 text-xs">
                <div className="space-y-1.5">
                  <span className="text-sm font-serif text-beige uppercase tracking-wider block">
                    01 / Spatial Flow
                  </span>
                  <p className="text-ivory/60 font-light">
                    Circulation paths mapped to eliminate dead space and maximize natural illumination.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm font-serif text-beige uppercase tracking-wider block">
                    02 / Tactile Harmony
                  </span>
                  <p className="text-ivory/60 font-light">
                    Contrasting honed stone surfaces with warm timbers and acoustic textiles.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm font-serif text-beige uppercase tracking-wider block">
                    03 / Layered Lighting
                  </span>
                  <p className="text-ivory/60 font-light">
                    Circadian warm glows, concealed coves, and architectural shadows.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm font-serif text-beige uppercase tracking-wider block">
                    04 / Enduring Craft
                  </span>
                  <p className="text-ivory/60 font-light">
                    European precision joinery engineered for timeless longevity.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/process"
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-terracotta-light hover:text-white font-medium group"
                >
                  <span>Discover our methodology</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/5] bg-charcoal-light overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85"
                  alt="Architectural Material Balance"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section E — Our Design Process (Visual Timeline) */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block">
            Methodology & Pathway
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-charcoal">
            Our Design Process
          </h2>
          <p className="text-sm sm:text-base text-charcoal/70 font-light leading-relaxed">
            A structured, transparent pathway ensuring each creative and technical stage is executed with precision.
          </p>
        </div>

        {/* Visual Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="bg-ivory-light border border-beige/60 p-8 flex flex-col justify-between space-y-6 relative hover:border-terracotta transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl text-terracotta font-medium">
                  {step.number}
                </span>
                <span className="text-[10px] tracking-widest uppercase text-olive font-medium">
                  Stage
                </span>
              </div>
              <div className="space-y-2.5">
                <h3 className="font-serif text-2xl text-charcoal">{step.title}</h3>
                <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Section F — Materials and Inspiration Gallery */}
      <section className="py-24 bg-[#EBE5D8] border-y border-beige/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block">
                Tactile Materiality
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-charcoal">
                Materials & Inspiration
              </h2>
              <p className="text-sm sm:text-base text-charcoal/70 font-light leading-relaxed">
                We believe true luxury is sensory. Explore the enduring textures and organic finishes that anchor our projects.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Active Material Showcase (7 cols) */}
            <div className="lg:col-span-7">
              <div className="aspect-[16/10] overflow-hidden bg-charcoal shadow-2xl relative">
                <img
                  src={materials[activeMaterial].image}
                  alt={materials[activeMaterial].title}
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-ivory">
                  <span className="text-[10px] uppercase tracking-widest text-beige block mb-1">
                    {materials[activeMaterial].category}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white">
                    {materials[activeMaterial].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-beige/90 mt-2 font-light max-w-lg">
                    {materials[activeMaterial].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Material Selector Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {materials.map((mat, i) => (
                <button
                  key={mat.title}
                  onClick={() => setActiveMaterial(i)}
                  className={`w-full text-left p-5 transition-all duration-300 border flex items-center justify-between ${
                    activeMaterial === i
                      ? 'bg-ivory border-terracotta shadow-md translate-x-2'
                      : 'bg-ivory/60 border-beige/60 hover:bg-ivory hover:border-beige'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-widest uppercase text-olive font-medium block">
                      {mat.category}
                    </span>
                    <span className="font-serif text-lg text-charcoal block">
                      {mat.title}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform ${
                      activeMaterial === i ? 'text-terracotta translate-x-1' : 'text-charcoal/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section G — Testimonials (Clearly labeled demo reflections) */}
      <section className="py-24 max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-10">
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block">
          Client Reflections
        </span>
        <div className="space-y-6">
          <blockquote className="font-serif text-2xl sm:text-4xl text-charcoal italic leading-relaxed max-w-3xl mx-auto">
            “WROP Interior transformed not only our floor plan, but how our family lives every single day. The natural light, the travertine textures, and the custom joinery feel like they have always belonged here.”
          </blockquote>
          <div className="space-y-1">
            <cite className="font-medium text-sm text-charcoal not-italic block">
              Private Residential Client
            </cite>
            <span className="text-xs text-charcoal/50 uppercase tracking-widest block">
              Penthouse Spatial Transformation (Demonstration Testimonial)
            </span>
          </div>
        </div>
      </section>

      {/* 4. Section H — Final Immersive CTA */}
      <section className="relative py-28 md:py-36 bg-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85"
            alt="Interior Transformation Consultation"
            className="w-full h-full object-cover opacity-25"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-charcoal/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-8">
          <span className="text-xs uppercase tracking-ultra text-beige font-medium block">
            Begin Your Spatial Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-ivory leading-tight">
            {sections['final_cta']?.title || "Let's Create a Space That Feels Right."}
          </h2>
          <p className="text-base sm:text-lg text-beige/80 max-w-2xl mx-auto font-light leading-relaxed">
            {sections['final_cta']?.subtitle || "Tell us about your vision, and let's explore the possibilities."}
          </p>
          <div className="pt-4">
            <Link
              to="/contact"
              className="inline-block px-10 py-5 bg-terracotta text-white font-medium text-xs uppercase tracking-widest hover:bg-terracotta-dark transition-all duration-300 shadow-xl"
            >
              START YOUR PROJECT
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Section I — Footer */}
      <Footer />
    </div>
  );
};
