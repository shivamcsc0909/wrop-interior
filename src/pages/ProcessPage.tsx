import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const ProcessPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stages = [
    {
      num: '01',
      title: 'Discovery & Consultation',
      summary: 'Establishing the spatial vision, lifestyle rhythms, and project parameters.',
      details: [
        'Detailed client lifestyle and spatial interview',
        'Functional requirements and storage analysis',
        'Preliminary budget allocation and timeline milestones',
        'Aesthetic orientation and stylistic alignment'
      ]
    },
    {
      num: '02',
      title: 'Space Assessment & Survey',
      summary: 'Rigorous architectural measurement and environmental site review.',
      details: [
        'Complete precision dimensional survey and laser scanning',
        'Structural load-bearing sightline evaluations',
        'Natural daylight transit and acoustic resonance mapping',
        'Existing MEP (mechanical, electrical, plumbing) inspection'
      ]
    },
    {
      num: '03',
      title: 'Concept & Spatial Zoning',
      summary: 'Translating needs into spatial volumes, circulation flow, and primary aesthetics.',
      details: [
        '2D architectural circulation floor plans',
        'Volumetric spatial studies and partition layouts',
        'Curated digital moodboards and atmosphere studies',
        'Primary material balance and color palettes'
      ]
    },
    {
      num: '04',
      title: 'Material & Finish Curation',
      summary: 'Physical sample tactile boards connecting authentic stones, woods, and textiles.',
      details: [
        'Physical sample boards (travertine, marble, timber, metal)',
        'Bespoke joinery veneers and architectural hardware selection',
        'Acoustic felt, linen drapery, and upholstered wall finishes',
        'Sustainable, VOC-free finish verification'
      ]
    },
    {
      num: '05',
      title: 'Technical Detailing & Design Approval',
      summary: 'Production-ready technical blueprints, 3D renderings, and contractor schedules.',
      details: [
        'Detailed 3D photorealistic spatial visualizations',
        'Complete millwork shop drawings and joinery elevations',
        'Comprehensive architectural lighting and switching schedules',
        'Itemized specification and procurement schedule'
      ]
    },
    {
      num: '06',
      title: 'Execution & Quality Coordination',
      summary: 'Site alignment, master artisan oversight, and material verification.',
      details: [
        'Coordination with certified general contractors and trades',
        'Regular site inspections and tolerance checks',
        'Direct supervision of bespoke joinery installation',
        'Strict adherence to architectural design fidelity'
      ]
    },
    {
      num: '07',
      title: 'Final Styling & Project Handover',
      summary: 'The culmination of the creative journey into a finished sanctuary.',
      details: [
        'Placement and styling of artisan furnishings and decor',
        'Calibrated tuning of lighting scenes and circadian dimmers',
        'Comprehensive handover dossier with material care instructions',
        'Celebratory spatial walkthrough with the client'
      ]
    }
  ];

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-20 md:pt-44 md:pb-28 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 border-b border-beige/60">
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block mb-4">
          Structured Creative Methodology
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-charcoal max-w-4xl leading-tight">
          A Transparent, Seven-Stage Pathway From Concept to Completion.
        </h1>
        <p className="mt-6 text-base sm:text-xl text-charcoal/70 max-w-2xl font-light leading-relaxed">
          Exceptional interiors require artistic vision paired with disciplined execution. Here is how we guide each spatial commission.
        </p>
      </section>

      {/* Stages Timeline */}
      <section className="py-20 md:py-28 max-w-5xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="space-y-12 md:space-y-16">
          {stages.map((stage) => (
            <div
              key={stage.num}
              className="p-8 md:p-12 bg-ivory-light border border-beige/60 hover:border-terracotta transition-colors duration-300 relative group"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6 pb-6 border-b border-beige/40">
                <div className="flex items-baseline space-x-4">
                  <span className="font-serif text-4xl sm:text-5xl text-terracotta font-semibold">
                    {stage.num}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-charcoal">
                    {stage.title}
                  </h2>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-olive font-medium">
                  Stage {stage.num} of 07
                </span>
              </div>

              <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed mb-6">
                {stage.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal/70">
                {stage.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-charcoal text-ivory-light text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl text-ivory">
            Ready to Begin Stage 01?
          </h2>
          <p className="text-sm sm:text-base text-beige/70 font-light">
            Contact our design studio to schedule your initial spatial discovery consultation.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-terracotta text-white text-xs uppercase tracking-widest font-medium hover:bg-terracotta-dark transition-colors"
            >
              <span>Schedule Discovery Session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
