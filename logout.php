<?php
session_start();
session_destroy();
header('Content-Type: application/json');
@ob_clean();
echo json_encode(['success' => true, 'message' => 'Logged out successfully']);