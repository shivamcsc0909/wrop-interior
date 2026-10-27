# Hostinger Deployment Instructions — WROP Interior

This folder contains the complete, production-ready files prepared specifically for **Hostinger Shared Hosting** (Single, Premium, or Business plans).

---

## What is in this deployment folder?

1. **`public_html/`** (Folder):
   The exact directory structure that goes into Hostinger's `public_html/`.
2. **`wrop_interior_public_html.zip`** (Single-file archive):
   A compressed archive containing everything inside `public_html/` for fast 1-click upload and extraction via Hostinger File Manager.

---

## Deployment Steps (Takes ~3 minutes)

### Step 1: Create MySQL Database in Hostinger hPanel
1. Open **Hostinger hPanel** → **Databases** → **MySQL Databases**.
2. Create a new database:
   - Database name: e.g., `u123456789_wrop`
   - Username: e.g., `u123456789_wropuser`
   - Password: Choose a strong password.
3. Click **Enter phpMyAdmin** next to the newly created database.
4. Click the **Import** tab at the top.
5. Choose `database/schema.sql` from this folder and click **Import**.
6. Next, choose `database/seed.sql` and click **Import**.

---

### Step 2: Upload Files to Hostinger `public_html`

#### Option A (Recommended — Fastest via File Manager):
1. In Hostinger hPanel, go to **Files** → **File Manager**.
2. Navigate inside the `public_html/` folder.
3. Click the **Upload** icon (top right) and select `wrop_interior_public_html.zip`.
4. Right-click `wrop_interior_public_html.zip` in File Manager and select **Extract** (choose current directory `.`).
5. Delete the `.zip` file after extraction.

#### Option B (Via FTP / FileZilla):
1. Connect via FTP using your Hostinger FTP credentials.
2. Open `public_html/` on the remote server.
3. Drag and drop all files from the local `deployment/public_html/` folder into the remote `public_html/`.

---

### Step 3: Configure Database Credentials in `.env`
1. In Hostinger File Manager (inside `public_html/`), rename `.env.example` to `.env` (or edit `.env`).
2. Update the credentials with the database you created in Step 1:
   ```ini
   DB_DRIVER=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=your_actual_db_name
   DB_USER=your_actual_db_user
   DB_PASS=your_actual_db_password

   SITE_URL=https://yourdomain.com
   APP_ENV=production
   ```
3. Save the file.

---

### Step 4: Verify Your Live Website & Administration

- **Public Website**: Visit `https://yourdomain.com`
- **Client Admin CMS**:
  - URL: `https://yourdomain.com/admin/login`
  - Username: `admin`
  - Password: `wrop_client_pass2026!`
- **Developer Portal**:
  - URL: `https://yourdomain.com/developer-portal/login`
  - Username: `developer`
  - Password: `wrop_dev_pass2026!`

*(Remember to change the default passwords after your initial login via `/developer-portal/accounts`)*.
