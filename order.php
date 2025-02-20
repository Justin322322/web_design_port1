<?php
header('Content-Type: application/json');

// Allow CORS for development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['items']) || !isset($data['customerInfo'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid order data']);
    exit;
}

try {
    // Validate customer info
    if (empty($data['customerInfo']['name']) || 
        empty($data['customerInfo']['email']) || 
        empty($data['customerInfo']['phone'])) {
        throw new Exception('Missing customer information');
    }

    // Generate order ID
    $orderId = uniqid('ORDER-');
    
    // Add timestamp
    $data['timestamp'] = date('Y-m-d H:i:s');
    $data['orderId'] = $orderId;
    
    // Save order to file
    $orderData = json_encode($data) . PHP_EOL;
    if (file_put_contents('orders.txt', $orderData, FILE_APPEND) === false) {
        throw new Exception('Failed to save order');
    }
    
    // Send success response
    echo json_encode([
        'success' => true,
        'orderId' => $orderId,
        'message' => 'Order placed successfully'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}