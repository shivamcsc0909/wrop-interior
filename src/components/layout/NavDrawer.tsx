import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ArrowRight, Phone, Mail, Instagram, Linkedin } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { settings } = useSettings();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape & Prevent Background Scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Residential Interiors', path: '/residential' },
    { label: 'Commercial Interiors', path: '/commercial' },
    { label: 'Design Process', path: '/process' },
    { label: 'Inspiration / Journal', path: '/journal' },
    { label: 'Contact Us', path: '/contact' },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Site Navigation"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[480px] md:w-[540px] bg-ivory text-charcoal shadow-2xl z-50 flex flex-col justify-between p-8 md:p-12 transform transition-transform duration-500 ease-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header inside drawer */}
        <div className="flex items-center justify-between border-b border-beige/60 pb-6">
          <Link
            to="/"
            onClick={onClose}
            className="font-serif text-2xl tracking-widest text-charcoal font-semibold uppercase hover:text-terracotta transition-colors"
          >
            {settings.site_name || 'WROP INTERIOR'}
          </Link>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 text-charcoal/70 hover:text-charcoal transition-colors focus:outline-none focus:ring-1 focus:ring-terracotta rounded"
            aria-label="Close navigation menu"
          >
            <X className="w-7 h-7 stroke-[1.5]" />
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="my-8 flex-1 flex flex-col justify-center space-y-4">
          {navLinks.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path} className="group overflow-hidden">
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between text-2xl sm:text-3xl font-serif tracking-wide py-1.5 transition-all duration-300 ${
                    isActive 
                      ? 'text-terracotta font-medium italic translate-x-2' 
                      : 'text-charcoal hover:text-terracotta hover:translate-x-2'
                  }`}
                >
                  <span className="flex items-baseline space-x-3">
                    <span className="text-xs font-sans text-olive/70 uppercase tracking-widest">
                      0{index + 1}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  <ArrowRight
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                    }`}
                  />
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Drawer Footer Information */}
        <div className="border-t border-beige/60 pt-6 space-y-4 text-xs font-sans text-charcoal/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <a
              href={`mailto:${settings.contact_email}`}
              className="flex items-center space-x-2 hover:text-terracotta transition-colors"
            >
              <Mail className="w-4 h-4 text-olive" />
              <span>{settings.contact_email || 'hello@wropinterior.com'}</span>
            </a>
            <a
              href={`tel:${settings.contact_phone}`}
              className="flex items-center space-x-2 hover:text-terracotta transition-colors"
            >
              <Phone className="w-4 h-4 text-olive" />
              <span>{settings.contact_phone || '+1 (555) 234-8900'}</span>
            </a>
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] tracking-widest text-charcoal/60 uppercase">
            <span>Spatial Architecture & Design</span>
            <div className="flex items-center space-x-3">
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
