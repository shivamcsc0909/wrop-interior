import { 
  HomepageSection, 
  Service, 
  Project, 
  JournalArticle, 
  SiteSettings, 
  Enquiry, 
  MediaItem, 
  User, 
  AuditLog, 
  SystemHealth 
} from '../types';

let csrfToken: string | null = null;

export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

export const getCsrfToken = () => csrfToken;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (csrfToken && !headers.has('X-CSRF-Token')) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg) as any;
    err.status = response.status;
    err.errors = data?.errors;
    throw err;
  }

  if (data?.csrf_token) {
    csrfToken = data.csrf_token;
  }

  return data?.data !== undefined ? data.data : data;
}

export const api = {
  // Public
  getHomepage: () => request<{
    sections: Record<string, HomepageSection>;
    featured_services: Service[];
    featured_projects: Project[];
    recent_articles: JournalArticle[];
    settings: SiteSettings;
  }>('/api/public/homepage'),

  getSettings: () => request<SiteSettings>('/api/public/settings'),
  getServices: () => request<Service[]>('/api/public/services'),
  getServiceBySlug: (slug: string) => request<{ service: Service; related_projects: Project[] }>(`/api/public/services/${slug}`),
  getProjects: (category?: string) => request<Project[]>(`/api/public/projects${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getProjectBySlug: (slug: string) => request<{ project: Project; related: Project[] }>(`/api/public/projects/${slug}`),
  getJournalArticles: () => request<JournalArticle[]>('/api/public/journal'),
  getJournalArticleBySlug: (slug: string) => request<{ article: JournalArticle; related: JournalArticle[] }>(`/api/public/journal/${slug}`),
  submitEnquiry: (data: Partial<Enquiry>) => request<{ id: number; message: string }>('/api/public/enquiry', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Auth
  clientLogin: (username: string, password: string) => request<{ user: User; csrf_token: string }>('/api/auth/client-login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  devLogin: (username: string, password: string) => request<{ user: User; csrf_token: string }>('/api/auth/dev-login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  getSession: () => request<{ user: User | null; csrf_token: string }>('/api/auth/session'),
  logout: () => request<null>('/api/auth/logout', { method: 'POST' }),

  // Client CMS
  getCmsDashboard: () => request<{
    metrics: {
      total_enquiries: number;
      new_enquiries: number;
      total_projects: number;
      total_services: number;
      total_articles: number;
      total_media: number;
    };
    recent_enquiries: Enquiry[];
  }>('/api/cms/dashboard'),
  getCmsHomepageSections: () => request<HomepageSection[]>('/api/cms/homepage-sections'),
  updateCmsHomepageSection: (id: number, data: Partial<HomepageSection>) => request<null>(`/api/cms/homepage-sections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getCmsServices: () => request<Service[]>('/api/cms/services'),
  saveCmsService: (data: Partial<Service>, id?: number) => request<{ id: number }>(id ? `/api/cms/services/${id}` : '/api/cms/services', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
  deleteCmsService: (id: number) => request<null>(`/api/cms/services/${id}`, { method: 'DELETE' }),

  getCmsProjects: () => request<Project[]>('/api/cms/projects'),
  saveCmsProject: (data: Partial<Project>, id?: number) => request<{ id: number }>(id ? `/api/cms/projects/${id}` : '/api/cms/projects', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
  deleteCmsProject: (id: number) => request<null>(`/api/cms/projects/${id}`, { method: 'DELETE' }),

  getCmsJournal: () => request<JournalArticle[]>('/api/cms/journal'),
  saveCmsJournal: (data: Partial<JournalArticle>, id?: number) => request<{ id: number }>(id ? `/api/cms/journal/${id}` : '/api/cms/journal', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
  deleteCmsJournal: (id: number) => request<null>(`/api/cms/journal/${id}`, { method: 'DELETE' }),

  updateCmsSettings: (settings: Record<string, string>) => request<null>('/api/cms/settings', {
    method: 'POST',
    body: JSON.stringify(settings),
  }),

  getCmsEnquiries: (status?: string) => request<Enquiry[]>(`/api/cms/enquiries${status ? `?status=${status}` : ''}`),
  updateCmsEnquiry: (id: number, data: { status?: string; admin_notes?: string }) => request<null>(`/api/cms/enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteCmsEnquiry: (id: number) => request<null>(`/api/cms/enquiries/${id}`, { method: 'DELETE' }),

  getCmsMedia: (q?: string) => request<MediaItem[]>(`/api/cms/media${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  uploadCmsMedia: (formData: FormData) => request<MediaItem>('/api/cms/media/upload', {
    method: 'POST',
    body: formData,
  }),
  deleteCmsMedia: (id: number) => request<null>(`/api/cms/media/${id}`, { method: 'DELETE' }),

  // Developer Portal
  getDevHealth: () => request<SystemHealth>('/api/dev/health'),
  getDevDatabase: () => request<{ driver: string; tables: { table: string; rows: number | string }[] }>('/api/dev/database'),
  getDevLogs: () => request<{ logs: string[] }>('/api/dev/logs'),
  clearDevLogs: () => request<null>('/api/dev/logs/clear', { method: 'POST' }),
  getDevAccounts: () => request<User[]>('/api/dev/accounts'),
  saveDevAccount: (data: any, id?: number) => request<{ id: number }>(id ? `/api/dev/accounts/${id}` : '/api/dev/accounts', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
  deleteDevAccount: (id: number) => request<null>(`/api/dev/accounts/${id}`, { method: 'DELETE' }),
  getDevSessions: () => request<any[]>('/api/dev/sessions'),
  revokeDevSession: (id: string) => request<null>(`/api/dev/sessions/${id}`, { method: 'DELETE' }),
  getDevAuditLogs: (action?: string) => request<AuditLog[]>(`/api/dev/audit-logs${action ? `?action=${action}` : ''}`),
  getDevMaintenance: () => request<{ maintenance_mode: string; maintenance_message: string; maintenance_bypass_key: string }>('/api/dev/maintenance'),
  updateDevMaintenance: (data: { maintenance_mode: boolean; maintenance_message: string; maintenance_bypass_key?: string }) => request<any>('/api/dev/maintenance', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
