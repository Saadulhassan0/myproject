<?php
ob_start();
session_start();
// Prevent PHP errors from being displayed directly
error_reporting(E_ALL);
ini_set('display_errors', 0);

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true) ?? [];

$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

$errors = [];

if (empty($email)) $errors['email'] = 'Email is required';
if (empty($password)) $errors['password'] = 'Password is required';

if (!empty($errors)) {
    @ob_clean();
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

try {
    // Fetch user by email
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_profile_pic'] = $user['profile_pic'];
            $_SESSION['user_phone'] = $user['phone'] ?? '';
            $_SESSION['user_dob'] = $user['dob'] ?? '';
            $_SESSION['user_cnic'] = $user['cnic'] ?? '';
            
            @ob_clean();
            echo json_encode([
                'success' => true, 
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'profile_pic' => $user['profile_pic'],
                    'phone' => $user['phone'] ?? '',
                    'dob' => $user['dob'] ?? '',
                    'cnic' => $user['cnic'] ?? ''
                ]
            ]);
        } else {
            @ob_clean();
            echo json_encode(['success' => false, 'message' => 'Invalid password']);
        }
    } else {
        @ob_clean();
        echo json_encode(['success' => false, 'message' => 'Email not found']);
    }
    
} catch(PDOException $e) {
    @ob_clean();
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
