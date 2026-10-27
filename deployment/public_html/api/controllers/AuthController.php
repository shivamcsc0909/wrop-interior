<?php
/**
 * WROP Interior Authentication Controller
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/security.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../utils/Logger.php';

class AuthController {
    public static function clientLogin(): void {
        initSession();
        $input = Validator::getJsonInput();
        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($username) || empty($password)) {
            Response::error('Username and password are required', 422);
        }

        $db = getDatabaseConnection();
        $stmt = $db->prepare("SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            Logger::logAudit('FAILED_LOGIN_CLIENT', "Attempted login for: {$username}");
            Response::error('Invalid credentials', 401);
        }

        if ((int)$user['is_active'] !== 1) {
            Logger::logAudit('LOCKED_ACCOUNT_ATTEMPT', "Locked user tried login: {$username}", $user['id'], $user['username'], $user['role']);
            Response::forbidden('Your administrative account has been deactivated. Please contact systems administration.');
        }

        // Set session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['full_name'] = $user['full_name'];
        $_SESSION['email'] = $user['email'];

        // Track session in DB
        self::recordSession($user['id']);

        // Update last login
        $db->prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?")->execute([$user['id']]);

        Logger::logAudit('LOGIN_CLIENT', "Client admin logged in: {$user['username']}", $user['id'], $user['username'], $user['role']);

        Response::json([
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role'],
                'full_name' => $user['full_name'],
                'email' => $user['email']
            ],
            'csrf_token' => getCsrfToken()
        ], 200, 'Welcome to WROP Interior Client Studio');
    }

    public static function devLogin(): void {
        initSession();
        $input = Validator::getJsonInput();
        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($username) || empty($password)) {
            Response::error('Username and password are required', 422);
        }

        $db = getDatabaseConnection();
        $stmt = $db->prepare("SELECT * FROM users WHERE (username = ? OR email = ?) AND role = 'DEVELOPER_ADMIN' LIMIT 1");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            Logger::logAudit('FAILED_LOGIN_DEV', "Developer login failure for: {$username}");
            Response::error('Invalid developer portal credentials', 401);
        }

        if ((int)$user['is_active'] !== 1) {
            Response::forbidden('Developer account is inactive');
        }

        // Set session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['full_name'] = $user['full_name'];
        $_SESSION['email'] = $user['email'];

        self::recordSession($user['id']);

        $db->prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?")->execute([$user['id']]);

        Logger::logAudit('LOGIN_DEV', "Developer logged in to systems portal: {$user['username']}", $user['id'], $user['username'], $user['role']);

        Response::json([
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role'],
                'full_name' => $user['full_name'],
                'email' => $user['email']
            ],
            'csrf_token' => getCsrfToken()
        ], 200, 'Developer Portal Authenticated');
    }

    public static function getSession(): void {
        initSession();
        if (empty($_SESSION['user_id'])) {
            Response::json(['user' => null, 'csrf_token' => getCsrfToken()]);
        }

        $db = getDatabaseConnection();
        $stmt = $db->prepare("SELECT id, username, email, role, full_name, is_active FROM users WHERE id = ? LIMIT 1");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();

        if (!$user || (int)$user['is_active'] !== 1) {
            session_destroy();
            Response::json(['user' => null, 'csrf_token' => getCsrfToken()]);
        }

        Response::json([
            'user' => $user,
            'csrf_token' => getCsrfToken()
        ]);
    }

    public static function logout(): void {
        initSession();
        $userId = $_SESSION['user_id'] ?? null;
        $username = $_SESSION['username'] ?? null;
        $role = $_SESSION['role'] ?? null;

        if ($userId) {
            Logger::logAudit('LOGOUT', "User logged out: {$username}", $userId, $username, $role);
            try {
                $db = getDatabaseConnection();
                $db->prepare("DELETE FROM sessions WHERE id = ?")->execute([session_id()]);
            } catch (Throwable) {}
        }

        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();

        Response::json(null, 200, 'Logged out successfully');
    }

    private static function recordSession(int $userId): void {
        try {
            $db = getDatabaseConnection();
            $sessId = session_id();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 500);
            $now = time();

            $stmt = $db->prepare("INSERT OR REPLACE INTO sessions (id, user_id, ip_address, user_agent, last_activity, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))");
            if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
                $stmt = $db->prepare("INSERT INTO sessions (id, user_id, ip_address, user_agent, last_activity, created_at) VALUES (?, ?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE last_activity = VALUES(last_activity), ip_address = VALUES(ip_address)");
            }
            $stmt->execute([$sessId, $userId, $ip, $ua, $now]);
        } catch (Throwable $e) {
            error_log("Failed to record session: " . $e->getMessage());
        }
    }
}
