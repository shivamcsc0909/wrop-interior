import React, { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      <section className="pt-36 pb-16 md:pt-44 md:pb-20 max-w-4xl mx-auto px-6 sm:px-8 border-b border-beige/60">
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block mb-3">
          Legal & Compliance
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-charcoal leading-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-charcoal/60">
          Effective Date: January 1, 2026 • WROP Interior
        </p>
      </section>

      <article className="max-w-4xl mx-auto px-6 sm:px-8 py-16 text-sm text-charcoal/80 font-light leading-relaxed space-y-8">
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal">1. Information We Collect</h2>
          <p>
            When you interact with WROP Interior through our website, we may collect personal details you voluntarily provide through our consultation enquiry form, including your name, email address, telephone number, property type, estimated project budget, and spatial parameters.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal">2. Purpose of Processing</h2>
          <p>
            We process your information exclusively to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Evaluate and respond to your interior design and space planning consultation enquiries.</li>
            <li>Coordinate site visits, architectural surveys, and design presentations.</li>
            <li>Maintain internal administrative records and project correspondence.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal">3. Data Security & Storage</h2>
          <p>
            Submissions are stored securely in our database utilizing PDO parameterized queries and encrypted communication protocols. We never monetize, sell, or disclose your personal details to third-party commercial marketers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal">4. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of any stored contact data by writing to our studio at hello@wropinterior.com.
          </p>
        </section>
      </article>

      <Footer />
    </div>
  );
};
