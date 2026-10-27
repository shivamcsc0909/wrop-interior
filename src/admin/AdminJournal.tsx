import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, X, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { JournalArticle } from '../types';

export const AdminJournal: React.FC = () => {
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Partial<JournalArticle> | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await api.getCmsJournal();
      setArticles(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    try {
      await api.saveCmsJournal(editingArticle, editingArticle.id);
      setEditingArticle(null);
      loadArticles();
    } catch (err: any) {
      alert(err.message || 'Failed to save journal article');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this journal essay?')) {
      await api.deleteCmsJournal(id);
      loadArticles();
    }
  };

  if (loading) {
    return <div className="p-12 text-center font-serif text-xl">Loading journal...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige/60">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-terracotta font-semibold block">
            Editorial CMS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Journal & Spatial Theory
          </h1>
        </div>
        <button
          onClick={() => setEditingArticle({
            title: '',
            category: 'Design Theory',
            excerpt: '',
            content: '',
            featured_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
            read_time: '5 min read',
            is_published: 1
          })}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal text-white text-xs uppercase tracking-widest hover:bg-terracotta transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-ivory-light border border-beige/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-beige/60 text-charcoal/60 uppercase tracking-widest text-[10px] bg-ivory">
                <th className="p-4 font-medium">Cover</th>
                <th className="p-4 font-medium">Article Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Read Time</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/40">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-ivory/80">
                  <td className="p-4">
                    <img src={art.featured_image} alt="" className="w-12 h-10 object-cover rounded bg-charcoal" />
                  </td>
                  <td className="p-4 font-medium text-charcoal">{art.title}</td>
                  <td className="p-4 text-charcoal/70">{art.category}</td>
                  <td className="p-4 text-charcoal/50">{art.read_time}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                      art.is_published ? 'bg-olive/10 text-olive' : 'bg-charcoal/10 text-charcoal/50'
                    }`}>
                      {art.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingArticle(art)}
                      className="p-1.5 text-charcoal hover:text-terracotta"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
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

      {/* Edit / Write Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ivory border border-beige/80 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-beige/60">
              <h2 className="font-serif text-2xl text-charcoal">
                {editingArticle.id ? 'Edit Journal Essay' : 'Compose Journal Essay'}
              </h2>
              <button onClick={() => setEditingArticle(null)} className="p-1 text-charcoal/60 hover:text-charcoal">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.category || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.read_time || '5 min read'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, read_time: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                  Featured Cover Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.featured_image || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, featured_image: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                  Lead Excerpt (Summary)
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.excerpt || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
                  Full Essay Content (Use double line breaks for paragraphs)
                </label>
                <textarea
                  rows={8}
                  required
                  value={editingArticle.content || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 text-xs font-serif leading-relaxed"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs">
                  <input
                    type="checkbox"
                    checked={editingArticle.is_published === 1}
                    onChange={(e) => setEditingArticle({ ...editingArticle, is_published: e.target.checked ? 1 : 0 })}
                    className="accent-terracotta"
                  />
                  <span>Publish to Journal</span>
                </label>
              </div>

              <div className="pt-4 border-t border-beige/60 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-5 py-2.5 border border-charcoal/30 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-terracotta text-white text-xs uppercase tracking-wider font-semibold hover:bg-terracotta-dark"
                >
                  Save Essay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
