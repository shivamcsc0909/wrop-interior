<?php
/**
 * WROP Interior Maintenance Mode Middleware
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/auth.php';

class MaintenanceMiddleware {
    public static function check(): void {
        try {
            $db = getDatabaseConnection();
            $stmt = $db->query("SELECT key, value FROM system_settings WHERE key IN ('maintenance_mode', 'maintenance_message', 'maintenance_bypass_key')");
            $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

            $isMaintenance = ($settings['maintenance_mode'] ?? '0') === '1';
            if (!$isMaintenance) {
                return;
            }

            // Developer admin session bypasses maintenance mode
            $currentUser = AuthMiddleware::getCurrentUser();
            if ($currentUser && $currentUser['role'] === 'DEVELOPER_ADMIN') {
                return;
            }

            // Check bypass token from header or query param
            $bypassKey = $settings['maintenance_bypass_key'] ?? '';
            $headerKey = $_SERVER['HTTP_X_MAINTENANCE_BYPASS'] ?? '';
            $queryKey = $_GET['bypass_key'] ?? '';

            if (!empty($bypassKey) && (hash_equals($bypassKey, $headerKey) || hash_equals($bypassKey, $queryKey))) {
                return;
            }

            // Allow developer login endpoints even during maintenance mode
            $uri = $_SERVER['REQUEST_URI'] ?? '';
            if (str_contains($uri, '/api/auth/dev-login') || str_contains($uri, '/api/auth/session') || str_contains($uri, '/api/dev/')) {
                return;
            }

            $message = $settings['maintenance_message'] ?? 'Platform is currently undergoing scheduled maintenance.';
            Response::error($message, 503, ['maintenance_mode' => true]);

        } catch (Throwable $e) {
            // If checking settings fails, do not block
            error_log("Maintenance check failed: " . $e->getMessage());
        }
    }
}
