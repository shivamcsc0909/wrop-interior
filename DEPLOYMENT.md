# Hostinger Shared Hosting Deployment Guide — WROP Interior

This guide provides step-by-step instructions for deploying the **WROP Interior** platform to **Hostinger Shared Hosting** (Single, Premium, or Business Web Hosting) using native PHP 8.3+ and MySQL/MariaDB.

---

## 1. Hosting Architecture & Prerequisites

- **Frontend**: Pre-compiled static single-page application (`dist/`). No Node.js process is required on the server.
- **Backend**: Native PHP 8.3+ with PDO (`pdo_mysql`, `mbstring`, `fileinfo`, `gd`).
- **Database**: MySQL 8.0+ or MariaDB 10.5+ managed via Hostinger hPanel.
- **Web Server**: Apache / LiteSpeed with `.htaccess` and `mod_rewrite` enabled.
- **No Docker or Redis required**: Fast, standard shared hosting deployment.

---

## 2. Pre-Deployment: Build Static Frontend Locally

Run the local build command to produce the distribution assets:

```bash
npm run build
```

This compiles your application into the `dist/` directory:
- `dist/index.html`
- `dist/assets/index-*.js`
- `dist/assets/index-*.css`

---

## 3. Hostinger Database Setup

1. Log into your Hostinger control panel (**hPanel**).
2. Navigate to **Databases** → **MySQL Databases**.
3. Create a new database:
   - **Database Name**: e.g., `u123456789_wrop`
   - **Database Username**: e.g., `u123456789_wropuser`
   - **Password**: Generate a strong password (at least 16 characters).
4. Click **Enter phpMyAdmin** next to the newly created database.
5. In phpMyAdmin, click the **Import** tab at the top.
6. Choose the file `database/schema.sql` and click **Import**.
7. Next, choose the file `database/seed.sql` and click **Import**.

All required tables and initial administrative users are now created.

---

## 4. Environment Configuration (`.env`)

1. Copy `.env.example` to `.env`.
2. Configure with your Hostinger database credentials:

```ini
DB_DRIVER=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u123456789_wrop
DB_USER=u123456789_wropuser
DB_PASS=YourGeneratedPasswordHere!

SITE_URL=https://yourdomain.com
APP_ENV=production
```

> **Security Note**: Never commit your live `.env` file to public version control. The root `.htaccess` strictly blocks public HTTP access to `.env`.

---

## 5. File Upload Structure to `public_html`

Using Hostinger's **File Manager** (or SFTP / FileZilla), upload files to your website's document root (`public_html/`):

```
public_html/
├── .htaccess                     # Root rewrite rules & security headers (from repository)
├── .env                          # Production database credentials
├── index.html                    # Copy from dist/index.html
├── assets/                       # Copy folder from dist/assets/
├── api/                          # Copy entire repository api/ directory
│   ├── index.php
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   └── uploads/                  # Writable directory for client uploads
│       └── .htaccess             # Strictly prevents PHP script execution
├── database/                     # Keep schema.sql & seed.sql for reference
└── logs/                         # Writable directory for backend logs
```

---

## 6. Directory Permissions Guidance

In Hostinger File Manager or terminal, set recommended permissions:

| Path | Recommended Permission | Purpose |
|---|---|---|
| All directories | `0755` (`drwxr-xr-x`) | Standard web server read & execute |
| All PHP & static files | `0644` (`-rw-r--r--`) | Readable by web server, non-writable |
| `.env` | `0600` or `0640` | Restricted credential file |
| `api/uploads/` | `0755` (writable by web server user) | Media asset storage |
| `logs/` | `0755` (writable by web server user) | Backend error and ratelimit logs |

---

## 7. Initial Administrative Access

Two distinct administrative roles are pre-seeded with independent privileges:

### 1. Client Admin Portal (Website & Content Management)
- **URL**: `https://yourdomain.com/admin/login`
- **Username**: `admin`
- **Password**: `wrop_client_pass2026!`
- **Capabilities**: Manage homepage hero & sections, toggle service disciplines, add/edit projects, publish journal articles, review contact inquiries, upload media.

### 2. Developer Admin Portal (System Operations)
- **URL**: `https://yourdomain.com/developer-portal/login`
- **Username**: `developer`
- **Password**: `wrop_dev_pass2026!`
- **Capabilities**: Server health monitoring, PHP memory & extensions diagnostic, live backend error logs, administrative account provisioning, session revocation, security audit logs, one-click database backup export, documented maintenance mode.

> **Crucial Post-Installation Step**: Log into `/developer-portal/accounts` immediately upon initial setup and update the default passwords for both accounts.

---

## 8. Backup & Disaster Recovery

1. **One-Click Web Backup**:
   - Access `https://yourdomain.com/developer-portal/backups` and click **Download Complete SQL Backup**.
2. **Hostinger Automated Backups**:
   - In hPanel, go to **Files** → **Backups**.
   - Hostinger takes automated daily/weekly snapshots of both files and MySQL databases.
3. **Restoration**:
   - Upload any downloaded `.sql` file directly into phpMyAdmin under the **Import** tab.

---

## 9. Security Checklist

- [x] **Strict MIME Validation**: `api/controllers/MediaController.php` inspects true binary MIME types via `finfo`, accepting only JPEG, PNG, WEBP, and AVIF.
- [x] **Upload Execution Prevention**: `api/uploads/.htaccess` blocks all execution of `.php`, `.phtml`, `.cgi`, `.py`, and scripts.
- [x] **Role Separation**: Client Admins attempting to query `/api/dev/*` are strictly blocked on the PHP server level with `403 Forbidden`.
- [x] **No Developer Links in Public Sitemaps**: Developer portal URLs are excluded from public navigation, sitemaps, and search engines.
- [x] **Rate Limiting & Honeypot**: Inquiry form submissions are rate limited (max 5 per 10 minutes per IP) with transparent honeypot spam traps.
- [x] **Session Security**: Session cookies are configured with `HttpOnly`, `SameSite=Lax`, and `Secure` (over HTTPS).
