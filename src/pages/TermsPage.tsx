import React, { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      <section className="pt-36 pb-16 md:pt-44 md:pb-20 max-w-4xl mx-auto px-6 sm:px-8 border-b border-beige/60">
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block mb-3">
          Legal & Conditions
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-charcoal leading-tight">
          Terms & Conditions
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-charcoal/60">
          Last Updated: 2026 • WROP Interior
        </p>
      </section>

      <article className="max-w-4xl mx-auto px-6 sm:px-8 py-16 text-sm text-charcoal/80 font-light leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal">1. Intellectual Property & Concept Studies</h2>
          <p>
            All conceptual project renderings, architectural drawings, photography compositions, and editorial texts published on this website are protected under applicable copyright and intellectual property laws. Demonstration projects displayed during development represent creative studies and should not be construed as unverified real estate claims.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal">2. Professional Engagement</h2>
          <p>
            Submitting a consultation enquiry through this website does not constitute a binding architectural agreement. Formal design engagements commence upon mutually executed letters of agreement detailing specific deliverables, fees, and timelines.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal">3. Website Use & Availability</h2>
          <p>
            WROP Interior strives to maintain continuous, error-free platform access. However, scheduled maintenance, system optimizations, and network variations may occasionally result in temporary unavailability.
          </p>
        </section>
      </article>

      <Footer />
    </div>
  );
};
