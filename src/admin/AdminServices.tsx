import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, Eye, EyeOff, Save, X } from 'lucide-react';
import { api } from '../services/api';
import { Service } from '../types';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await api.getCmsServices();
      setServices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      await api.saveCmsService(editingService, editingService.id);
      setEditingService(null);
      loadServices();
    } catch (err: any) {
      alert(err.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this interior design service?')) {
      await api.deleteCmsService(id);
      loadServices();
    }
  };

  const handleAddFeature = () => {
    if (!featureInput.trim() || !editingService) return;
    const currentFeatures = editingService.features || [];
    setEditingService({
      ...editingService,
      features: [...currentFeatures, featureInput.trim()]
    });
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    if (!editingService) return;
    const currentFeatures = editingService.features || [];
    setEditingService({
      ...editingService,
      features: currentFeatures.filter((_, i) => i !== idx)
    });
  };

  if (loading) {
    return <div className="p-12 text-center font-serif text-xl">Loading disciplines...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige/60">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-terracotta font-semibold block">
            Capabilities Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Interior Disciplines & Services
          </h1>
        </div>
        <button
          onClick={() => setEditingService({
            title: '',
            category: 'Residential',
            short_description: '',
            full_description: '',
            featured_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
            features: [],
            is_published: 1,
            sort_order: services.length + 1
          })}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal text-white text-xs uppercase tracking-widest hover:bg-terracotta transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Discipline</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-ivory-light border border-beige/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-beige/60 text-charcoal/60 uppercase tracking-widest text-[10px] bg-ivory">
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Discipline Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/40">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-ivory/80">
                  <td className="p-4">
                    <img src={srv.featured_image} alt="" className="w-12 h-10 object-cover rounded bg-charcoal" />
                  </td>
                  <td className="p-4 font-medium text-charcoal">{srv.title}</td>
                  <td className="p-4 text-charcoal/70">{srv.category}</td>
                  <td className="p-4 text-charcoal/50">#{srv.sort_order}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider ${
                      srv.is_published
                        ? 'bg-olive/10 text-olive'
                        : 'bg-charcoal/10 text-charcoal/50'
                    }`}>
                      {srv.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingService(srv)}
                      className="p-1.5 text-charcoal hover:text-terracotta"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id)}
                      className="p-1.5 text-charcoal hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ivory border border-beige/80 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-beige/60">
              <h2 className="font-serif text-2xl text-charcoal">
                {editingService.id ? 'Edit Discipline' : 'Create New Discipline'}
              </h2>
              <button onClick={() => setEditingService(null)} className="p-1 text-charcoal/60 hover:text-charcoal">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                    Discipline Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.category || ''}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingService.featured_image || ''}
                  onChange={(e) => setEditingService({ ...editingService, featured_image: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                  Short Description (Card Summary)
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingService.short_description || ''}
                  onChange={(e) => setEditingService({ ...editingService, short_description: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                  Full Description (Detail Page)
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingService.full_description || ''}
                  onChange={(e) => setEditingService({ ...editingService, full_description: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                />
              </div>

              {/* Inclusions / Features List */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                  Deliverables & Inclusions
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. Architectural lighting scheme"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-ivory border border-beige/80 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-charcoal text-white text-xs uppercase tracking-wider"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(editingService.features || []).map((feat, i) => (
                    <span key={i} className="px-2.5 py-1 bg-beige/40 text-xs rounded flex items-center space-x-1.5">
                      <span>{feat}</span>
                      <button type="button" onClick={() => handleRemoveFeature(i)} className="text-charcoal/60 hover:text-red-600">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs">
                  <input
                    type="checkbox"
                    checked={editingService.is_published === 1}
                    onChange={(e) => setEditingService({ ...editingService, is_published: e.target.checked ? 1 : 0 })}
                    className="accent-terracotta"
                  />
                  <span>Publish to Public Website</span>
                </label>

                <div className="flex items-center space-x-2 text-xs">
                  <span>Display Sort Order:</span>
                  <input
                    type="number"
                    value={editingService.sort_order ?? 0}
                    onChange={(e) => setEditingService({ ...editingService, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-16 px-2 py-1 bg-ivory border border-beige/80"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-beige/60 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-5 py-2.5 border border-charcoal/30 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-terracotta text-white text-xs uppercase tracking-wider font-semibold hover:bg-terracotta-dark"
                >
                  Save Discipline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
