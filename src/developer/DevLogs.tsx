import React, { useState, useEffect } from 'react';
import { FileText, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const DevLogs: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getDevLogs();
      setLogs(data?.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (confirm('Clear the current backend error log file?')) {
      await api.clearDevLogs();
      loadLogs();
    }
  };

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-[10px] uppercase text-emerald-400 font-semibold block">
            Diagnostics Stream
          </span>
          <h1 className="text-xl font-bold text-zinc-100 font-sans">
            Backend Error & Exception Logs
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadLogs}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded hover:border-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleClear}
            disabled={logs.length === 0}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-red-950/60 border border-red-800/80 text-red-300 text-xs rounded hover:bg-red-900 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded p-4 max-h-[600px] overflow-y-auto space-y-2">
        {logs.length === 0 ? (
          <div className="py-12 text-center text-zinc-600 text-xs flex flex-col items-center justify-center space-y-2">
            <FileText className="w-8 h-8 text-zinc-700" />
            <p>No backend error records logged. System operating cleanly.</p>
          </div>
        ) : (
          logs.map((line, idx) => (
            <div key={idx} className="p-2.5 bg-zinc-900/60 border border-zinc-800/60 rounded text-[11px] text-zinc-300 leading-relaxed font-mono">
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
