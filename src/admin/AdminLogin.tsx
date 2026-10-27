import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('wrop_client_pass2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { clientLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await clientLogin(username, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-charcoal">
      <div className="w-full max-w-md bg-ivory-light border border-beige/80 p-8 sm:p-10 shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl sm:text-3xl tracking-widest font-semibold uppercase text-charcoal">
              WROP Interior
            </span>
          </Link>
          <div className="flex items-center justify-center space-x-2 pt-1">
            <span className="text-xs uppercase tracking-widest text-olive font-medium">
              Client Studio Management Portal
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-charcoal/80 font-medium block">
              Admin Username or Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ivory border border-beige/80 text-xs focus:outline-none focus:border-terracotta"
                placeholder="admin"
              />
              <User className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-charcoal/80 font-medium block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ivory border border-beige/80 text-xs focus:outline-none focus:border-terracotta"
                placeholder="••••••••••••"
              />
              <Lock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-charcoal text-white hover:bg-terracotta transition-colors text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In To Studio CMS'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-beige/40 text-center">
          <p className="text-[11px] text-charcoal/60">
            Default credentials for evaluation: <code className="bg-beige/40 px-1 py-0.5 rounded text-charcoal">admin</code> / <code className="bg-beige/40 px-1 py-0.5 rounded text-charcoal">wrop_client_pass2026!</code>
          </p>
        </div>
      </div>
    </div>
  );
};
