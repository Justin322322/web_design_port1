<?php
header('Content-Type: application/json');

// Validate email
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Path to save emails
$file = 'subscribers.txt';

try {
    // Check if email already exists
    $subscribers = file_exists($file) ? file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
    
    if (in_array($email, $subscribers)) {
        echo json_encode(['success' => false, 'message' => 'Email already subscribed']);
        exit;
    }

    // Append new email to file
    file_put_contents($file, $email . PHP_EOL, FILE_APPEND);
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error saving subscription']);
}
?>
