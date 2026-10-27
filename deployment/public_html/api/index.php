<?php
/**
 * WROP Interior Central API Router
 */

declare(strict_types=1);

// Error reporting for production vs dev
ini_set('display_errors', '0');
error_reporting(E_ALL);

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/security.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/utils/Validator.php';
require_once __DIR__ . '/utils/Logger.php';
require_once __DIR__ . '/middleware/auth.php';
require_once __DIR__ . '/middleware/maintenance.php';
require_once __DIR__ . '/middleware/rate_limit.php';

require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PublicController.php';
require_once __DIR__ . '/controllers/EnquiryController.php';
require_once __DIR__ . '/controllers/CmsController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/DevController.php';

setSecurityHeaders();

// Handle CORS for local dev Vite server (5173)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!empty($origin)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token, X-Maintenance-Bypass');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Check maintenance mode on all non-exempt requests
MaintenanceMiddleware::check();

// Normalize URI (strip subdirectories if deployed in subfolder)
$uri = preg_replace('#^.*?/api#', '/api', $requestUri);

// ==========================================
// 1. Authentication Routes
// ==========================================
if ($uri === '/api/auth/client-login' && $method === 'POST') {
    AuthController::clientLogin();
}
if ($uri === '/api/auth/dev-login' && $method === 'POST') {
    AuthController::devLogin();
}
if ($uri === '/api/auth/session' && $method === 'GET') {
    AuthController::getSession();
}
if ($uri === '/api/auth/logout' && $method === 'POST') {
    AuthController::logout();
}

// ==========================================
// 2. Public Read Endpoints
// ==========================================
if ($uri === '/api/public/homepage' && $method === 'GET') {
    PublicController::getHomepage();
}
if ($uri === '/api/public/settings' && $method === 'GET') {
    PublicController::getSettings();
}
if ($uri === '/api/public/services' && $method === 'GET') {
    PublicController::getServices();
}
if (preg_match('#^/api/public/services/([a-zA-Z0-9_-]+)$#', $uri, $matches) && $method === 'GET') {
    PublicController::getServiceBySlug($matches[1]);
}
if ($uri === '/api/public/projects' && $method === 'GET') {
    PublicController::getProjects($_GET['category'] ?? null);
}
if (preg_match('#^/api/public/projects/([a-zA-Z0-9_-]+)$#', $uri, $matches) && $method === 'GET') {
    PublicController::getProjectBySlug($matches[1]);
}
if ($uri === '/api/public/journal' && $method === 'GET') {
    PublicController::getJournalArticles();
}
if (preg_match('#^/api/public/journal/([a-zA-Z0-9_-]+)$#', $uri, $matches) && $method === 'GET') {
    PublicController::getJournalArticleBySlug($matches[1]);
}
if ($uri === '/api/public/enquiry' && $method === 'POST') {
    EnquiryController::submit();
}
if (($uri === '/api/public/sitemap.xml' || $uri === '/sitemap.xml') && $method === 'GET') {
    PublicController::getSitemap();
}

// ==========================================
// 3. Client Admin CMS Routes (/api/cms/...)
// ==========================================
if ($uri === '/api/cms/dashboard' && $method === 'GET') {
    CmsController::getDashboardStats();
}
if ($uri === '/api/cms/homepage-sections' && $method === 'GET') {
    CmsController::getHomepageSections();
}
if (preg_match('#^/api/cms/homepage-sections/(\d+)$#', $uri, $matches) && $method === 'PUT') {
    CmsController::updateHomepageSection((int)$matches[1]);
}
if ($uri === '/api/cms/services' && $method === 'GET') {
    CmsController::getServices();
}
if ($uri === '/api/cms/services' && $method === 'POST') {
    CmsController::saveService();
}
if (preg_match('#^/api/cms/services/(\d+)$#', $uri, $matches) && $method === 'PUT') {
    CmsController::saveService((int)$matches[1]);
}
if (preg_match('#^/api/cms/services/(\d+)$#', $uri, $matches) && $method === 'DELETE') {
    CmsController::deleteService((int)$matches[1]);
}
if ($uri === '/api/cms/projects' && $method === 'GET') {
    CmsController::getProjects();
}
if ($uri === '/api/cms/projects' && $method === 'POST') {
    CmsController::saveProject();
}
if (preg_match('#^/api/cms/projects/(\d+)$#', $uri, $matches) && $method === 'PUT') {
    CmsController::saveProject((int)$matches[1]);
}
if (preg_match('#^/api/cms/projects/(\d+)$#', $uri, $matches) && $method === 'DELETE') {
    CmsController::deleteProject((int)$matches[1]);
}
if ($uri === '/api/cms/journal' && $method === 'GET') {
    CmsController::getJournalArticles();
}
if ($uri === '/api/cms/journal' && $method === 'POST') {
    CmsController::saveJournalArticle();
}
if (preg_match('#^/api/cms/journal/(\d+)$#', $uri, $matches) && $method === 'PUT') {
    CmsController::saveJournalArticle((int)$matches[1]);
}
if (preg_match('#^/api/cms/journal/(\d+)$#', $uri, $matches) && $method === 'DELETE') {
    CmsController::deleteJournalArticle((int)$matches[1]);
}
if ($uri === '/api/cms/settings' && $method === 'POST') {
    CmsController::updateSiteSettings();
}
if ($uri === '/api/cms/enquiries' && $method === 'GET') {
    EnquiryController::index();
}
if (preg_match('#^/api/cms/enquiries/(\d+)$#', $uri, $matches) && $method === 'PUT') {
    EnquiryController::update((int)$matches[1]);
}
if (preg_match('#^/api/cms/enquiries/(\d+)$#', $uri, $matches) && $method === 'DELETE') {
    EnquiryController::delete((int)$matches[1]);
}
if ($uri === '/api/cms/media' && $method === 'GET') {
    MediaController::index();
}
if ($uri === '/api/cms/media/upload' && $method === 'POST') {
    MediaController::upload();
}
if (preg_match('#^/api/cms/media/(\d+)$#', $uri, $matches) && $method === 'PUT') {
    MediaController::update((int)$matches[1]);
}
if (preg_match('#^/api/cms/media/(\d+)$#', $uri, $matches) && $method === 'DELETE') {
    MediaController::delete((int)$matches[1]);
}

// ==========================================
// 4. Developer Portal Routes (/api/dev/...)
// ==========================================
if ($uri === '/api/dev/health' && $method === 'GET') {
    DevController::getHealth();
}
if ($uri === '/api/dev/database' && $method === 'GET') {
    DevController::getDatabaseStats();
}
if ($uri === '/api/dev/logs' && $method === 'GET') {
    DevController::getErrorLogs();
}
if ($uri === '/api/dev/logs/clear' && $method === 'POST') {
    DevController::clearErrorLogs();
}
if ($uri === '/api/dev/accounts' && $method === 'GET') {
    DevController::getAccounts();
}
if ($uri === '/api/dev/accounts' && $method === 'POST') {
    DevController::saveAccount();
}
if (preg_match('#^/api/dev/accounts/(\d+)$#', $uri, $matches) && $method === 'PUT') {
    DevController::saveAccount((int)$matches[1]);
}
if (preg_match('#^/api/dev/accounts/(\d+)$#', $uri, $matches) && $method === 'DELETE') {
    DevController::deleteAccount((int)$matches[1]);
}
if ($uri === '/api/dev/sessions' && $method === 'GET') {
    DevController::getSessions();
}
if (preg_match('#^/api/dev/sessions/([a-zA-Z0-9_-]+)$#', $uri, $matches) && $method === 'DELETE') {
    DevController::revokeSession($matches[1]);
}
if ($uri === '/api/dev/audit-logs' && $method === 'GET') {
    DevController::getAuditLogs();
}
if ($uri === '/api/dev/backup/export' && $method === 'GET') {
    DevController::exportBackup();
}
if ($uri === '/api/dev/maintenance' && $method === 'GET') {
    DevController::getMaintenanceStatus();
}
if ($uri === '/api/dev/maintenance' && $method === 'POST') {
    DevController::updateMaintenanceStatus();
}

// Fallback: 404
Response::notFound("Endpoint {$method} {$uri} does not exist");
