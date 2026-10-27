import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Key, Check, X, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

export const DevAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAccount, setEditingAccount] = useState<Partial<User> & { password?: string } | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await api.getDevAccounts();
      setAccounts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    try {
      await api.saveDevAccount(editingAccount, editingAccount.id);
      setEditingAccount(null);
      loadAccounts();
    } catch (err: any) {
      alert(err.message || 'Failed to save account');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Permanently delete this administrative account?')) {
      try {
        await api.deleteDevAccount(id);
        loadAccounts();
      } catch (err: any) {
        alert(err.message || 'Failed to delete account');
      }
    }
  };

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-[10px] uppercase text-emerald-400 font-semibold block">
            Access Control & RBAC
          </span>
          <h1 className="text-xl font-bold text-zinc-100 font-sans">
            Administrative Account Management
          </h1>
        </div>
        <button
          onClick={() => setEditingAccount({
            username: '',
            email: '',
            full_name: '',
            role: 'CLIENT_ADMIN',
            is_active: 1,
            password: ''
          })}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Provision New Account</span>
        </button>
      </div>

      {/* Accounts Table */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-widest text-[10px] bg-zinc-950">
                <th className="p-4 font-medium">Username</th>
                <th className="p-4 font-medium">Full Name & Email</th>
                <th className="p-4 font-medium">Assigned Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Last Login</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-zinc-800/30">
                  <td className="p-4 font-bold text-zinc-200">{acc.username}</td>
                  <td className="p-4">
                    <p className="text-zinc-300">{acc.full_name}</p>
                    <p className="text-[11px] text-zinc-500">{acc.email}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                      acc.role === 'DEVELOPER_ADMIN'
                        ? 'bg-purple-950/60 text-purple-400 border border-purple-800/60'
                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                    }`}>
                      {acc.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                      acc.is_active === 1
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-red-950/60 text-red-400'
                    }`}>
                      {acc.is_active === 1 ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-500 text-[11px]">
                    {acc.last_login_at || 'Never logged in'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingAccount(acc)}
                      className="p-1.5 text-zinc-400 hover:text-emerald-400"
                      title="Edit Account"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-400"
                      title="Delete Account"
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

      {/* Edit / Provision Modal */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg p-6 rounded space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="text-sm font-bold text-zinc-100 font-sans">
                {editingAccount.id ? `Edit Account: ${editingAccount.username}` : 'Provision New Administrator'}
              </h2>
              <button onClick={() => setEditingAccount(null)} className="p-1 text-zinc-500 hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-zinc-400 block">Username</label>
                  <input
                    type="text"
                    required
                    value={editingAccount.username || ''}
                    onChange={(e) => setEditingAccount({ ...editingAccount, username: e.target.value })}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-zinc-400 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingAccount.full_name || ''}
                    onChange={(e) => setEditingAccount({ ...editingAccount, full_name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-zinc-400 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingAccount.email || ''}
                  onChange={(e) => setEditingAccount({ ...editingAccount, email: e.target.value })}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-zinc-400 block">Assigned Role</label>
                  <select
                    value={editingAccount.role || 'CLIENT_ADMIN'}
                    onChange={(e) => setEditingAccount({ ...editingAccount, role: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs"
                  >
                    <option value="CLIENT_ADMIN">CLIENT_ADMIN</option>
                    <option value="DEVELOPER_ADMIN">DEVELOPER_ADMIN</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-zinc-400 block">Account Status</label>
                  <select
                    value={editingAccount.is_active ?? 1}
                    onChange={(e) => setEditingAccount({ ...editingAccount, is_active: parseInt(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Deactivated / Locked</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-zinc-800/80">
                <label className="text-[10px] uppercase text-zinc-400 block">
                  {editingAccount.id ? 'Reset Password (Leave blank to keep unchanged)' : 'Initial Password (Minimum 8 chars)'}
                </label>
                <input
                  type="password"
                  placeholder={editingAccount.id ? '••••••••••••' : 'Enter strong password'}
                  value={editingAccount.password || ''}
                  onChange={(e) => setEditingAccount({ ...editingAccount, password: e.target.value })}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="px-3.5 py-1.5 border border-zinc-800 text-zinc-400 text-xs rounded hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
