export interface User {
  id: number;
  username: string;
  email: string;
  role: 'CLIENT_ADMIN' | 'DEVELOPER_ADMIN';
  full_name: string;
  is_active: number;
  last_login_at?: string;
  created_at?: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  business_hours: string;
  instagram_url?: string;
  pinterest_url?: string;
  linkedin_url?: string;
  footer_note?: string;
  seo_meta_title?: string;
  seo_meta_description?: string;
  [key: string]: string | undefined;
}

export interface HomepageSection {
  id?: number;
  key: string;
  section_key?: string;
  title: string;
  subtitle?: string;
  content?: string;
  settings?: Record<string, any>;
  settings_json?: string;
  sort_order: number;
  is_visible?: number;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string;
  featured_image: string;
  features: string[];
  sort_order: number;
  is_published: number;
  seo_title?: string;
  seo_description?: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  location?: string;
  is_demo: number;
  short_description: string;
  full_description: string;
  concept?: string;
  materials_finishes?: string;
  scope?: string;
  featured_image: string;
  gallery: string[];
  is_featured: number;
  sort_order: number;
  is_published: number;
  seo_title?: string;
  seo_description?: string;
}

export interface JournalArticle {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featured_image: string;
  read_time: string;
  is_published: number;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
}

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  property_type: string;
  approx_area?: string;
  budget_range?: string;
  preferred_date?: string;
  message: string;
  privacy_consent: number | boolean;
  status: 'new' | 'contacted' | 'in_progress' | 'archived';
  admin_notes?: string;
  ip_address?: string;
  created_at: string;
}

export interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  alt_text?: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  username?: string;
  role?: string;
  action: string;
  details?: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface SystemHealth {
  status: string;
  php_version: string;
  server_software: string;
  os: string;
  memory_usage_mb: number;
  memory_limit: string;
  max_execution_time: string;
  upload_max_filesize: string;
  post_max_size: string;
  opcache_enabled: boolean;
  loaded_extensions: Record<string, boolean>;
  database: {
    status: string;
    driver: string;
    latency_ms: number;
  };
  disk_storage: {
    free_gb: number | string;
    total_gb: number | string;
    used_percent: number | string;
  };
  time: string;
}
