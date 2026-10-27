<?php
/**
 * WROP Interior Developer Portal Controller
 * Strictly restricted to DEVELOPER_ADMIN role.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../utils/Logger.php';
require_once __DIR__ . '/../middleware/auth.php';

class DevController {
    // 1. System Health Monitoring
    public static function getHealth(): void {
        AuthMiddleware::requireDeveloperAdmin();
        
        $db = getDatabaseConnection();
        $dbStatus = 'OK';
        $dbLatencyMs = 0;
        try {
            $start = microtime(true);
            $db->query("SELECT 1")->fetch();
            $dbLatencyMs = round((microtime(true) - $start) * 1000, 2);
        } catch (Throwable $e) {
            $dbStatus = 'ERROR: ' . $e->getMessage();
        }

        $freeDisk = disk_free_space(__DIR__);
        $totalDisk = disk_total_space(__DIR__);

        $health = [
            'status' => 'HEALTHY',
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'PHP CLI / Built-in',
            'os' => PHP_OS . ' (' . php_uname('m') . ')',
            'memory_usage_mb' => round(memory_get_usage(true) / 1024 / 1024, 2),
            'memory_limit' => ini_get('memory_limit'),
            'max_execution_time' => ini_get('max_execution_time') . 's',
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
            'opcache_enabled' => function_exists('opcache_get_status') && !empty(opcache_get_status()['opcache_enabled']),
            'loaded_extensions' => [
                'pdo' => extension_loaded('pdo'),
                'pdo_mysql' => extension_loaded('pdo_mysql'),
                'pdo_sqlite' => extension_loaded('pdo_sqlite'),
                'mbstring' => extension_loaded('mbstring'),
                'curl' => extension_loaded('curl'),
                'gd' => extension_loaded('gd'),
                'fileinfo' => extension_loaded('fileinfo'),
            ],
            'database' => [
                'status' => $dbStatus,
                'driver' => $db->getAttribute(PDO::ATTR_DRIVER_NAME),
                'latency_ms' => $dbLatencyMs
            ],
            'disk_storage' => [
                'free_gb' => $freeDisk ? round($freeDisk / 1024 / 1024 / 1024, 2) : 'N/A',
                'total_gb' => $totalDisk ? round($totalDisk / 1024 / 1024 / 1024, 2) : 'N/A',
                'used_percent' => ($freeDisk && $totalDisk) ? round((1 - ($freeDisk / $totalDisk)) * 100, 1) : 'N/A'
            ],
            'time' => date('Y-m-d H:i:s T')
        ];

        Response::json($health);
    }

    // 2. Database Status & Diagnostics
    public static function getDatabaseStats(): void {
        AuthMiddleware::requireDeveloperAdmin();
        $db = getDatabaseConnection();
        $driver = $db->getAttribute(PDO::ATTR_DRIVER_NAME);

        $tables = ['users', 'sessions', 'site_settings', 'homepage_sections', 'services', 'projects', 'journal_articles', 'enquiries', 'media_items', 'audit_logs', 'system_settings'];
        $stats = [];

        foreach ($tables as $table) {
            try {
                $count = (int)$db->query("SELECT COUNT(*) FROM {$table}")->fetchColumn();
                $stats[] = [
                    'table' => $table,
                    'rows' => $count
                ];
            } catch (Throwable) {
                $stats[] = ['table' => $table, 'rows' => 'N/A'];
            }
        }

        Response::json([
            'driver' => $driver,
            'tables' => $stats
        ]);
    }

    // 3. Error Log Viewer
    public static function getErrorLogs(): void {
        AuthMiddleware::requireDeveloperAdmin();
        $logFile = __DIR__ . '/../../logs/error.log';
        $lines = [];

        if (file_exists($logFile)) {
            $content = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            $lines = array_slice($content ?: [], -100); // Last 100 lines
            $lines = array_reverse($lines);
        }

        Response::json(['logs' => $lines]);
    }

    public static function clearErrorLogs(): void {
        $user = AuthMiddleware::requireDeveloperAdmin();
        $logFile = __DIR__ . '/../../logs/error.log';
        if (file_exists($logFile)) {
            @file_put_contents($logFile, '');
        }
        Logger::logAudit('CLEAR_ERROR_LOGS', "Cleared backend error logs", $user['id'], $user['username'], $user['role']);
        Response::json(null, 200, 'Error logs cleared');
    }

    // 4. Administrator Account Management
    public static function getAccounts(): void {
        AuthMiddleware::requireDeveloperAdmin();
        $db = getDatabaseConnection();
        $stmt = $db->query("SELECT id, username, email, role, full_name, is_active, last_login_at, created_at FROM users ORDER BY id ASC");
        Response::json($stmt->fetchAll());
    }

    public static function saveAccount(?int $id = null): void {
        $dev = AuthMiddleware::requireDeveloperAdmin();
        $input = Validator::getJsonInput();

        $username = trim($input['username'] ?? '');
        $email = trim($input['email'] ?? '');
        $role = $input['role'] ?? 'CLIENT_ADMIN';
        $fullName = trim($input['full_name'] ?? '');
        $isActive = isset($input['is_active']) ? ((int)$input['is_active'] ? 1 : 0) : 1;
        $password = $input['password'] ?? '';

        if (!in_array($role, ['CLIENT_ADMIN', 'DEVELOPER_ADMIN'], true)) {
            Response::error('Invalid account role', 422);
        }
        if (empty($username) || empty($email) || empty($fullName)) {
            Response::error('Username, email, and full name are required', 422);
        }

        $db = getDatabaseConnection();

        if ($id) {
            // Update
            $sql = "UPDATE users SET username = ?, email = ?, role = ?, full_name = ?, is_active = ?, updated_at = datetime('now')";
            $params = [$username, $email, $role, $fullName, $isActive];

            if (!empty($password)) {
                if (strlen($password) < 8) {
                    Response::error('Password must be at least 8 characters', 422);
                }
                $sql .= ", password_hash = ?";
                $params[] = password_hash($password, PASSWORD_BCRYPT);
            }

            $sql .= " WHERE id = ?";
            $params[] = $id;

            $stmt = $db->prepare($sql);
            $stmt->execute($params);

            Logger::logAudit('UPDATE_ADMIN_ACCOUNT', "Updated account: {$username} ({$role})", $dev['id'], $dev['username'], $dev['role']);
            Response::json(['id' => $id], 200, 'Account updated successfully');
        } else {
            // Create
            if (empty($password) || strlen($password) < 8) {
                Response::error('Password must be at least 8 characters', 422);
            }

            $hash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $db->prepare("
                INSERT INTO users (username, email, password_hash, role, full_name, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            ");
            $stmt->execute([$username, $email, $hash, $role, $fullName, $isActive]);
            $newId = (int)$db->lastInsertId();

            Logger::logAudit('CREATE_ADMIN_ACCOUNT', "Created account: {$username} ({$role})", $dev['id'], $dev['username'], $dev['role']);
            Response::json(['id' => $newId], 201, 'Account created successfully');
        }
    }

    public static function deleteAccount(int $id): void {
        $dev = AuthMiddleware::requireDeveloperAdmin();
        if ($dev['id'] === $id) {
            Response::forbidden('Cannot delete your own developer account');
        }

        $db = getDatabaseConnection();
        $db->prepare("DELETE FROM users WHERE id = ?")->execute([$id]);
        Logger::logAudit('DELETE_ADMIN_ACCOUNT', "Deleted account ID {$id}", $dev['id'], $dev['username'], $dev['role']);
        Response::json(null, 200, 'Account deleted');
    }

    // 5. Session Revocation
    public static function getSessions(): void {
        AuthMiddleware::requireDeveloperAdmin();
        $db = getDatabaseConnection();
        $stmt = $db->query("
            SELECT s.id, s.user_id, s.ip_address, s.user_agent, s.last_activity, s.created_at, u.username, u.role, u.full_name
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.last_activity DESC
        ");
        Response::json($stmt->fetchAll());
    }

    public static function revokeSession(string $sessionId): void {
        $dev = AuthMiddleware::requireDeveloperAdmin();
        $db = getDatabaseConnection();
        $db->prepare("DELETE FROM sessions WHERE id = ?")->execute([$sessionId]);
        Logger::logAudit('REVOKE_SESSION', "Revoked session: {$sessionId}", $dev['id'], $dev['username'], $dev['role']);
        Response::json(null, 200, 'Session revoked');
    }

    // 6. Security Audit Logs
    public static function getAuditLogs(): void {
        AuthMiddleware::requireDeveloperAdmin();
        $db = getDatabaseConnection();

        $action = $_GET['action'] ?? null;
        $sql = "SELECT * FROM audit_logs";
        $params = [];

        if (!empty($action) && $action !== 'all') {
            $sql .= " WHERE action LIKE ?";
            $params[] = "%{$action}%";
        }

        $sql .= " ORDER BY created_at DESC LIMIT 200";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        Response::json($stmt->fetchAll());
    }

    // 7. Backup Workflows (Download SQL Dump)
    public static function exportBackup(): void {
        $dev = AuthMiddleware::requireDeveloperAdmin();
        $db = getDatabaseConnection();
        $driver = $db->getAttribute(PDO::ATTR_DRIVER_NAME);

        Logger::logAudit('EXPORT_BACKUP', "Initiated database backup export", $dev['id'], $dev['username'], $dev['role']);

        $filename = 'wrop_backup_' . date('Y-m-d_His') . '.sql';
        header('Content-Type: text/plain; charset=utf-8');
        header("Content-Disposition: attachment; filename=\"{$filename}\"");

        echo "-- WROP Interior Database Backup\n";
        echo "-- Export Date: " . date('Y-m-d H:i:s') . "\n";
        echo "-- Driver: " . $driver . "\n\n";

        $tables = ['site_settings', 'homepage_sections', 'services', 'projects', 'journal_articles', 'enquiries', 'media_items', 'system_settings'];
        foreach ($tables as $table) {
            try {
                $rows = $db->query("SELECT * FROM {$table}")->fetchAll(PDO::FETCH_ASSOC);
                echo "-- Table: {$table} (" . count($rows) . " rows)\n";
                foreach ($rows as $row) {
                    $keys = array_keys($row);
                    $escaped = array_map(function($v) use ($db) {
                        return $v === null ? 'NULL' : $db->quote((string)$v);
                    }, array_values($row));
                    echo "INSERT INTO {$table} (`" . implode('`, `', $keys) . "`) VALUES (" . implode(', ', $escaped) . ");\n";
                }
                echo "\n";
            } catch (Throwable $e) {
                echo "-- Error exporting {$table}: " . $e->getMessage() . "\n\n";
            }
        }
        exit;
    }

    // 8. Maintenance Mode Management
    public static function getMaintenanceStatus(): void {
        AuthMiddleware::requireDeveloperAdmin();
        $db = getDatabaseConnection();
        $stmt = $db->query("SELECT key, value FROM system_settings WHERE key IN ('maintenance_mode', 'maintenance_message', 'maintenance_bypass_key')");
        Response::json($stmt->fetchAll(PDO::FETCH_KEY_PAIR));
    }

    public static function updateMaintenanceStatus(): void {
        $dev = AuthMiddleware::requireDeveloperAdmin();
        $input = Validator::getJsonInput();

        $mode = !empty($input['maintenance_mode']) ? '1' : '0';
        $message = trim($input['maintenance_message'] ?? 'Platform under maintenance');
        $bypassKey = trim($input['maintenance_bypass_key'] ?? '');

        $db = getDatabaseConnection();
        $stmt = $db->prepare("INSERT OR REPLACE INTO system_settings (key, value, updated_at) VALUES (?, ?, datetime('now'))");
        if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
            $stmt = $db->prepare("INSERT INTO system_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)");
        }

        $stmt->execute(['maintenance_mode', $mode]);
        $stmt->execute(['maintenance_message', $message]);
        if (!empty($bypassKey)) {
            $stmt->execute(['maintenance_bypass_key', $bypassKey]);
        }

        $stateText = $mode === '1' ? 'ACTIVATED' : 'DEACTIVATED';
        Logger::logAudit('MAINTENANCE_TOGGLED', "Maintenance mode {$stateText} by developer", $dev['id'], $dev['username'], $dev['role']);

        Response::json([
            'maintenance_mode' => $mode,
            'maintenance_message' => $message,
            'maintenance_bypass_key' => $bypassKey
        ], 200, "Maintenance mode {$stateText}");
    }
}
