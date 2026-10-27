import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ResidentialPage } from './pages/ResidentialPage';
import { CommercialPage } from './pages/CommercialPage';
import { ProcessPage } from './pages/ProcessPage';
import { JournalPage } from './pages/JournalPage';
import { JournalDetailPage } from './pages/JournalDetailPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin CMS Pages
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminHomepage } from './admin/AdminHomepage';
import { AdminServices } from './admin/AdminServices';
import { AdminProjects } from './admin/AdminProjects';
import { AdminJournal } from './admin/AdminJournal';
import { AdminEnquiries } from './admin/AdminEnquiries';
import { AdminMedia } from './admin/AdminMedia';
import { AdminSettings } from './admin/AdminSettings';

// Developer Portal Pages
import { DevLayout } from './components/layout/DevLayout';
import { DevLogin } from './developer/DevLogin';
import { DevDashboard } from './developer/DevDashboard';
import { DevDatabase } from './developer/DevDatabase';
import { DevLogs } from './developer/DevLogs';
import { DevAccounts } from './developer/DevAccounts';
import { DevSessions } from './developer/DevSessions';
import { DevSecurityAudit } from './developer/DevSecurityAudit';
import { DevBackups } from './developer/DevBackups';
import { DevMaintenance } from './developer/DevMaintenance';

// Protected Route Guards
const RequireClientAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-ivory flex items-center justify-center font-serif text-xl">Loading...</div>;
  }
  if (!user || (user.role !== 'CLIENT_ADMIN' && user.role !== 'DEVELOPER_ADMIN')) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const RequireDeveloperAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center font-mono">Verifying dev token...</div>;
  }
  if (!user || user.role !== 'DEVELOPER_ADMIN') {
    return <Navigate to="/developer-portal/login" replace />;
  }
  return children;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:slug" element={<ServiceDetailPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      <Route path="/residential" element={<ResidentialPage />} />
      <Route path="/commercial" element={<CommercialPage />} />
      <Route path="/process" element={<ProcessPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/journal/:slug" element={<JournalDetailPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Client Admin Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Client Admin CMS Routes */}
      <Route
        path="/admin"
        element={
          <RequireClientAdmin>
            <AdminLayout />
          </RequireClientAdmin>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="homepage" element={<AdminHomepage />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="journal" element={<AdminJournal />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Developer Portal Authentication */}
      <Route path="/developer-portal/login" element={<DevLogin />} />

      {/* Protected Developer Portal Routes */}
      <Route
        path="/developer-portal"
        element={
          <RequireDeveloperAdmin>
            <DevLayout />
          </RequireDeveloperAdmin>
        }
      >
        <Route index element={<Navigate to="/developer-portal/dashboard" replace />} />
        <Route path="dashboard" element={<DevDashboard />} />
        <Route path="database" element={<DevDatabase />} />
        <Route path="logs" element={<DevLogs />} />
        <Route path="accounts" element={<DevAccounts />} />
        <Route path="sessions" element={<DevSessions />} />
        <Route path="audit-logs" element={<DevSecurityAudit />} />
        <Route path="backups" element={<DevBackups />} />
        <Route path="maintenance" element={<DevMaintenance />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
