<?php
/**
 * WROP Interior Audit & Error Logger
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

class Logger {
    public static function logAudit(string $action, ?string $details = null, ?int $userId = null, ?string $username = null, ?string $role = null): void {
        try {
            $db = getDatabaseConnection();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 500);

            $stmt = $db->prepare("INSERT INTO audit_logs (user_id, username, role, action, details, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))");
            // If MySQL, datetime('now') works or CURRENT_TIMESTAMP
            if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
                $stmt = $db->prepare("INSERT INTO audit_logs (user_id, username, role, action, details, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
            }
            $stmt->execute([$userId, $username, $role, $action, $details, $ip, $ua]);
        } catch (Throwable $e) {
            error_log("Failed to write audit log: " . $e->getMessage());
        }
    }

    public static function logError(string $message, ?Throwable $exception = null): void {
        $logDir = __DIR__ . '/../../logs';
        if (!is_dir($logDir)) {
            @mkdir($logDir, 0755, true);
        }
        $logFile = $logDir . '/error.log';
        $timestamp = date('Y-m-d H:i:s');
        $trace = $exception ? "\n" . $exception->getTraceAsString() : '';
        $entry = "[{$timestamp}] {$message}{$trace}\n";
        @file_put_contents($logFile, $entry, FILE_APPEND);
    }
}
