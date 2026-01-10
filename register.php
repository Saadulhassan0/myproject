<?php
// Prevent PHP errors from being displayed directly (they break JSON)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// CORS Headers for Live Server access
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$cnic = trim($input['cnic'] ?? '');
$phone = trim($input['phone'] ?? '');
$dob = $input['dob'] ?? '';
$password = $input['password'] ?? '';

$errors = [];

// Validation
if (strlen($name) < 3) $errors['name'] = 'Name must be at least 3 letters';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Invalid email format';
if (!preg_match('/^\d{5}-\d{7}-\d$/', $cnic)) $errors['cnic'] = 'Invalid CNIC format';
if (!preg_match('/^03\d{2}-\d{7}$/', $phone)) $errors['phone'] = 'Invalid phone format';
if (empty($dob)) $errors['dob'] = 'Date of birth is required';
if (strlen($password) < 6) $errors['password'] = 'Password must be at least 6 characters';

if (!empty($errors)) {
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

try {
    // Check if user already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR cnic = ?");
    $stmt->execute([$email, $cnic]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email or CNIC already exists']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (name, email, cnic, phone, dob, password) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $cnic, $phone, $dob, $hashedPassword]);
    
    echo json_encode(['success' => true, 'message' => 'Registration successful!']);
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
