<?php
/**
 * WROP Interior Public Data Controller
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Response.php';

class PublicController {
    public static function getHomepage(): void {
        $db = getDatabaseConnection();

        // 1. Get visible homepage sections
        $secStmt = $db->query("SELECT section_key, title, subtitle, content, settings_json, sort_order FROM homepage_sections WHERE is_visible = 1 ORDER BY sort_order ASC");
        $sectionsRaw = $secStmt->fetchAll();
        $sections = [];
        foreach ($sectionsRaw as $sec) {
            $sections[$sec['section_key']] = [
                'key' => $sec['section_key'],
                'title' => $sec['title'],
                'subtitle' => $sec['subtitle'],
                'content' => $sec['content'],
                'settings' => !empty($sec['settings_json']) ? json_decode($sec['settings_json'], true) : [],
                'sort_order' => (int)$sec['sort_order']
            ];
        }

        // 2. Get featured services
        $srvStmt = $db->query("SELECT id, title, slug, category, short_description, featured_image, features_json FROM services WHERE is_published = 1 ORDER BY sort_order ASC LIMIT 6");
        $services = array_map(function($srv) {
            $srv['features'] = !empty($srv['features_json']) ? json_decode($srv['features_json'], true) : [];
            unset($srv['features_json']);
            return $srv;
        }, $srvStmt->fetchAll());

        // 3. Get featured projects (Marked as demo/concept studies)
        $prjStmt = $db->query("SELECT id, title, slug, category, location, is_demo, short_description, featured_image, gallery_json FROM projects WHERE is_published = 1 AND is_featured = 1 ORDER BY sort_order ASC LIMIT 4");
        $projects = array_map(function($prj) {
            $prj['gallery'] = !empty($prj['gallery_json']) ? json_decode($prj['gallery_json'], true) : [];
            unset($prj['gallery_json']);
            return $prj;
        }, $prjStmt->fetchAll());

        // 4. Get recent journal articles
        $jStmt = $db->query("SELECT id, title, slug, category, excerpt, featured_image, read_time, published_at FROM journal_articles WHERE is_published = 1 ORDER BY created_at DESC LIMIT 3");
        $articles = $jStmt->fetchAll();

        // 5. Site settings
        $stgStmt = $db->query("SELECT key, value FROM site_settings");
        $settings = $stgStmt->fetchAll(PDO::FETCH_KEY_PAIR);

        Response::json([
            'sections' => $sections,
            'featured_services' => $services,
            'featured_projects' => $projects,
            'recent_articles' => $articles,
            'settings' => $settings
        ]);
    }

    public static function getSettings(): void {
        $db = getDatabaseConnection();
        $stmt = $db->query("SELECT key, value FROM site_settings");
        Response::json($stmt->fetchAll(PDO::FETCH_KEY_PAIR));
    }

    public static function getServices(): void {
        $db = getDatabaseConnection();
        $stmt = $db->query("SELECT id, title, slug, category, short_description, full_description, featured_image, features_json, sort_order FROM services WHERE is_published = 1 ORDER BY sort_order ASC");
        $services = array_map(function($s) {
            $s['features'] = !empty($s['features_json']) ? json_decode($s['features_json'], true) : [];
            unset($s['features_json']);
            return $s;
        }, $stmt->fetchAll());
        Response::json($services);
    }

    public static function getServiceBySlug(string $slug): void {
        $db = getDatabaseConnection();
        $stmt = $db->prepare("SELECT * FROM services WHERE slug = ? AND is_published = 1 LIMIT 1");
        $stmt->execute([$slug]);
        $service = $stmt->fetch();

        if (!$service) {
            Response::notFound('Service not found');
        }

        $service['features'] = !empty($service['features_json']) ? json_decode($service['features_json'], true) : [];
        unset($service['features_json']);

        // Related projects in this category
        $pStmt = $db->prepare("SELECT id, title, slug, category, location, is_demo, short_description, featured_image FROM projects WHERE is_published = 1 LIMIT 3");
        $relatedProjects = $pStmt->fetchAll();

        Response::json([
            'service' => $service,
            'related_projects' => $relatedProjects
        ]);
    }

    public static function getProjects(?string $category = null): void {
        $db = getDatabaseConnection();
        $sql = "SELECT id, title, slug, category, location, is_demo, short_description, featured_image, is_featured, sort_order FROM projects WHERE is_published = 1";
        $params = [];

        if (!empty($category) && $category !== 'All') {
            $sql .= " AND category = ?";
            $params[] = $category;
        }

        $sql .= " ORDER BY sort_order ASC, created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        Response::json($stmt->fetchAll());
    }

    public static function getProjectBySlug(string $slug): void {
        $db = getDatabaseConnection();
        $stmt = $db->prepare("SELECT * FROM projects WHERE slug = ? AND is_published = 1 LIMIT 1");
        $stmt->execute([$slug]);
        $project = $stmt->fetch();

        if (!$project) {
            Response::notFound('Project not found');
        }

        $project['gallery'] = !empty($project['gallery_json']) ? json_decode($project['gallery_json'], true) : [];
        unset($project['gallery_json']);

        // Related projects
        $rStmt = $db->prepare("SELECT id, title, slug, category, location, is_demo, short_description, featured_image FROM projects WHERE slug != ? AND is_published = 1 ORDER BY sort_order ASC LIMIT 3");
        $rStmt->execute([$slug]);
        $related = $rStmt->fetchAll();

        Response::json([
            'project' => $project,
            'related' => $related
        ]);
    }

    public static function getJournalArticles(): void {
        $db = getDatabaseConnection();
        $stmt = $db->query("SELECT id, title, slug, category, excerpt, featured_image, read_time, published_at FROM journal_articles WHERE is_published = 1 ORDER BY created_at DESC");
        Response::json($stmt->fetchAll());
    }

    public static function getJournalArticleBySlug(string $slug): void {
        $db = getDatabaseConnection();
        $stmt = $db->prepare("SELECT * FROM journal_articles WHERE slug = ? AND is_published = 1 LIMIT 1");
        $stmt->execute([$slug]);
        $article = $stmt->fetch();

        if (!$article) {
            Response::notFound('Article not found');
        }

        // Related articles
        $rStmt = $db->prepare("SELECT id, title, slug, category, excerpt, featured_image, read_time FROM journal_articles WHERE slug != ? AND is_published = 1 LIMIT 2");
        $rStmt->execute([$slug]);
        $related = $rStmt->fetchAll();

        Response::json([
            'article' => $article,
            'related' => $related
        ]);
    }

    public static function getSitemap(): void {
        $db = getDatabaseConnection();
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticPages = [
            '',
            'about',
            'services',
            'projects',
            'residential',
            'commercial',
            'process',
            'journal',
            'contact',
            'privacy',
            'terms'
        ];

        header('Content-Type: application/xml; charset=utf-8');
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($staticPages as $p) {
            $loc = $baseUrl . ($p === '' ? '/' : '/' . $p);
            echo "  <url>\n    <loc>{$loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>" . ($p === '' ? '1.0' : '0.8') . "</priority>\n  </url>\n";
        }

        // Services
        $services = $db->query("SELECT slug, updated_at FROM services WHERE is_published = 1")->fetchAll();
        foreach ($services as $s) {
            $loc = "{$baseUrl}/services/{$s['slug']}";
            echo "  <url>\n    <loc>{$loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n";
        }

        // Projects
        $projects = $db->query("SELECT slug, updated_at FROM projects WHERE is_published = 1")->fetchAll();
        foreach ($projects as $pr) {
            $loc = "{$baseUrl}/projects/{$pr['slug']}";
            echo "  <url>\n    <loc>{$loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n";
        }

        // Journal
        $articles = $db->query("SELECT slug, updated_at FROM journal_articles WHERE is_published = 1")->fetchAll();
        foreach ($articles as $a) {
            $loc = "{$baseUrl}/journal/{$a['slug']}";
            echo "  <url>\n    <loc>{$loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n";
        }

        echo '</urlset>';
        exit;
    }
}
