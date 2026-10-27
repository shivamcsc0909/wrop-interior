<?php
/**
 * WROP Interior Rate Limiting Middleware
 */

declare(strict_types=1);

require_once __DIR__ . '/../utils/Response.php';

class RateLimitMiddleware {
    public static function check(string $action = 'enquiry', int $maxAttempts = 5, int $decaySeconds = 600): void {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $cacheDir = __DIR__ . '/../../logs/ratelimit';
        if (!is_dir($cacheDir)) {
            @mkdir($cacheDir, 0755, true);
        }

        $hash = md5($ip . '_' . $action);
        $file = $cacheDir . '/' . $hash . '.json';
        $now = time();

        $data = ['attempts' => 0, 'first_attempt' => $now];
        if (file_exists($file)) {
            $content = @file_get_contents($file);
            $parsed = json_decode($content ?: '{}', true);
            if (is_array($parsed) && isset($parsed['first_attempt']) && ($now - $parsed['first_attempt'] < $decaySeconds)) {
                $data = $parsed;
            }
        }

        $data['attempts']++;
        if ($data['attempts'] > $maxAttempts) {
            $retryAfter = $decaySeconds - ($now - $data['first_attempt']);
            header("Retry-After: {$retryAfter}");
            Response::error('Too many requests. Please wait before submitting another enquiry.', 429);
        }

        @file_put_contents($file, json_encode($data));
    }
}
