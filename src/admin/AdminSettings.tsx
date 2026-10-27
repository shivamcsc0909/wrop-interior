import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';

export const AdminSettings: React.FC = () => {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(settings as any);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await api.updateCmsSettings(formData);
      await refreshSettings();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige/60">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-terracotta font-semibold block">
            Global Site Configuration
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Brand Identity & SEO Settings
          </h1>
        </div>
        {saved && (
          <div className="px-4 py-2 bg-olive/10 border border-olive/30 text-olive text-xs font-medium flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-ivory-light border border-beige/80 p-8 shadow-sm">
        {/* Brand Information */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-charcoal pb-2 border-b border-beige/40">
            Brand Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                Brand Name
              </label>
              <input
                type="text"
                name="site_name"
                value={formData.site_name || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                Brand Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-charcoal pb-2 border-b border-beige/40">
            Contact & Consultation Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                Contact Phone
              </label>
              <input
                type="text"
                name="contact_phone"
                value={formData.contact_phone || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                Business Hours
              </label>
              <input
                type="text"
                name="business_hours"
                value={formData.business_hours || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Social Media Channels */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-charcoal pb-2 border-b border-beige/40">
            Social & External Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                Instagram URL
              </label>
              <input
                type="text"
                name="instagram_url"
                value={formData.instagram_url || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                Pinterest URL
              </label>
              <input
                type="text"
                name="pinterest_url"
                value={formData.pinterest_url || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                LinkedIn URL
              </label>
              <input
                type="text"
                name="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-charcoal pb-2 border-b border-beige/40">
            Default SEO Metadata
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                Meta Title Tag
              </label>
              <input
                type="text"
                name="seo_meta_title"
                value={formData.seo_meta_title || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                Meta Description Tag
              </label>
              <textarea
                rows={2}
                name="seo_meta_description"
                value={formData.seo_meta_description || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
            Footer Demonstration Portfolio Notice
          </label>
          <textarea
            rows={2}
            name="footer_note"
            value={formData.footer_note || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
          />
        </div>

        <div className="pt-4 border-t border-beige/60">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-terracotta text-white text-xs uppercase tracking-widest font-semibold hover:bg-terracotta-dark transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
