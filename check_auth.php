<?php
session_start();
@ob_clean();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'logged_in' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'email' => $_SESSION['user_email'],
            'profile_pic' => $_SESSION['user_profile_pic'] ?? 'default.png',
            'phone' => $_SESSION['user_phone'] ?? '',
            'dob' => $_SESSION['user_dob'] ?? '',
            'cnic' => $_SESSION['user_cnic'] ?? ''
        ]
    ]);
} else {
    echo json_encode(['logged_in' => false]);
}