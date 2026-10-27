import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project_type: searchParams.get('type') || 'Residential Interior Design',
    property_type: 'Apartment / Penthouse',
    approx_area: '',
    budget_range: '$50,000 — $100,000',
    preferred_date: '',
    message: searchParams.get('reference') ? `Inquiring regarding reference project: ${searchParams.get('reference')}. ` : '',
    privacy_consent: true,
    website_hp: '', // Honeypot field
  });

  const [submitting, setSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSuccessResponse(null);

    try {
      const res = await api.submitEnquiry(formData);
      setSuccessResponse(res.message || 'Your spatial consultation inquiry has been recorded in our studio registry.');
    } catch (err: any) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ form: err.message || 'An error occurred while submitting your enquiry. Please verify your details.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory text-charcoal min-h-screen">
      <Header />

      {/* Header */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-24 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 border-b border-beige/60">
        <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block mb-4">
          Spatial Consultation Inquiries
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-charcoal max-w-4xl leading-tight">
          Let’s Create a Space That Feels Right.
        </h1>
        <p className="mt-6 text-base sm:text-xl text-charcoal/70 max-w-2xl font-light leading-relaxed">
          Tell us about your residential residence, commercial volume, or space transformation aspirations. We review all submissions carefully.
        </p>
      </section>

      {/* Main Form and Studio Info Grid */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 bg-ivory-light border border-beige/60 p-8 sm:p-12 shadow-sm">
            {successResponse ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-16 h-16 bg-olive/20 text-olive mx-auto rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl text-charcoal">
                  Inquiry Received
                </h3>
                <p className="text-sm text-charcoal/70 max-w-md mx-auto leading-relaxed">
                  {successResponse}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSuccessResponse(null);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        project_type: 'Residential Interior Design',
                        property_type: 'Apartment / Penthouse',
                        approx_area: '',
                        budget_range: '$50,000 — $100,000',
                        preferred_date: '',
                        message: '',
                        privacy_consent: true,
                        website_hp: '',
                      });
                    }}
                    className="px-6 py-3 border border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-white transition-colors text-xs uppercase tracking-widest"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.form && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.form}</span>
                  </div>
                )}

                {/* Honeypot field (hidden from genuine users) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_hp">Leave this empty</label>
                  <input
                    type="text"
                    id="website_hp"
                    name="website_hp"
                    value={formData.website_hp}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-charcoal font-medium block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Arthur Pendelton"
                      className={`w-full px-4 py-3 bg-ivory border text-xs focus:outline-none focus:border-terracotta ${
                        errors.name ? 'border-red-400' : 'border-beige/80'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-500">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-charcoal font-medium block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="arthur@example.com"
                      className={`w-full px-4 py-3 bg-ivory border text-xs focus:outline-none focus:border-terracotta ${
                        errors.email ? 'border-red-400' : 'border-beige/80'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-charcoal font-medium block">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-4 py-3 bg-ivory border text-xs focus:outline-none focus:border-terracotta ${
                        errors.phone ? 'border-red-400' : 'border-beige/80'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-500">{errors.phone}</p>}
                  </div>

                  {/* Project Type */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-charcoal font-medium block">
                      Project Discipline
                    </label>
                    <select
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ivory border border-beige/80 text-xs focus:outline-none focus:border-terracotta"
                    >
                      <option>Residential Interior Design</option>
                      <option>Living Room Design</option>
                      <option>Modular Kitchen Design</option>
                      <option>Bedroom & Sanctuary Design</option>
                      <option>Wardrobe & Dressing Suite</option>
                      <option>Commercial / Workplace Interior</option>
                      <option>Space Planning & Architectural Layouts</option>
                      <option>Furniture & Material Curation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Property Type */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-charcoal font-medium block">
                      Property Type
                    </label>
                    <input
                      type="text"
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleChange}
                      placeholder="e.g. Duplex Penthouse"
                      className="w-full px-4 py-3 bg-ivory border border-beige/80 text-xs focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  {/* Approx Area */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-charcoal font-medium block">
                      Approx. Area (Optional)
                    </label>
                    <input
                      type="text"
                      name="approx_area"
                      value={formData.approx_area}
                      onChange={handleChange}
                      placeholder="e.g. 2,800 sq ft"
                      className="w-full px-4 py-3 bg-ivory border border-beige/80 text-xs focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  {/* Budget Range */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-charcoal font-medium block">
                      Estimated Budget
                    </label>
                    <select
                      name="budget_range"
                      value={formData.budget_range}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ivory border border-beige/80 text-xs focus:outline-none focus:border-terracotta"
                    >
                      <option>$25,000 — $50,000</option>
                      <option>$50,000 — $100,000</option>
                      <option>$100,000 — $250,000</option>
                      <option>$250,000+</option>
                      <option>Flexible / To Be Determined</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-charcoal font-medium block">
                    Project Vision & Details *
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about the property, your timeline intentions, stylistic preferences, and any particular architectural challenges..."
                    className={`w-full px-4 py-3 bg-ivory border text-xs focus:outline-none focus:border-terracotta ${
                      errors.message ? 'border-red-400' : 'border-beige/80'
                    }`}
                  />
                  {errors.message && <p className="text-[11px] text-red-500">{errors.message}</p>}
                </div>

                {/* Privacy Consent */}
                <div className="flex items-start space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="privacy_consent"
                    name="privacy_consent"
                    checked={formData.privacy_consent}
                    onChange={handleChange}
                    className="mt-0.5 accent-terracotta"
                  />
                  <label htmlFor="privacy_consent" className="text-xs text-charcoal/70 leading-relaxed">
                    I consent to WROP Interior collecting and storing my submitted consultation details to respond to my project inquiry in accordance with the Privacy Policy.
                  </label>
                </div>
                {errors.privacy_consent && (
                  <p className="text-[11px] text-red-500">{errors.privacy_consent}</p>
                )}

                {/* Submit CTA */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-10 py-4 bg-terracotta text-white font-medium text-xs uppercase tracking-widest hover:bg-terracotta-dark transition-colors duration-300 disabled:opacity-50"
                  >
                    {submitting ? 'RECORDING INQUIRY...' : 'SUBMIT PROJECT INQUIRY'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Studio Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <span className="text-xs uppercase tracking-ultra text-terracotta font-medium block mb-2">
                Studio Credentials
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">
                Direct Contact
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
                We accept commissions across private residences and selected corporate environments.
              </p>
            </div>

            <div className="space-y-6 border-t border-beige/60 pt-6 text-xs text-charcoal/80">
              <div className="flex items-start space-x-4">
                <Mail className="w-5 h-5 text-olive shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold uppercase tracking-wider text-[11px] text-charcoal mb-0.5">Electronic Inquiries</p>
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-terracotta">
                    {settings.contact_email || 'hello@wropinterior.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-5 h-5 text-olive shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold uppercase tracking-wider text-[11px] text-charcoal mb-0.5">Telephone Inquiries</p>
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-terracotta">
                    {settings.contact_phone || '+1 (555) 234-8900'}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-5 h-5 text-olive shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold uppercase tracking-wider text-[11px] text-charcoal mb-0.5">Studio Hours</p>
                  <p>{settings.business_hours || 'Monday — Friday: 9:00 AM — 6:00 PM'}</p>
                  <p className="text-[10px] text-charcoal/50 mt-0.5">Weekend consultations by prior arrangement</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-olive shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold uppercase tracking-wider text-[11px] text-charcoal mb-0.5">Consultation Policy</p>
                  <p className="leading-relaxed">
                    Initial spatial reviews are held either on-site at the project property or via high-resolution video consultation.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-beige/20 border border-beige/60 space-y-2">
              <p className="font-serif text-lg text-charcoal">Privacy Assurance</p>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                All floor plans, personal contact data, and project budget parameters shared with WROP Interior are treated with strict confidentiality.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
