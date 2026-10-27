import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { api } from '../services/api';

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  site_name: 'WROP Interior',
  tagline: 'Spaces That Feel Like You',
  contact_email: 'hello@wropinterior.com',
  contact_phone: '+1 (555) 234-8900',
  business_hours: 'Monday — Friday: 9:00 AM — 6:00 PM',
  instagram_url: 'https://instagram.com/wropinterior',
  pinterest_url: 'https://pinterest.com/wropinterior',
  linkedin_url: 'https://linkedin.com/company/wropinterior',
  footer_note: 'All project imagery displayed during development is curated demonstration photography. Real projects will be published with client permission.',
  seo_meta_title: 'WROP Interior — Premium Interior Design & Space Transformation',
  seo_meta_description: 'Thoughtfully designed interiors that bring together functionality, aesthetics, and the way you live.'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data && typeof data === 'object') {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch {
      // Retain default settings
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
};
