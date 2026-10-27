<?php
/**
 * WROP Interior Contact & Project Enquiry Controller
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../utils/Logger.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/rate_limit.php';

class EnquiryController {
    public static function submit(): void {
        // 1. Rate limiting spam protection
        RateLimitMiddleware::check('enquiry_submit', 5, 600);

        $input = Validator::getJsonInput();

        // 2. Honeypot check (hidden field bots fill)
        if (!empty($input['website_hp'])) {
            // Silently drop bot submission
            Response::json(['id' => 0], 200, 'Thank you. Your enquiry has been received.');
        }

        // 3. Validation
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $projectType = trim($input['project_type'] ?? 'Residential');
        $propertyType = trim($input['property_type'] ?? 'Apartment');
        $approxArea = trim($input['approx_area'] ?? '');
        $budgetRange = trim($input['budget_range'] ?? '');
        $preferredDate = trim($input['preferred_date'] ?? '');
        $message = trim($input['message'] ?? '');
        $privacyConsent = !empty($input['privacy_consent']) ? 1 : 0;

        $errors = [];
        if (empty($name) || strlen($name) < 2) {
            $errors['name'] = 'Full name is required (minimum 2 characters)';
        }
        if (empty($email) || !Validator::isValidEmail($email)) {
            $errors['email'] = 'A valid email address is required';
        }
        if (empty($phone) || strlen($phone) < 7) {
            $errors['phone'] = 'A valid contact phone number is required';
        }
        if (empty($message) || strlen($message) < 10) {
            $errors['message'] = 'Please share a brief message regarding your project (minimum 10 characters)';
        }
        if (!$privacyConsent) {
            $errors['privacy_consent'] = 'You must agree to the privacy policy to proceed';
        }

        if (!empty($errors)) {
            Response::error('Please correct the errors in the form', 422, $errors);
        }

        $db = getDatabaseConnection();
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

        $stmt = $db->prepare("
            INSERT INTO enquiries (name, email, phone, project_type, property_type, approx_area, budget_range, preferred_date, message, privacy_consent, status, ip_address, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, datetime('now'))
        ");
        if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
            $stmt = $db->prepare("
                INSERT INTO enquiries (name, email, phone, project_type, property_type, approx_area, budget_range, preferred_date, message, privacy_consent, status, ip_address, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, NOW())
            ");
        }

        $stmt->execute([
            $name,
            $email,
            $phone,
            $projectType,
            $propertyType,
            $approxArea,
            $budgetRange,
            $preferredDate,
            $message,
            $privacyConsent,
            $ip
        ]);

        $enquiryId = (int)$db->lastInsertId();

        Logger::logAudit('NEW_ENQUIRY', "New enquiry #{$enquiryId} from {$name} ({$email}) for {$projectType}");

        Response::json([
            'id' => $enquiryId,
            'message' => 'Thank you for contacting WROP Interior. Your consultation enquiry has been recorded securely in our studio registry. Our team will review your project details and get in touch.'
        ], 201, 'Enquiry submitted successfully');
    }

    // Client Admin - View all enquiries
    public static function index(): void {
        AuthMiddleware::requireClientAdmin();
        $db = getDatabaseConnection();

        $status = $_GET['status'] ?? null;
        $sql = "SELECT * FROM enquiries";
        $params = [];

        if (!empty($status) && $status !== 'all') {
            $sql .= " WHERE status = ?";
            $params[] = $status;
        }

        $sql .= " ORDER BY created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        Response::json($stmt->fetchAll());
    }

    // Client Admin - Update enquiry status / notes
    public static function update(int $id): void {
        $user = AuthMiddleware::requireClientAdmin();
        $input = Validator::getJsonInput();

        $status = $input['status'] ?? null;
        $adminNotes = $input['admin_notes'] ?? null;

        $db = getDatabaseConnection();
        $stmt = $db->prepare("SELECT id FROM enquiries WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            Response::notFound('Enquiry not found');
        }

        $fields = [];
        $params = [];
        if ($status !== null) {
            $fields[] = "status = ?";
            $params[] = $status;
        }
        if ($adminNotes !== null) {
            $fields[] = "admin_notes = ?";
            $params[] = $adminNotes;
        }

        if (!empty($fields)) {
            $params[] = $id;
            $db->prepare("UPDATE enquiries SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
            Logger::logAudit('UPDATE_ENQUIRY', "Enquiry #{$id} updated with status: {$status}", $user['id'], $user['username'], $user['role']);
        }

        Response::json(null, 200, 'Enquiry updated successfully');
    }

    // Client Admin - Delete enquiry
    public static function delete(int $id): void {
        $user = AuthMiddleware::requireClientAdmin();
        $db = getDatabaseConnection();
        $db->prepare("DELETE FROM enquiries WHERE id = ?")->execute([$id]);
        Logger::logAudit('DELETE_ENQUIRY', "Enquiry #{$id} deleted", $user['id'], $user['username'], $user['role']);
        Response::json(null, 200, 'Enquiry removed');
    }
}
