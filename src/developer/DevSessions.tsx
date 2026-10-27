import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export const DevSessions: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await api.getDevSessions();
      setSessions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (confirm(`Revoke session token [${id.substring(0, 8)}...]? The user will be immediately logged out.`)) {
      await api.revokeDevSession(id);
      loadSessions();
    }
  };

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-[10px] uppercase text-emerald-400 font-semibold block">
            Session Security & Token Invalidation
          </span>
          <h1 className="text-xl font-bold text-zinc-100 font-sans">
            Active Administrative Sessions
          </h1>
        </div>
        <button
          onClick={loadSessions}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded hover:border-zinc-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Sessions</span>
        </button>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-widest text-[10px] bg-zinc-950">
                <th className="p-4 font-medium">Session ID</th>
                <th className="p-4 font-medium">User Identity</th>
                <th className="p-4 font-medium">IP Address</th>
                <th className="p-4 font-medium">User Agent</th>
                <th className="p-4 font-medium">Activity</th>
                <th className="p-4 font-medium text-right">Revocation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">
                    No active sessions recorded in registry.
                  </td>
                </tr>
              ) : (
                sessions.map((sess) => (
                  <tr key={sess.id} className="hover:bg-zinc-800/30">
                    <td className="p-4 font-mono text-zinc-400">{sess.id.substring(0, 16)}...</td>
                    <td className="p-4">
                      <p className="font-semibold text-zinc-200">{sess.username}</p>
                      <p className="text-[10px] text-zinc-500 uppercase">{sess.role}</p>
                    </td>
                    <td className="p-4 text-zinc-300 font-mono">{sess.ip_address}</td>
                    <td className="p-4 text-zinc-500 text-[10px] max-w-xs truncate" title={sess.user_agent}>
                      {sess.user_agent}
                    </td>
                    <td className="p-4 text-zinc-400 text-[11px]">
                      {new Date(sess.last_activity * 1000).toLocaleTimeString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRevoke(sess.id)}
                        className="px-2.5 py-1 bg-red-950/60 text-red-400 border border-red-800/80 rounded text-[10px] uppercase hover:bg-red-900 transition-colors"
                      >
                        Revoke
                      </button>
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
