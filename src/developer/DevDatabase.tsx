import React, { useState, useEffect } from 'react';
import { Database, Table, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export const DevDatabase: React.FC = () => {
  const [data, setData] = useState<{ driver: string; tables: { table: string; rows: number | string }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDatabase();
  }, []);

  const loadDatabase = async () => {
    setLoading(true);
    try {
      const res = await api.getDevDatabase();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-[10px] uppercase text-emerald-400 font-semibold block">
            Storage Layer Status
          </span>
          <h1 className="text-xl font-bold text-zinc-100 font-sans">
            Database Engine & Table Statistics
          </h1>
        </div>
        <button
          onClick={loadDatabase}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded hover:border-zinc-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Tables</span>
        </button>
      </div>

      <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded flex items-center space-x-3 text-xs">
        <Database className="w-4 h-4 text-emerald-400" />
        <span className="text-zinc-400">Active PDO Driver:</span>
        <span className="text-zinc-100 font-bold uppercase">{data?.driver || 'Detecting...'}</span>
        <span className="text-zinc-600">|</span>
        <span className="text-zinc-400">Total Monitored Tables:</span>
        <span className="text-zinc-100 font-bold">{data?.tables?.length || 0}</span>
      </div>

      {/* Tables Table */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-widest text-[10px] bg-zinc-950">
                <th className="p-4 font-medium">Table Identifier</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium text-right">Row Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {data?.tables?.map((t) => (
                <tr key={t.table} className="hover:bg-zinc-800/30">
                  <td className="p-4 font-semibold text-zinc-200 flex items-center space-x-2">
                    <Table className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{t.table}</span>
                  </td>
                  <td className="p-4 text-zinc-400 text-[11px]">
                    {t.table === 'users' && 'Administrative roles, hashes & logins'}
                    {t.table === 'sessions' && 'Active authenticated sessions & IP tracking'}
                    {t.table === 'site_settings' && 'Global brand properties & SEO parameters'}
                    {t.table === 'homepage_sections' && 'Dynamic homepage sections & focal points'}
                    {t.table === 'services' && 'Design disciplines, scopes & deliverables'}
                    {t.table === 'projects' && 'Portfolio case studies & demo concepts'}
                    {t.table === 'journal_articles' && 'Essays & editorial design theory'}
                    {t.table === 'enquiries' && 'Consultation inquiries & client messages'}
                    {t.table === 'media_items' && 'Uploaded images, sizes & MIME records'}
                    {t.table === 'audit_logs' && 'Security activity trail & administrative audits'}
                    {t.table === 'system_settings' && 'Maintenance mode & bypass secrets'}
                  </td>
                  <td className="p-4 text-right font-bold text-emerald-400">
                    {t.rows}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
