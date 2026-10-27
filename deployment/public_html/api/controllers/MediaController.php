<?php
/**
 * WROP Interior Media Library Controller
 * Secure file upload and asset management
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../utils/Logger.php';
require_once __DIR__ . '/../middleware/auth.php';

class MediaController {
    private static array $allowedMimeTypes = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/avif' => 'avif'
    ];

    private static int $maxFileSize = 10 * 1024 * 1024; // 10MB

    public static function index(): void {
        AuthMiddleware::requireClientAdmin();
        $db = getDatabaseConnection();

        $query = $_GET['q'] ?? '';
        $sql = "SELECT * FROM media_items";
        $params = [];

        if (!empty($query)) {
            $sql .= " WHERE original_name LIKE ? OR alt_text LIKE ?";
            $searchTerm = "%{$query}%";
            $params = [$searchTerm, $searchTerm];
        }

        $sql .= " ORDER BY created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        Response::json($stmt->fetchAll());
    }

    public static function upload(): void {
        $user = AuthMiddleware::requireClientAdmin();

        if (empty($_FILES['file'])) {
            Response::error('No file provided for upload', 422);
        }

        $file = $_FILES['file'];

        if ($file['error'] !== UPLOAD_ERR_OK) {
            Response::error('File upload error code: ' . $file['error'], 400);
        }

        if ($file['size'] > self::$maxFileSize) {
            Response::error('File size exceeds the 10MB limit', 422);
        }

        // Verify true MIME type using finfo
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        if (!array_key_exists($mime, self::$allowedMimeTypes)) {
            Response::error('Invalid file format. Only JPEG, PNG, WEBP, and AVIF images are permitted.', 422);
        }

        // Verify image integrity with getimagesize
        $imageInfo = @getimagesize($file['tmp_name']);
        if ($imageInfo === false) {
            Response::error('Uploaded file is not a valid image file', 422);
        }

        $extension = self::$allowedMimeTypes[$mime];
        $uploadDir = __DIR__ . '/../uploads';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0755, true);
        }

        // Generate safe unique filename
        $safeFilename = 'wrop_' . date('Ymd_His') . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
        $targetPath = $uploadDir . '/' . $safeFilename;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            Response::serverError('Failed to move uploaded file into media repository');
        }

        $publicUrl = '/api/uploads/' . $safeFilename;
        $originalName = htmlspecialchars(pathinfo($file['name'], PATHINFO_FILENAME), ENT_QUOTES, 'UTF-8');
        $altText = !empty($_POST['alt_text']) ? trim($_POST['alt_text']) : $originalName;

        $db = getDatabaseConnection();
        $stmt = $db->prepare("
            INSERT INTO media_items (filename, original_name, file_path, mime_type, file_size, alt_text, created_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        ");
        if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
            $stmt = $db->prepare("
                INSERT INTO media_items (filename, original_name, file_path, mime_type, file_size, alt_text, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            ");
        }
        $stmt->execute([$safeFilename, $file['name'], $publicUrl, $mime, $file['size'], $altText]);
        $mediaId = (int)$db->lastInsertId();

        Logger::logAudit('UPLOAD_MEDIA', "Uploaded media {$safeFilename} (#{$mediaId})", $user['id'], $user['username'], $user['role']);

        Response::json([
            'id' => $mediaId,
            'filename' => $safeFilename,
            'url' => $publicUrl,
            'mime_type' => $mime,
            'size' => $file['size'],
            'alt_text' => $altText
        ], 201, 'Media uploaded successfully');
    }

    public static function update(int $id): void {
        $user = AuthMiddleware::requireClientAdmin();
        $input = Validator::getJsonInput();
        $altText = trim($input['alt_text'] ?? '');

        $db = getDatabaseConnection();
        $stmt = $db->prepare("UPDATE media_items SET alt_text = ? WHERE id = ?");
        $stmt->execute([$altText, $id]);

        Response::json(null, 200, 'Media metadata updated');
    }

    public static function delete(int $id): void {
        $user = AuthMiddleware::requireClientAdmin();
        $db = getDatabaseConnection();

        $stmt = $db->prepare("SELECT filename, file_path FROM media_items WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $media = $stmt->fetch();

        if (!$media) {
            Response::notFound('Media item not found');
        }

        // Delete physical file
        $filePath = __DIR__ . '/../uploads/' . $media['filename'];
        if (file_exists($filePath)) {
            @unlink($filePath);
        }

        $db->prepare("DELETE FROM media_items WHERE id = ?")->execute([$id]);
        Logger::logAudit('DELETE_MEDIA', "Deleted media #{$id} ({$media['filename']})", $user['id'], $user['username'], $user['role']);

        Response::json(null, 200, 'Media item removed');
    }
}
