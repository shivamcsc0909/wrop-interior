import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Briefcase, 
  FolderKanban, 
  BookOpen, 
  MessageSquare, 
  Image, 
  Settings, 
  LogOut, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Homepage CMS', path: '/admin/homepage', icon: Home },
    { label: 'Services', path: '/admin/services', icon: Briefcase },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Journal', path: '/admin/journal', icon: BookOpen },
    { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'Media Library', path: '/admin/media', icon: Image },
    { label: 'Brand Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F0EDE6] flex flex-col md:flex-row text-charcoal">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-charcoal text-ivory p-4 flex items-center justify-between z-30">
        <div className="flex items-center space-x-2">
          <span className="font-serif text-lg tracking-widest font-semibold uppercase">WROP Interior</span>
          <span className="text-[10px] bg-terracotta px-1.5 py-0.5 rounded text-white font-mono">CMS</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-1.5 text-ivory/80 hover:text-white"
        >
          {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 w-64 bg-charcoal text-ivory-light p-6 flex flex-col justify-between z-40 transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Logo / Header */}
          <div>
            <Link to="/admin/dashboard" className="block">
              <span className="font-serif text-xl tracking-widest font-semibold uppercase text-ivory">
                WROP Interior
              </span>
              <span className="block text-[10px] tracking-widest text-beige/70 uppercase mt-0.5">
                Client Studio CMS
              </span>
            </Link>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-olive flex items-center justify-center text-xs font-semibold text-white">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="text-xs truncate">
                <p className="font-medium text-white truncate">{user?.full_name || 'Studio Admin'}</p>
                <p className="text-[10px] text-beige/60 uppercase">Client Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded transition-colors ${
                    isActive
                      ? 'bg-beige/15 text-terracotta-light font-medium'
                      : 'text-ivory/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2 text-xs">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-ivory/60 hover:text-white rounded hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-ivory/60 hover:text-red-400 rounded hover:bg-white/5 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
