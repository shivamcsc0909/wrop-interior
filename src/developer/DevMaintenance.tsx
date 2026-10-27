import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, Key, Save, Check, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export const DevMaintenance: React.FC = () => {
  const [mode, setMode] = useState(false);
  const [message, setMessage] = useState('');
  const [bypassKey, setBypassKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getDevMaintenance();
      setMode(data.maintenance_mode === '1');
      setMessage(data.maintenance_message || '');
      setBypassKey(data.maintenance_bypass_key || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode) {
      if (!confirm('CAUTION: Enabling Maintenance Mode will display a 503 Service Unavailable page to all public visitors. Only logged-in Developer Admins or visitors with the secret bypass key will have access. Proceed?')) {
        return;
      }
    }

    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await api.updateDevMaintenance({
        maintenance_mode: mode,
        maintenance_message: message,
        maintenance_bypass_key: bypassKey
      });
      setStatusMsg(res.message || 'Maintenance settings updated');
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update maintenance mode');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500 font-mono">Loading maintenance status...</div>;
  }

  return (
    <div className="space-y-8 font-mono max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-[10px] uppercase text-emerald-400 font-semibold block">
            Operational Lifecycle & Planned Outages
          </span>
          <h1 className="text-xl font-bold text-zinc-100 font-sans">
            Documented Maintenance Mode Workflow
          </h1>
        </div>
        {statusMsg && (
          <div className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs rounded flex items-center space-x-2">
            <Check className="w-3.5 h-3.5" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Warning Banner */}
      <div className={`p-4 rounded border flex items-start space-x-3.5 ${
        mode
          ? 'bg-amber-950/40 border-amber-800 text-amber-300'
          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
      }`}>
        <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${mode ? 'text-amber-400' : 'text-zinc-500'}`} />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-zinc-200">
            Current Status: {mode ? 'MAINTENANCE MODE IS CURRENTLY ACTIVE' : 'Platform Is Online and Live'}
          </p>
          <p className="leading-relaxed">
            When activated, all public routes respond with HTTP 503 and render the custom maintenance notice. Authenticated Developer Administrators retain unrestricted access.
          </p>
        </div>
      </div>

      <form onSubmit={handleToggle} className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded space-y-6">
        {/* Toggle Switch */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-sm font-bold text-zinc-200">Maintenance Mode State</h2>
            <p className="text-[11px] text-zinc-500">Toggle public availability of the WROP Interior website.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={mode}
              onChange={(e) => setMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        {/* Public Maintenance Message */}
        <div className="space-y-2">
          <label className="text-xs uppercase text-zinc-300 block font-semibold">
            Public Maintenance Notice
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="WROP Interior digital studio is currently undergoing scheduled platform upgrades..."
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded focus:outline-none focus:border-emerald-500 font-sans"
          />
        </div>

        {/* Secret Bypass Key */}
        <div className="space-y-2">
          <label className="text-xs uppercase text-zinc-300 block font-semibold">
            Emergency Secret Bypass Token
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={bypassKey}
              onChange={(e) => setBypassKey(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono rounded"
            />
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Authorized stakeholders can preview the site during maintenance by passing the query parameter <code className="text-zinc-400">?bypass_key={bypassKey || 'TOKEN'}</code> or header <code className="text-zinc-400">X-Maintenance-Bypass: {bypassKey || 'TOKEN'}</code>.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase font-semibold rounded transition-colors disabled:opacity-50"
          >
            {saving ? 'Committing...' : 'Commit Maintenance Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};
