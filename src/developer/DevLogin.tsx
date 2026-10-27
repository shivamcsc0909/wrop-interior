import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DevLogin: React.FC = () => {
  const [username, setUsername] = useState('developer');
  const [password, setPassword] = useState('wrop_dev_pass2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { devLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await devLogin(username, password);
      navigate('/developer-portal/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid developer credentials or insufficient role permissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111214] text-zinc-100 flex items-center justify-center p-6 font-mono text-xs">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 shadow-2xl space-y-6">
        <div className="space-y-3 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Terminal className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-widest uppercase">Developer Portal</span>
          </div>
          <p className="text-zinc-500 text-[11px] leading-relaxed">
            Restricted systems administration area. Requires independently provisioned <code className="text-zinc-300">DEVELOPER_ADMIN</code> credentials.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-zinc-400 text-[11px] uppercase tracking-wider block">
              Developer Identity
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="developer"
                className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
              />
              <User className="w-4 h-4 text-zinc-600 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 text-[11px] uppercase tracking-wider block">
              Authorization Key / Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
              />
              <Lock className="w-4 h-4 text-zinc-600 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Validating Token...' : 'Authenticate Dev Session'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-zinc-900 text-center text-zinc-600 text-[10px]">
          Default credential: <code className="text-zinc-400">developer</code> / <code className="text-zinc-400">wrop_dev_pass2026!</code>
        </div>
      </div>
    </div>
  );
};
