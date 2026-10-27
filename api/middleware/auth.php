<?php
/**
 * WROP Interior Authentication & RBAC Middleware
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/security.php';
require_once __DIR__ . '/../utils/Response.php';

class AuthMiddleware {
    public static function getCurrentUser(): ?array {
        initSession();
        if (empty($_SESSION['user_id'])) {
            return null;
        }
        return [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'] ?? '',
            'role' => $_SESSION['role'] ?? '',
            'full_name' => $_SESSION['full_name'] ?? '',
            'email' => $_SESSION['email'] ?? ''
        ];
    }

    public static function requireAuth(): array {
        $user = self::getCurrentUser();
        if (!$user) {
            Response::unauthorized('Authentication required to access this resource');
        }
        return $user;
    }

    public static function requireClientAdmin(): array {
        $user = self::requireAuth();
        if (!in_array($user['role'], ['CLIENT_ADMIN', 'DEVELOPER_ADMIN'], true)) {
            Response::forbidden('Access restricted to Client Administrators');
        }
        return $user;
    }

    public static function requireDeveloperAdmin(): array {
        $user = self::requireAuth();
        if ($user['role'] !== 'DEVELOPER_ADMIN') {
            Response::forbidden('Access strictly restricted to Developer Administrators');
        }
        return $user;
    }
}
