import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Download, Trash2, CheckCircle2, Eye, X } from 'lucide-react';
import { api } from '../services/api';
import { Enquiry } from '../types';

export const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadEnquiries();
  }, [filterStatus]);

  const loadEnquiries = async () => {
    try {
      const data = await api.getCmsEnquiries(filterStatus);
      setEnquiries(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.updateCmsEnquiry(id, { status });
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: status as any });
      }
      loadEnquiries();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    try {
      await api.updateCmsEnquiry(selectedEnquiry.id, { admin_notes: adminNotes });
      setSelectedEnquiry({ ...selectedEnquiry, admin_notes: adminNotes });
      loadEnquiries();
      alert('Internal notes updated');
    } catch (err: any) {
      alert(err.message || 'Failed to update notes');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Permanently delete this enquiry record?')) {
      await api.deleteCmsEnquiry(id);
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
      loadEnquiries();
    }
  };

  const handleExportCsv = () => {
    if (enquiries.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Project Type', 'Property Type', 'Approx Area', 'Budget', 'Status', 'Date', 'Message'];
    const rows = enquiries.map(e => [
      e.id,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.email.replace(/"/g, '""')}"`,
      `"${e.phone.replace(/"/g, '""')}"`,
      `"${e.project_type.replace(/"/g, '""')}"`,
      `"${e.property_type.replace(/"/g, '""')}"`,
      `"${(e.approx_area || '').replace(/"/g, '""')}"`,
      `"${(e.budget_range || '').replace(/"/g, '""')}"`,
      `"${e.status}"`,
      `"${e.created_at}"`,
      `"${e.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wrop_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige/60">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-terracotta font-semibold block">
            Lead Inquiries Pipeline
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Spatial Consultation Inquiries
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCsv}
            disabled={enquiries.length === 0}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-charcoal/30 text-xs uppercase tracking-wider hover:bg-charcoal hover:text-white transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {['all', 'new', 'contacted', 'in_progress', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 uppercase tracking-widest border transition-colors ${
              filterStatus === status
                ? 'bg-charcoal text-white border-charcoal font-medium'
                : 'bg-ivory-light border-beige/60 text-charcoal/70 hover:border-charcoal'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Inquiries Table */}
      <div className="bg-ivory-light border border-beige/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-beige/60 text-charcoal/60 uppercase tracking-widest text-[10px] bg-ivory">
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Discipline</th>
                <th className="p-4 font-medium">Property & Area</th>
                <th className="p-4 font-medium">Budget</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Received</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/40">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-charcoal/60">
                    No inquiries found for this status.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-ivory/80">
                    <td className="p-4">
                      <p className="font-semibold text-charcoal">{enq.name}</p>
                      <p className="text-[11px] text-charcoal/60">{enq.email}</p>
                      <p className="text-[11px] text-charcoal/60">{enq.phone}</p>
                    </td>
                    <td className="p-4 font-medium text-charcoal">{enq.project_type}</td>
                    <td className="p-4 text-charcoal/70">
                      <p>{enq.property_type}</p>
                      {enq.approx_area && <p className="text-[11px] text-charcoal/50">{enq.approx_area}</p>}
                    </td>
                    <td className="p-4 text-charcoal/70">{enq.budget_range || 'Not specified'}</td>
                    <td className="p-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                        className={`text-[10px] uppercase font-mono px-2 py-1 border rounded bg-white focus:outline-none ${
                          enq.status === 'new'
                            ? 'border-terracotta text-terracotta font-semibold'
                            : enq.status === 'contacted'
                            ? 'border-olive text-olive'
                            : 'border-beige text-charcoal/60'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="p-4 text-charcoal/50 text-[11px]">
                      {enq.created_at?.split(' ')[0]}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedEnquiry(enq);
                          setAdminNotes(enq.admin_notes || '');
                        }}
                        className="p-1.5 text-charcoal hover:text-terracotta"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(enq.id)}
                        className="p-1.5 text-charcoal hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ivory border border-beige/80 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-beige/60">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-olive font-mono">
                  Inquiry #{selectedEnquiry.id}
                </span>
                <h2 className="font-serif text-2xl text-charcoal">
                  {selectedEnquiry.name}
                </h2>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="p-1 text-charcoal/60 hover:text-charcoal">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-charcoal/50 uppercase tracking-wider text-[10px] block">Email</span>
                <a href={`mailto:${selectedEnquiry.email}`} className="font-medium text-terracotta">
                  {selectedEnquiry.email}
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-charcoal/50 uppercase tracking-wider text-[10px] block">Phone</span>
                <a href={`tel:${selectedEnquiry.phone}`} className="font-medium text-charcoal">
                  {selectedEnquiry.phone}
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-charcoal/50 uppercase tracking-wider text-[10px] block">Discipline</span>
                <p className="font-medium text-charcoal">{selectedEnquiry.project_type}</p>
              </div>
              <div className="space-y-1">
                <span className="text-charcoal/50 uppercase tracking-wider text-[10px] block">Property Typology</span>
                <p className="font-medium text-charcoal">{selectedEnquiry.property_type}</p>
              </div>
              <div className="space-y-1">
                <span className="text-charcoal/50 uppercase tracking-wider text-[10px] block">Approx Area</span>
                <p className="font-medium text-charcoal">{selectedEnquiry.approx_area || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-charcoal/50 uppercase tracking-wider text-[10px] block">Estimated Budget</span>
                <p className="font-medium text-charcoal">{selectedEnquiry.budget_range || 'Flexible'}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-beige/60">
              <span className="text-charcoal/50 uppercase tracking-wider text-[10px] block">Project Message</span>
              <p className="p-4 bg-ivory-light border border-beige/60 text-xs sm:text-sm text-charcoal leading-relaxed whitespace-pre-line">
                {selectedEnquiry.message}
              </p>
            </div>

            {/* Internal Studio Notes */}
            <div className="space-y-2 pt-2 border-t border-beige/60">
              <label className="text-xs uppercase tracking-wider text-charcoal font-semibold block">
                Internal Studio Notes & Follow-up Log
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Log consultation date, initial architect review notes, or client budget updates..."
                className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-charcoal text-white text-xs uppercase tracking-wider font-medium hover:bg-terracotta"
              >
                Save Internal Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
