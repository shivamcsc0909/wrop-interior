import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, ArrowUp, ArrowDown, Check, Sliders } from 'lucide-react';
import { api } from '../services/api';
import { HomepageSection } from '../types';

export const AdminHomepage: React.FC = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await api.getCmsHomepageSections();
      setSections(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = (id: number, field: string, value: any) => {
    setSections(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const handleUpdateSetting = (id: number, key: string, value: any) => {
    setSections(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          settings: {
            ...(s.settings || {}),
            [key]: value
          }
        };
      }
      return s;
    }));
  };

  const handleSave = async (section: HomepageSection) => {
    if (!section.id) return;
    setSavingId(section.id);
    setSuccessMsg(null);
    try {
      await api.updateCmsHomepageSection(section.id, section);
      setSuccessMsg(`Section "${section.title}" saved successfully!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update section');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className="p-12 text-center font-serif text-xl">Loading homepage CMS...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige/60">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-terracotta font-semibold block">
            Homepage Layout & Content CMS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Visual Section Editor & Focal Controls
          </h1>
        </div>
        {successMsg && (
          <div className="px-4 py-2 bg-olive/10 border border-olive/30 text-olive text-xs font-medium flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="bg-ivory-light border border-beige/80 p-6 sm:p-8 space-y-6 shadow-sm"
          >
            {/* Header row with visibility & sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-beige/40 gap-3">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono uppercase bg-beige/40 px-2 py-0.5 rounded text-charcoal/70">
                  {sec.section_key}
                </span>
                <span className="text-xs text-charcoal/50">Order #{sec.sort_order}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => handleUpdateField(sec.id!, 'is_visible', sec.is_visible ? 0 : 1)}
                  className={`flex items-center space-x-1.5 text-xs px-3 py-1 border transition-colors ${
                    sec.is_visible
                      ? 'border-olive/40 text-olive bg-olive/5'
                      : 'border-charcoal/20 text-charcoal/40 bg-charcoal/5'
                  }`}
                >
                  {sec.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{sec.is_visible ? 'Published & Visible' : 'Hidden from Public'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSave(sec)}
                  disabled={savingId === sec.id}
                  className="px-5 py-1.5 bg-charcoal text-white hover:bg-terracotta text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingId === sec.id ? 'Saving...' : 'Save Section'}</span>
                </button>
              </div>
            </div>

            {/* Common Inputs: Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-charcoal/80 font-medium block">
                  Headline / Primary Heading
                </label>
                <input
                  type="text"
                  value={sec.title || ''}
                  onChange={(e) => handleUpdateField(sec.id!, 'title', e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory border border-beige/80 text-xs focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-charcoal/80 font-medium block">
                  Supporting Text / Subtitle
                </label>
                <input
                  type="text"
                  value={sec.subtitle || ''}
                  onChange={(e) => handleUpdateField(sec.id!, 'subtitle', e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory border border-beige/80 text-xs focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>

            {/* Special Section Settings: HERO */}
            {sec.section_key === 'hero' && (
              <div className="p-6 bg-beige/15 border border-beige/60 space-y-6">
                <h4 className="font-serif text-lg text-charcoal">Cinematic Hero Viewport Settings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal/80 font-medium block">
                      Desktop Hero Image URL
                    </label>
                    <input
                      type="text"
                      value={sec.settings?.desktop_image || ''}
                      onChange={(e) => handleUpdateSetting(sec.id!, 'desktop_image', e.target.value)}
                      className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal/80 font-medium block">
                      Mobile Hero Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={sec.settings?.mobile_image || ''}
                      onChange={(e) => handleUpdateSetting(sec.id!, 'mobile_image', e.target.value)}
                      className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Focal Point Picker Slider */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] uppercase tracking-wider text-charcoal/70">
                      <span>Horizontal Focal Point (X)</span>
                      <span>{sec.settings?.focal_point_x ?? 50}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sec.settings?.focal_point_x ?? 50}
                      onChange={(e) => handleUpdateSetting(sec.id!, 'focal_point_x', parseInt(e.target.value))}
                      className="w-full accent-terracotta"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] uppercase tracking-wider text-charcoal/70">
                      <span>Vertical Focal Point (Y)</span>
                      <span>{sec.settings?.focal_point_y ?? 50}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sec.settings?.focal_point_y ?? 50}
                      onChange={(e) => handleUpdateSetting(sec.id!, 'focal_point_y', parseInt(e.target.value))}
                      className="w-full accent-terracotta"
                    />
                  </div>
                </div>

                {/* CTA Buttons Config */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal/80 font-medium block">
                      Primary CTA Label & URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Label"
                        value={sec.settings?.cta_primary_text || ''}
                        onChange={(e) => handleUpdateSetting(sec.id!, 'cta_primary_text', e.target.value)}
                        className="w-1/2 px-3 py-2 bg-ivory border border-beige/80 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="/projects"
                        value={sec.settings?.cta_primary_url || ''}
                        onChange={(e) => handleUpdateSetting(sec.id!, 'cta_primary_url', e.target.value)}
                        className="w-1/2 px-3 py-2 bg-ivory border border-beige/80 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal/80 font-medium block">
                      Secondary CTA Label & URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Label"
                        value={sec.settings?.cta_secondary_text || ''}
                        onChange={(e) => handleUpdateSetting(sec.id!, 'cta_secondary_text', e.target.value)}
                        className="w-1/2 px-3 py-2 bg-ivory border border-beige/80 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="/contact"
                        value={sec.settings?.cta_secondary_url || ''}
                        onChange={(e) => handleUpdateSetting(sec.id!, 'cta_secondary_url', e.target.value)}
                        className="w-1/2 px-3 py-2 bg-ivory border border-beige/80 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Special Section Settings: BRAND INTRO */}
            {sec.section_key === 'brand_intro' && (
              <div className="p-6 bg-beige/15 border border-beige/60 space-y-4">
                <h4 className="font-serif text-lg text-charcoal">Split Layout Image</h4>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-charcoal/80 font-medium block">
                    Large Editorial Image URL
                  </label>
                  <input
                    type="text"
                    value={sec.settings?.image || ''}
                    onChange={(e) => handleUpdateSetting(sec.id!, 'image', e.target.value)}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
