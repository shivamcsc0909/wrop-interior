import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { NavDrawer } from './NavDrawer';
import { useSettings } from '../../context/SettingsContext';

interface HeaderProps {
  isHeroOverlay?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isHeroOverlay = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { settings } = useSettings();
  const location = useLocation();

  // Scroll listener to toggle header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine whether header text should be light or dark
  // On homepage before scroll, hero is dark image so text is light (#FAF9F6).
  // When scrolled or on light pages, text is charcoal.
  const isLightText = isHeroOverlay && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
          isScrolled
            ? 'bg-ivory/95 backdrop-blur-md border-b border-beige/40 shadow-sm py-4 text-charcoal'
            : isHeroOverlay
            ? 'bg-gradient-to-b from-charcoal/50 via-charcoal/20 to-transparent py-6 md:py-8 text-ivory-light'
            : 'bg-ivory/90 backdrop-blur-sm border-b border-beige/40 py-5 text-charcoal'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link
            to="/"
            className="group flex flex-col items-start focus:outline-none focus:ring-1 focus:ring-terracotta rounded px-1"
          >
            <span
              className={`font-serif text-xl sm:text-2xl md:text-3xl tracking-widest font-semibold uppercase transition-colors duration-300 ${
                isLightText
                  ? 'text-white group-hover:text-beige'
                  : 'text-charcoal group-hover:text-terracotta'
              }`}
            >
              {settings.site_name || 'WROP INTERIOR'}
            </span>
            <span
              className={`text-[9px] sm:text-[10px] tracking-ultra uppercase -mt-0.5 transition-colors duration-300 ${
                isLightText ? 'text-white/70' : 'text-charcoal/60'
              }`}
            >
              Spatial Architecture & Design
            </span>
          </Link>

          {/* Quick desktop links & Minimal Menu Trigger */}
          <div className="flex items-center space-x-6 md:space-x-8">
            <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-widest uppercase font-medium">
              <Link
                to="/projects"
                className={`transition-colors hover:text-terracotta ${
                  isLightText ? 'text-white/90' : 'text-charcoal/80'
                } ${location.pathname === '/projects' ? 'text-terracotta font-semibold' : ''}`}
              >
                Projects
              </Link>
              <Link
                to="/services"
                className={`transition-colors hover:text-terracotta ${
                  isLightText ? 'text-white/90' : 'text-charcoal/80'
                } ${location.pathname === '/services' ? 'text-terracotta font-semibold' : ''}`}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className={`transition-colors hover:text-terracotta ${
                  isLightText ? 'text-white/90' : 'text-charcoal/80'
                } ${location.pathname === '/contact' ? 'text-terracotta font-semibold' : ''}`}
              >
                Inquire
              </Link>
            </nav>

            {/* Menu Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className={`flex items-center space-x-2.5 py-2 px-3.5 rounded-full border transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-terracotta ${
                isLightText
                  ? 'border-white/30 text-white hover:border-white hover:bg-white/10'
                  : 'border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal/5'
              }`}
              aria-label="Open navigation drawer"
              aria-expanded={isDrawerOpen}
            >
              <span className="text-xs font-medium tracking-widest uppercase">MENU</span>
              <Menu className="w-4 h-4 stroke-[1.75]" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Drawer */}
      <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
