import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Phone, MapPin, Instagram, Linkedin } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  const services = [
    { label: 'Residential Interiors', path: '/services/residential-interiors' },
    { label: 'Living Room Design', path: '/services/living-room-design' },
    { label: 'Modular Kitchens', path: '/services/modular-kitchen-design' },
    { label: 'Bedroom Sanctuaries', path: '/services/bedroom-design' },
    { label: 'Wardrobe Suites', path: '/services/wardrobe-design' },
    { label: 'Commercial Spaces', path: '/services/commercial-interiors' },
  ];

  const quickLinks = [
    { label: 'About Our Studio', path: '/about' },
    { label: 'Design Methodology', path: '/process' },
    { label: 'Project Portfolio', path: '/projects' },
    { label: 'Journal & Insights', path: '/journal' },
    { label: 'Start a Consultation', path: '/contact' },
  ];

  return (
    <footer className="bg-charcoal text-ivory-light border-t border-charcoal-light pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl md:text-4xl tracking-widest font-semibold uppercase text-ivory">
                {settings.site_name || 'WROP INTERIOR'}
              </span>
              <span className="block text-[10px] tracking-ultra text-beige/70 uppercase mt-1">
                Spatial Architecture & Interior Design
              </span>
            </Link>
            <p className="text-sm font-light text-beige/80 max-w-sm leading-relaxed">
              Thoughtfully designed interiors that bring together functionality, aesthetics, and the way you live. Tailored residential and commercial spaces grounded in natural materiality.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-terracotta-light hover:text-white transition-colors group"
              >
                <span>Initiate a spatial inquiry</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Column: Services */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-beige mb-5">
              Disciplines
            </h4>
            <ul className="space-y-3 text-xs tracking-wider text-ivory/70">
              {services.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="hover:text-terracotta-light transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Studio */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-beige mb-5">
              Studio
            </h4>
            <ul className="space-y-3 text-xs tracking-wider text-ivory/70">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="hover:text-terracotta-light transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Contact & Hours */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-beige mb-5">
              Studio Inquiries
            </h4>
            <div className="space-y-3 text-xs text-ivory/70 leading-relaxed">
              <a
                href={`mailto:${settings.contact_email}`}
                className="flex items-center space-x-2.5 hover:text-terracotta-light transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-olive-light" />
                <span>{settings.contact_email || 'hello@wropinterior.com'}</span>
              </a>
              <a
                href={`tel:${settings.contact_phone}`}
                className="flex items-center space-x-2.5 hover:text-terracotta-light transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-olive-light" />
                <span>{settings.contact_phone || '+1 (555) 234-8900'}</span>
              </a>
              <div className="flex items-start space-x-2.5 pt-1 text-[11px] text-beige/60">
                <MapPin className="w-3.5 h-3.5 text-olive-light shrink-0 mt-0.5" />
                <span>By appointment consultation</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-3 flex items-center space-x-4 text-beige/70">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Demo Notice Banner */}
        <div className="py-4 my-6 px-4 bg-charcoal-light/40 border border-white/5 rounded text-[11px] text-beige/60 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>
            {settings.footer_note ||
              'Demonstration Portfolio: Project photographs displayed are curated design studies for spatial illustration. Real completed commissions will be published with explicit client consent.'}
          </span>
          <span className="text-[10px] tracking-widest uppercase text-olive-light shrink-0">
            Portfolio Demo
          </span>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-beige/50 pt-2 gap-4">
          <p>© {new Date().getFullYear()} WROP Interior. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
