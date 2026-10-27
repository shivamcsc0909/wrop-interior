<?php
/**
 * WROP Interior Client Admin CMS Controller
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../utils/Logger.php';
require_once __DIR__ . '/../middleware/auth.php';

class CmsController {
    // 1. Dashboard summary
    public static function getDashboardStats(): void {
        AuthMiddleware::requireClientAdmin();
        $db = getDatabaseConnection();

        $enquiriesTotal = (int)$db->query("SELECT COUNT(*) FROM enquiries")->fetchColumn();
        $enquiriesNew = (int)$db->query("SELECT COUNT(*) FROM enquiries WHERE status = 'new'")->fetchColumn();
        $projectsTotal = (int)$db->query("SELECT COUNT(*) FROM projects")->fetchColumn();
        $servicesTotal = (int)$db->query("SELECT COUNT(*) FROM services")->fetchColumn();
        $journalTotal = (int)$db->query("SELECT COUNT(*) FROM journal_articles")->fetchColumn();
        $mediaTotal = (int)$db->query("SELECT COUNT(*) FROM media_items")->fetchColumn();

        $recentEnquiries = $db->query("SELECT id, name, email, phone, project_type, status, created_at FROM enquiries ORDER BY created_at DESC LIMIT 5")->fetchAll();

        Response::json([
            'metrics' => [
                'total_enquiries' => $enquiriesTotal,
                'new_enquiries' => $enquiriesNew,
                'total_projects' => $projectsTotal,
                'total_services' => $servicesTotal,
                'total_articles' => $journalTotal,
                'total_media' => $mediaTotal
            ],
            'recent_enquiries' => $recentEnquiries
        ]);
    }

    // 2. Homepage Sections CRUD
    public static function getHomepageSections(): void {
        AuthMiddleware::requireClientAdmin();
        $db = getDatabaseConnection();
        $stmt = $db->query("SELECT * FROM homepage_sections ORDER BY sort_order ASC");
        $sections = array_map(function($sec) {
            $sec['settings'] = !empty($sec['settings_json']) ? json_decode($sec['settings_json'], true) : [];
            return $sec;
        }, $stmt->fetchAll());
        Response::json($sections);
    }

    public static function updateHomepageSection(int $id): void {
        $user = AuthMiddleware::requireClientAdmin();
        $input = Validator::getJsonInput();

        $title = trim($input['title'] ?? '');
        $subtitle = trim($input['subtitle'] ?? '');
        $content = trim($input['content'] ?? '');
        $settingsJson = isset($input['settings']) ? json_encode($input['settings']) : ($input['settings_json'] ?? '{}');
        $sortOrder = (int)($input['sort_order'] ?? 0);
        $isVisible = !empty($input['is_visible']) ? 1 : 0;

        $db = getDatabaseConnection();
        $stmt = $db->prepare("
            UPDATE homepage_sections 
            SET title = ?, subtitle = ?, content = ?, settings_json = ?, sort_order = ?, is_visible = ?, updated_at = datetime('now')
            WHERE id = ?
        ");
        if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
            $stmt = $db->prepare("
                UPDATE homepage_sections 
                SET title = ?, subtitle = ?, content = ?, settings_json = ?, sort_order = ?, is_visible = ?, updated_at = NOW()
                WHERE id = ?
            ");
        }
        $stmt->execute([$title, $subtitle, $content, $settingsJson, $sortOrder, $isVisible, $id]);

        Logger::logAudit('UPDATE_HOMEPAGE_SECTION', "Updated section ID {$id}", $user['id'], $user['username'], $user['role']);

        Response::json(null, 200, 'Homepage section updated');
    }

    // 3. Services Management
    public static function getServices(): void {
        AuthMiddleware::requireClientAdmin();
        $db = getDatabaseConnection();
        $stmt = $db->query("SELECT * FROM services ORDER BY sort_order ASC");
        $services = array_map(function($s) {
            $s['features'] = !empty($s['features_json']) ? json_decode($s['features_json'], true) : [];
            return $s;
        }, $stmt->fetchAll());
        Response::json($services);
    }

    public static function saveService(?int $id = null): void {
        $user = AuthMiddleware::requireClientAdmin();
        $input = Validator::getJsonInput();

        $title = trim($input['title'] ?? '');
        $category = trim($input['category'] ?? 'Residential');
        $shortDesc = trim($input['short_description'] ?? '');
        $fullDesc = trim($input['full_description'] ?? '');
        $featuredImage = trim($input['featured_image'] ?? '');
        $featuresJson = isset($input['features']) ? json_encode($input['features']) : ($input['features_json'] ?? '[]');
        $sortOrder = (int)($input['sort_order'] ?? 0);
        $isPublished = !empty($input['is_published']) ? 1 : 0;
        $seoTitle = trim($input['seo_title'] ?? '');
        $seoDesc = trim($input['seo_description'] ?? '');

        if (empty($title)) {
            Response::error('Service title is required', 422);
        }

        $slug = !empty($input['slug']) ? Validator::slugify($input['slug']) : Validator::slugify($title);
        $db = getDatabaseConnection();

        if ($id) {
            $stmt = $db->prepare("
                UPDATE services 
                SET title = ?, slug = ?, category = ?, short_description = ?, full_description = ?, featured_image = ?, features_json = ?, sort_order = ?, is_published = ?, seo_title = ?, seo_description = ?, updated_at = datetime('now')
                WHERE id = ?
            ");
            $stmt->execute([$title, $slug, $category, $shortDesc, $fullDesc, $featuredImage, $featuresJson, $sortOrder, $isPublished, $seoTitle, $seoDesc, $id]);
            Logger::logAudit('UPDATE_SERVICE', "Updated service '{$title}' (#{$id})", $user['id'], $user['username'], $user['role']);
            Response::json(['id' => $id], 200, 'Service updated successfully');
        } else {
            $stmt = $db->prepare("
                INSERT INTO services (title, slug, category, short_description, full_description, featured_image, features_json, sort_order, is_published, seo_title, seo_description, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            ");
            $stmt->execute([$title, $slug, $category, $shortDesc, $fullDesc, $featuredImage, $featuresJson, $sortOrder, $isPublished, $seoTitle, $seoDesc]);
            $newId = (int)$db->lastInsertId();
            Logger::logAudit('CREATE_SERVICE', "Created service '{$title}' (#{$newId})", $user['id'], $user['username'], $user['role']);
            Response::json(['id' => $newId], 201, 'Service created successfully');
        }
    }

    public static function deleteService(int $id): void {
        $user = AuthMiddleware::requireClientAdmin();
        $db = getDatabaseConnection();
        $db->prepare("DELETE FROM services WHERE id = ?")->execute([$id]);
        Logger::logAudit('DELETE_SERVICE', "Deleted service #{$id}", $user['id'], $user['username'], $user['role']);
        Response::json(null, 200, 'Service deleted');
    }

    // 4. Projects Management
    public static function getProjects(): void {
        AuthMiddleware::requireClientAdmin();
        $db = getDatabaseConnection();
        $stmt = $db->query("SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC");
        $projects = array_map(function($p) {
            $p['gallery'] = !empty($p['gallery_json']) ? json_decode($p['gallery_json'], true) : [];
            return $p;
        }, $stmt->fetchAll());
        Response::json($projects);
    }

    public static function saveProject(?int $id = null): void {
        $user = AuthMiddleware::requireClientAdmin();
        $input = Validator::getJsonInput();

        $title = trim($input['title'] ?? '');
        $category = trim($input['category'] ?? 'Residential');
        $location = trim($input['location'] ?? '');
        $isDemo = isset($input['is_demo']) ? ((int)$input['is_demo'] ? 1 : 0) : 1;
        $shortDesc = trim($input['short_description'] ?? '');
        $fullDesc = trim($input['full_description'] ?? '');
        $concept = trim($input['concept'] ?? '');
        $materials = trim($input['materials_finishes'] ?? '');
        $scope = trim($input['scope'] ?? '');
        $featuredImage = trim($input['featured_image'] ?? '');
        $galleryJson = isset($input['gallery']) ? json_encode($input['gallery']) : ($input['gallery_json'] ?? '[]');
        $isFeatured = !empty($input['is_featured']) ? 1 : 0;
        $sortOrder = (int)($input['sort_order'] ?? 0);
        $isPublished = !empty($input['is_published']) ? 1 : 0;
        $seoTitle = trim($input['seo_title'] ?? '');
        $seoDesc = trim($input['seo_description'] ?? '');

        if (empty($title)) {
            Response::error('Project title is required', 422);
        }

        $slug = !empty($input['slug']) ? Validator::slugify($input['slug']) : Validator::slugify($title);
        $db = getDatabaseConnection();

        if ($id) {
            $stmt = $db->prepare("
                UPDATE projects 
                SET title = ?, slug = ?, category = ?, location = ?, is_demo = ?, short_description = ?, full_description = ?, concept = ?, materials_finishes = ?, scope = ?, featured_image = ?, gallery_json = ?, is_featured = ?, sort_order = ?, is_published = ?, seo_title = ?, seo_description = ?, updated_at = datetime('now')
                WHERE id = ?
            ");
            $stmt->execute([$title, $slug, $category, $location, $isDemo, $shortDesc, $fullDesc, $concept, $materials, $scope, $featuredImage, $galleryJson, $isFeatured, $sortOrder, $isPublished, $seoTitle, $seoDesc, $id]);
            Logger::logAudit('UPDATE_PROJECT', "Updated project '{$title}' (#{$id})", $user['id'], $user['username'], $user['role']);
            Response::json(['id' => $id], 200, 'Project updated successfully');
        } else {
            $stmt = $db->prepare("
                INSERT INTO projects (title, slug, category, location, is_demo, short_description, full_description, concept, materials_finishes, scope, featured_image, gallery_json, is_featured, sort_order, is_published, seo_title, seo_description, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            ");
            $stmt->execute([$title, $slug, $category, $location, $isDemo, $shortDesc, $fullDesc, $concept, $materials, $scope, $featuredImage, $galleryJson, $isFeatured, $sortOrder, $isPublished, $seoTitle, $seoDesc]);
            $newId = (int)$db->lastInsertId();
            Logger::logAudit('CREATE_PROJECT', "Created project '{$title}' (#{$newId})", $user['id'], $user['username'], $user['role']);
            Response::json(['id' => $newId], 201, 'Project created successfully');
        }
    }

    public static function deleteProject(int $id): void {
        $user = AuthMiddleware::requireClientAdmin();
        $db = getDatabaseConnection();
        $db->prepare("DELETE FROM projects WHERE id = ?")->execute([$id]);
        Logger::logAudit('DELETE_PROJECT', "Deleted project #{$id}", $user['id'], $user['username'], $user['role']);
        Response::json(null, 200, 'Project deleted');
    }

    // 5. Journal Management
    public static function getJournalArticles(): void {
        AuthMiddleware::requireClientAdmin();
        $db = getDatabaseConnection();
        $stmt = $db->query("SELECT * FROM journal_articles ORDER BY created_at DESC");
        Response::json($stmt->fetchAll());
    }

    public static function saveJournalArticle(?int $id = null): void {
        $user = AuthMiddleware::requireClientAdmin();
        $input = Validator::getJsonInput();

        $title = trim($input['title'] ?? '');
        $category = trim($input['category'] ?? 'Design Theory');
        $excerpt = trim($input['excerpt'] ?? '');
        $content = trim($input['content'] ?? '');
        $featuredImage = trim($input['featured_image'] ?? '');
        $readTime = trim($input['read_time'] ?? '5 min read');
        $isPublished = !empty($input['is_published']) ? 1 : 0;
        $seoTitle = trim($input['seo_title'] ?? '');
        $seoDesc = trim($input['seo_description'] ?? '');

        if (empty($title)) {
            Response::error('Article title is required', 422);
        }

        $slug = !empty($input['slug']) ? Validator::slugify($input['slug']) : Validator::slugify($title);
        $db = getDatabaseConnection();

        if ($id) {
            $stmt = $db->prepare("
                UPDATE journal_articles 
                SET title = ?, slug = ?, category = ?, excerpt = ?, content = ?, featured_image = ?, read_time = ?, is_published = ?, seo_title = ?, seo_description = ?, updated_at = datetime('now')
                WHERE id = ?
            ");
            $stmt->execute([$title, $slug, $category, $excerpt, $content, $featuredImage, $readTime, $isPublished, $seoTitle, $seoDesc, $id]);
            Logger::logAudit('UPDATE_ARTICLE', "Updated article '{$title}' (#{$id})", $user['id'], $user['username'], $user['role']);
            Response::json(['id' => $id], 200, 'Article updated');
        } else {
            $stmt = $db->prepare("
                INSERT INTO journal_articles (title, slug, category, excerpt, content, featured_image, read_time, is_published, published_at, seo_title, seo_description, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, datetime('now'), datetime('now'))
            ");
            $stmt->execute([$title, $slug, $category, $excerpt, $content, $featuredImage, $readTime, $isPublished, $seoTitle, $seoDesc]);
            $newId = (int)$db->lastInsertId();
            Logger::logAudit('CREATE_ARTICLE', "Created article '{$title}' (#{$newId})", $user['id'], $user['username'], $user['role']);
            Response::json(['id' => $newId], 201, 'Article published');
        }
    }

    public static function deleteJournalArticle(int $id): void {
        $user = AuthMiddleware::requireClientAdmin();
        $db = getDatabaseConnection();
        $db->prepare("DELETE FROM journal_articles WHERE id = ?")->execute([$id]);
        Logger::logAudit('DELETE_ARTICLE', "Deleted article #{$id}", $user['id'], $user['username'], $user['role']);
        Response::json(null, 200, 'Article deleted');
    }

    // 6. Global Site Settings
    public static function updateSiteSettings(): void {
        $user = AuthMiddleware::requireClientAdmin();
        $input = Validator::getJsonInput();

        $db = getDatabaseConnection();
        $stmt = $db->prepare("INSERT OR REPLACE INTO site_settings (key, value, type, updated_at) VALUES (?, ?, 'string', datetime('now'))");
        if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
            $stmt = $db->prepare("INSERT INTO site_settings (`key`, `value`, `type`) VALUES (?, ?, 'string') ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), updated_at = NOW()");
        }

        foreach ($input as $k => $v) {
            if (is_string($v)) {
                $stmt->execute([$k, $v]);
            }
        }

        Logger::logAudit('UPDATE_SITE_SETTINGS', "Updated global site settings", $user['id'], $user['username'], $user['role']);
        Response::json(null, 200, 'Site settings updated');
    }
}
