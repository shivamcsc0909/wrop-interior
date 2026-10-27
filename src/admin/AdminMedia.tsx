import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Search, Image as ImageIcon, Check, Copy } from 'lucide-react';
import { api } from '../services/api';
import { MediaItem } from '../types';

export const AdminMedia: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, [search]);

  const loadMedia = async () => {
    try {
      const data = await api.getCmsMedia(search);
      setMedia(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME format in browser before upload
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowed.includes(file.type)) {
      alert('Only JPEG, PNG, WEBP, and AVIF image files are permitted.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''));

    try {
      await api.uploadCmsMedia(formData);
      loadMedia();
      alert('Image uploaded successfully to server!');
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Permanently delete this media asset from disk?')) {
      await api.deleteCmsMedia(id);
      loadMedia();
    }
  };

  const handleCopyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige/60">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-terracotta font-semibold block">
            Digital Asset Repository
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Media Library & Image Manager
          </h1>
        </div>
        <div className="relative">
          <input
            type="file"
            id="media_upload_input"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="media_upload_input"
            className={`inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal text-white text-xs uppercase tracking-widest hover:bg-terracotta transition-colors cursor-pointer ${
              uploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Validating & Uploading...' : 'Upload Image'}</span>
          </label>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search media by filename or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-ivory-light border border-beige/80 text-xs focus:outline-none focus:border-terracotta"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3" />
        </div>
        <span className="text-xs text-charcoal/50">
          {media.length} {media.length === 1 ? 'asset' : 'assets'} in library
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {media.map((item) => (
          <div
            key={item.id}
            className="bg-ivory-light border border-beige/80 overflow-hidden flex flex-col justify-between group shadow-sm"
          >
            <div className="aspect-square bg-charcoal relative overflow-hidden">
              <img
                src={item.file_path}
                alt={item.alt_text || item.original_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  onClick={() => handleCopyUrl(item.file_path, item.id)}
                  className="p-2 bg-white text-charcoal rounded hover:bg-terracotta hover:text-white transition-colors"
                  title="Copy Image URL"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-olive" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-white text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3 space-y-1">
              <p className="text-xs font-medium text-charcoal truncate" title={item.original_name}>
                {item.original_name}
              </p>
              <div className="flex items-center justify-between text-[10px] text-charcoal/50">
                <span>{item.mime_type.split('/')[1].toUpperCase()}</span>
                <span>{Math.round(item.file_size / 1024)} KB</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && !loading && (
        <div className="p-12 text-center bg-ivory-light border border-dashed border-beige/80 text-charcoal/60 space-y-3">
          <ImageIcon className="w-8 h-8 mx-auto text-charcoal/40" />
          <p className="text-xs">No media files uploaded yet. Click "Upload Image" to upload your first architectural photograph.</p>
        </div>
      )}
    </div>
  );
};
