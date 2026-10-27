import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Compass, Layers, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="pt-36 pb-20 md:pt-44 md:pb-28 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 border-b border-beige/60">
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block mb-4">
          Studio Philosophy & Practice
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-charcoal max-w-4xl leading-tight">
          Thoughtfully Designed Interiors Grounded in Architecture and Life.
        </h1>
        <p className="mt-6 text-base sm:text-xl text-charcoal/70 max-w-2xl font-light leading-relaxed">
          At WROP Interior, our discipline is centered on the understanding that physical spaces shape mental clarity, human connection, and daily ritual.
        </p>
      </section>

      {/* Studio Ethos Grid */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-ultra text-olive font-medium block">
              The WROP Approach
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-charcoal leading-tight">
              An Architectural Perspective on Living
            </h2>
            <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed">
              We reject the transient cycles of fleeting interior trends. Our approach views interior architecture as a cohesive continuation of structural form, natural daylight, and enduring natural materiality.
            </p>
            <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed">
              Every project is an intimate dialogue with the client. We evaluate sightlines, acoustics, tactile touchpoints, and how sunlight shifts through windows from dawn to twilight.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-charcoal/90">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-terracotta" />
                <span>Custom millwork & bespoke joinery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-terracotta" />
                <span>Honest unvarnished materials</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-terracotta" />
                <span>Acoustic comfort engineering</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-terracotta" />
                <span>Architectural lighting schemes</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/5] bg-beige/30 overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85"
                alt="WROP Interior Design Studio Architecture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship & Precision Banner */}
      <section className="py-24 bg-charcoal text-ivory-light">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-3">
            <Compass className="w-6 h-6 text-terracotta-light" />
            <h3 className="font-serif text-2xl text-ivory">Spatial Proportions</h3>
            <p className="text-xs sm:text-sm text-beige/70 font-light leading-relaxed">
              Balancing open spatial circulation with intimate functional enclosures, giving homes both grandeur and psychological warmth.
            </p>
          </div>
          <div className="space-y-3">
            <Layers className="w-6 h-6 text-terracotta-light" />
            <h3 className="font-serif text-2xl text-ivory">Sensory Textures</h3>
            <p className="text-xs sm:text-sm text-beige/70 font-light leading-relaxed">
              Selecting natural Roman travertines, brushed bronzes, open-pore timbers, and washed European linens that develop authentic patina.
            </p>
          </div>
          <div className="space-y-3">
            <Sparkles className="w-6 h-6 text-terracotta-light" />
            <h3 className="font-serif text-2xl text-ivory">Integrated Illumination</h3>
            <p className="text-xs sm:text-sm text-beige/70 font-light leading-relaxed">
              Concealed architectural LED coves and calibrated warm color temperatures that shift gracefully from productivity to evening rest.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 text-center max-w-3xl mx-auto px-6 space-y-6">
        <h2 className="font-serif text-3xl sm:text-5xl text-charcoal">
          Let’s Transform Your Environment.
        </h2>
        <p className="text-sm sm:text-base text-charcoal/70 font-light">
          We welcome residential commissions, commercial headquarters, and bespoke space planning inquiries.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-terracotta text-white text-xs uppercase tracking-widest font-medium hover:bg-terracotta-dark transition-colors"
          >
            <span>Inquire About A Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
