import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  FolderKanban, 
  BookOpen, 
  MessageSquare, 
  Image, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { Enquiry } from '../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCmsDashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center p-12 font-serif text-xl text-charcoal/60">
        Loading studio analytics...
      </div>
    );
  }

  const metrics = [
    { label: 'New Inquiries', val: stats.metrics.new_enquiries, total: stats.metrics.total_enquiries, icon: MessageSquare, color: 'text-terracotta', link: '/admin/enquiries' },
    { label: 'Projects Published', val: stats.metrics.total_projects, total: null, icon: FolderKanban, color: 'text-olive', link: '/admin/projects' },
    { label: 'Disciplines Active', val: stats.metrics.total_services, total: null, icon: Briefcase, color: 'text-charcoal', link: '/admin/services' },
    { label: 'Journal Articles', val: stats.metrics.total_articles, total: null, icon: BookOpen, color: 'text-olive', link: '/admin/journal' },
    { label: 'Media Assets', val: stats.metrics.total_media, total: null, icon: Image, color: 'text-charcoal', link: '/admin/media' },
  ];

  return (
    <div className="space-y-10">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige/60">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-terracotta font-semibold block">
            Studio Management Console
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Website Performance & Content Overview
          </h1>
        </div>
        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal text-white text-xs uppercase tracking-widest hover:bg-terracotta transition-colors"
        >
          <span>Preview Live Website</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <Link
              key={i}
              to={m.link}
              className="bg-ivory-light border border-beige/60 p-6 flex flex-col justify-between hover:shadow-lg hover:border-terracotta/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] uppercase tracking-wider text-charcoal/60 font-medium">
                  {m.label}
                </span>
                <Icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl text-charcoal font-semibold block">
                  {m.val}
                </span>
                {m.total !== null && (
                  <span className="text-[10px] text-charcoal/50">
                    out of {m.total} total inquiries
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Enquiries Table (8 cols) */}
        <div className="lg:col-span-8 bg-ivory-light border border-beige/60 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-charcoal">
              Recent Inquiries
            </h2>
            <Link
              to="/admin/enquiries"
              className="text-xs uppercase tracking-widest text-olive hover:text-terracotta flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recent_enquiries && stats.recent_enquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-beige/60 text-charcoal/60 uppercase tracking-widest text-[10px]">
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Discipline</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige/40">
                  {stats.recent_enquiries.map((enq: Enquiry) => (
                    <tr key={enq.id} className="hover:bg-ivory/80">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-charcoal">{enq.name}</p>
                        <p className="text-[11px] text-charcoal/60">{enq.email}</p>
                      </td>
                      <td className="py-3 pr-4 text-charcoal/80">{enq.project_type}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider ${
                          enq.status === 'new'
                            ? 'bg-terracotta/10 text-terracotta font-semibold'
                            : 'bg-olive/10 text-olive'
                        }`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 text-charcoal/50 text-[11px]">
                        {enq.created_at?.split(' ')[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-charcoal/60 py-6 text-center">
              No inquiries received yet. Submit an inquiry through the contact page to test.
            </p>
          )}
        </div>

        {/* Quick CMS Shortcuts (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-ivory-light border border-beige/60 p-6 space-y-4">
            <h3 className="font-serif text-xl text-charcoal">Quick Content Actions</h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/admin/homepage"
                className="w-full flex items-center justify-between p-3 bg-ivory border border-beige/40 hover:border-terracotta transition-colors"
              >
                <span>Edit Hero & Sections</span>
                <ArrowRight className="w-4 h-4 text-charcoal/40" />
              </Link>
              <Link
                to="/admin/projects"
                className="w-full flex items-center justify-between p-3 bg-ivory border border-beige/40 hover:border-terracotta transition-colors"
              >
                <span>Add / Manage Projects</span>
                <ArrowRight className="w-4 h-4 text-charcoal/40" />
              </Link>
              <Link
                to="/admin/services"
                className="w-full flex items-center justify-between p-3 bg-ivory border border-beige/40 hover:border-terracotta transition-colors"
              >
                <span>Manage Disciplines</span>
                <ArrowRight className="w-4 h-4 text-charcoal/40" />
              </Link>
              <Link
                to="/admin/media"
                className="w-full flex items-center justify-between p-3 bg-ivory border border-beige/40 hover:border-terracotta transition-colors"
              >
                <span>Media Library</span>
                <ArrowRight className="w-4 h-4 text-charcoal/40" />
              </Link>
            </div>
          </div>

          <div className="p-6 bg-charcoal text-ivory text-xs space-y-3">
            <p className="font-serif text-lg text-ivory">Hostinger Production Ready</p>
            <p className="text-beige/70 font-light leading-relaxed">
              All content changes are committed directly to your database with automated audit logs and caching headers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
