import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Activity, 
  Database, 
  FileText, 
  Users, 
  KeyRound, 
  ShieldAlert, 
  HardDriveDownload, 
  AlertTriangle, 
  LogOut, 
  Terminal,
  X,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DevLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/developer-portal/login');
  };

  const navItems = [
    { label: 'System Health', path: '/developer-portal/dashboard', icon: Activity },
    { label: 'Database & Tables', path: '/developer-portal/database', icon: Database },
    { label: 'Backend Error Logs', path: '/developer-portal/logs', icon: FileText },
    { label: 'Admin Accounts', path: '/developer-portal/accounts', icon: Users },
    { label: 'Active Sessions', path: '/developer-portal/sessions', icon: KeyRound },
    { label: 'Security Audit Logs', path: '/developer-portal/audit-logs', icon: ShieldAlert },
    { label: 'Database Backups', path: '/developer-portal/backups', icon: HardDriveDownload },
    { label: 'Maintenance Mode', path: '/developer-portal/maintenance', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-[#18191B] text-zinc-100 flex flex-col md:flex-row font-mono text-xs">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between z-30">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold tracking-wider text-sm">DEV PORTAL</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-1.5 text-zinc-400 hover:text-white"
        >
          {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Developer Sidebar */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 w-64 bg-zinc-950 border-r border-zinc-800/80 p-5 flex flex-col justify-between z-40 transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="pb-4 border-b border-zinc-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-semibold text-sm tracking-wide text-zinc-100">DEV PORTAL</h1>
                <p className="text-[10px] text-zinc-500">WROP Systems Engine</p>
              </div>
            </div>

            <div className="mt-3 px-2 py-1.5 rounded bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 truncate">{user?.username}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans uppercase">
                Dev Admin
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-emerald-400 font-medium'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-2">
          <div className="text-[10px] text-zinc-500 px-2">
            Hostinger Shared Hosting Ready
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-zinc-400 hover:text-red-400 rounded hover:bg-zinc-900 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Dev Session</span>
          </button>
        </div>
      </aside>

      {/* Main Developer Viewport */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto font-sans">
        <Outlet />
      </main>
    </div>
  );
};
