<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://www.massflow.cz',
    'https://massflow.cz',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];

if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw ?: '', true);

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Neplatná data formuláře.']);
    exit;
}

if (!empty($input['company'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$name = trim((string) ($input['name'] ?? ''));
$email = trim((string) ($input['email'] ?? ''));
$message = trim((string) ($input['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Vyplňte všechna pole.']);
    exit;
}

if (mb_strlen($name) > 120 || mb_strlen($email) > 254 || mb_strlen($message) > 5000) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Zpráva je příliš dlouhá.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Zadejte platný e-mail.']);
    exit;
}

$configPath = __DIR__ . '/mail.config.php';
if (!is_file($configPath)) {
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'error' => 'Formulář není nakonfigurován. Kontaktujte nás e-mailem nebo WhatsApp.',
    ]);
    exit;
}

/** @var array<string, mixed> $mailConfig */
$mailConfig = require $configPath;

$required = ['smtp_host', 'smtp_port', 'smtp_secure', 'smtp_user', 'smtp_pass', 'from_email', 'from_name', 'to_email'];
foreach ($required as $key) {
    if (empty($mailConfig[$key]) || $mailConfig[$key] === 'VAŠE_HESLO_KE_SCHRÁNCE') {
        http_response_code(503);
        echo json_encode([
            'ok' => false,
            'error' => 'Formulář není nakonfigurován. Kontaktujte nás e-mailem nebo WhatsApp.',
        ]);
        exit;
    }
}

$subject = 'Kontakt z webu Massflow — ' . $name;
$body = "Nová zpráva z kontaktního formuláře massflow.cz\n\n"
    . "Jméno: {$name}\n"
    . "E-mail: {$email}\n\n"
    . "Zpráva:\n{$message}\n";

require_once __DIR__ . '/forpsi-smtp.php';

try {
    $smtp = new ForpsiSmtp(
        (string) $mailConfig['smtp_host'],
        (int) $mailConfig['smtp_port'],
        (string) $mailConfig['smtp_secure'],
        (string) $mailConfig['smtp_user'],
        (string) $mailConfig['smtp_pass'],
    );

    $smtp->send(
        (string) $mailConfig['to_email'],
        $subject,
        $body,
        (string) $mailConfig['from_email'],
        (string) $mailConfig['from_name'],
        $email,
        $name,
    );
} catch (Throwable $e) {
    error_log('Massflow contact form: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Odeslání se nezdařilo. Zkuste e-mail nebo WhatsApp.',
    ]);
    exit;
}

echo json_encode(['ok' => true]);
