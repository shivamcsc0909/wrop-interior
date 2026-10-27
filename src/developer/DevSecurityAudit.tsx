import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { AuditLog } from '../types';

export const DevSecurityAudit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [filterAction]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getDevAuditLogs(filterAction);
      setLogs(data || []);
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
            Immutable Audit Trail
          </span>
          <h1 className="text-xl font-bold text-zinc-100 font-sans">
            Security & Authentication Audit Trail
          </h1>
        </div>
        <button
          onClick={loadLogs}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded hover:border-zinc-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-[11px]">
        {['all', 'LOGIN', 'FAILED', 'CREATE', 'UPDATE', 'DELETE', 'MAINTENANCE'].map((action) => (
          <button
            key={action}
            onClick={() => setFilterAction(action)}
            className={`px-3 py-1.5 rounded transition-colors uppercase ${
              filterAction === action
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {action}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-widest text-[10px] bg-zinc-950">
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Action Event</th>
                <th className="p-4 font-medium">Subject / User</th>
                <th className="p-4 font-medium">Details</th>
                <th className="p-4 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    No security events matching filter.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-800/30">
                    <td className="p-4 text-zinc-500 text-[11px] font-mono whitespace-nowrap">
                      {log.created_at}
                    </td>
                    <td className="p-4 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                        log.action.includes('FAIL')
                          ? 'bg-red-950/60 text-red-400 border border-red-800/60'
                          : log.action.includes('LOGIN')
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-300">
                      {log.username ? `${log.username} (${log.role})` : 'Anonymous / System'}
                    </td>
                    <td className="p-4 text-zinc-400 text-[11px] max-w-sm truncate" title={log.details || ''}>
                      {log.details || '—'}
                    </td>
                    <td className="p-4 text-zinc-400 font-mono text-[11px]">
                      {log.ip_address}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
