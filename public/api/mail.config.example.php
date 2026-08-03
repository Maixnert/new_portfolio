<?php
/**
 * Zkopírujte jako mail.config.php a doplňte přihlašovací údaje z webmail.forpsi.com
 *
 * SMTP Forpsi:
 *   Server: smtp.forpsi.com
 *   Port:   587 (TLS) nebo 465 (SSL)
 *   Login:  celá e-mailová adresa
 *   Heslo:  heslo ke schránce
 */
return [
    'smtp_host' => 'smtp.forpsi.com',
    'smtp_port' => 587,
    /** tls (port 587) nebo ssl (port 465) */
    'smtp_secure' => 'tls',
    'smtp_user' => 'marketing@massflow.cz',
    'smtp_pass' => 'VAŠE_HESLO_KE_SCHRÁNCE',
    'from_email' => 'marketing@massflow.cz',
    'from_name' => 'Massflow web',
    'to_email' => 'marketing@massflow.cz',
];
