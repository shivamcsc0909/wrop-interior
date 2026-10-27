import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, Eye, EyeOff, Save, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import { Project } from '../types';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getCmsProjects();
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      await api.saveCmsProject(editingProject, editingProject.id);
      setEditingProject(null);
      loadProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project study?')) {
      await api.deleteCmsProject(id);
      loadProjects();
    }
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim() || !editingProject) return;
    const current = editingProject.gallery || [];
    setEditingProject({
      ...editingProject,
      gallery: [...current, galleryUrlInput.trim()]
    });
    setGalleryUrlInput('');
  };

  const handleRemoveGalleryUrl = (idx: number) => {
    if (!editingProject) return;
    const current = editingProject.gallery || [];
    setEditingProject({
      ...editingProject,
      gallery: current.filter((_, i) => i !== idx)
    });
  };

  if (loading) {
    return <div className="p-12 text-center font-serif text-xl">Loading portfolio...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige/60">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-terracotta font-semibold block">
            Portfolio CMS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Spatial Projects & Concepts
          </h1>
        </div>
        <button
          onClick={() => setEditingProject({
            title: '',
            category: 'Residential',
            location: 'Concept Study',
            is_demo: 1,
            short_description: '',
            full_description: '',
            concept: '',
            materials_finishes: '',
            scope: '',
            featured_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
            gallery: [],
            is_featured: 1,
            is_published: 1,
            sort_order: projects.length + 1
          })}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal text-white text-xs uppercase tracking-widest hover:bg-terracotta transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-ivory-light border border-beige/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-beige/60 text-charcoal/60 uppercase tracking-widest text-[10px] bg-ivory">
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Project Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Demo Flag</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/40">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-ivory/80">
                  <td className="p-4">
                    <img src={p.featured_image} alt="" className="w-14 h-10 object-cover rounded bg-charcoal" />
                  </td>
                  <td className="p-4 font-medium text-charcoal">{p.title}</td>
                  <td className="p-4 text-charcoal/70">{p.category}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                      p.is_demo === 1 ? 'bg-beige/40 text-charcoal/80' : 'bg-olive/10 text-olive'
                    }`}>
                      {p.is_demo === 1 ? 'Concept Study' : 'Verified Client Work'}
                    </span>
                  </td>
                  <td className="p-4">
                    {p.is_featured === 1 ? (
                      <span className="text-terracotta flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 fill-terracotta" />
                        <span>Homepage</span>
                      </span>
                    ) : (
                      <span className="text-charcoal/40">Standard</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                      p.is_published ? 'bg-olive/10 text-olive' : 'bg-charcoal/10 text-charcoal/50'
                    }`}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingProject(p)}
                      className="p-1.5 text-charcoal hover:text-terracotta"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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

      {/* Edit / Create Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ivory border border-beige/80 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-beige/60">
              <h2 className="font-serif text-2xl text-charcoal">
                {editingProject.id ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button onClick={() => setEditingProject(null)} className="p-1 text-charcoal/60 hover:text-charcoal">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                    Category
                  </label>
                  <select
                    value={editingProject.category || 'Residential'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Joinery & Millwork</option>
                    <option>Kitchen & Bath</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                    Location / Study Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Concept Study"
                    value={editingProject.location || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                    Demonstration Indicator
                  </label>
                  <select
                    value={editingProject.is_demo ?? 1}
                    onChange={(e) => setEditingProject({ ...editingProject, is_demo: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                  >
                    <option value={1}>Concept Study (Demo Photography)</option>
                    <option value={0}>Genuine Verified Client Project</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                  Featured Cover Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.featured_image || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, featured_image: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                  Card Short Summary
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.short_description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, short_description: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                  Detailed Architectural Narrative
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingProject.full_description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, full_description: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                    Design Concept Quotation
                  </label>
                  <input
                    type="text"
                    value={editingProject.concept || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, concept: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                    Materials & Finishes
                  </label>
                  <input
                    type="text"
                    value={editingProject.materials_finishes || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, materials_finishes: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                  />
                </div>
              </div>

              {/* Gallery Image URLs */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                  Additional Case Study Gallery Images
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-ivory border border-beige/80 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-4 py-2 bg-charcoal text-white text-xs uppercase tracking-wider"
                  >
                    Add Image
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {(editingProject.gallery || []).map((img, i) => (
                    <div key={i} className="relative aspect-[4/3] bg-charcoal group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryUrl(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs">
                  <input
                    type="checkbox"
                    checked={editingProject.is_featured === 1}
                    onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked ? 1 : 0 })}
                    className="accent-terracotta"
                  />
                  <span>Feature on Homepage Editorial Grid</span>
                </label>

                <label className="flex items-center space-x-2 text-xs">
                  <input
                    type="checkbox"
                    checked={editingProject.is_published === 1}
                    onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked ? 1 : 0 })}
                    className="accent-terracotta"
                  />
                  <span>Publish to Public Website</span>
                </label>
              </div>

              <div className="pt-4 border-t border-beige/60 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 border border-charcoal/30 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-terracotta text-white text-xs uppercase tracking-wider font-semibold hover:bg-terracotta-dark"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
