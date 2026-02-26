<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/_logger.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function log_json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'GET') {
    log_json_response(['ok' => true, 'logger' => 'ready']);
}

if ($method !== 'POST') {
    log_json_response(['error' => 'Method not allowed'], 405);
}

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
    log_json_response(['error' => 'Invalid JSON body'], 400);
}

$level = (string) ($data['level'] ?? 'error');
$message = trim((string) ($data['message'] ?? 'client_error'));
$context = is_array($data['context'] ?? null) ? $data['context'] : [];

// Keep logs bounded/safe.
if (mb_strlen($message, 'UTF-8') > 500) {
    $message = mb_substr($message, 0, 500, 'UTF-8');
}
$context['client_url'] = $_SERVER['HTTP_REFERER'] ?? null;

portfolio_log_write($level, 'client:' . $message, $context);
log_json_response(['ok' => true]);

