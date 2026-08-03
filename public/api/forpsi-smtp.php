<?php
declare(strict_types=1);

/**
 * Minimal SMTP client for Forpsi (smtp.forpsi.com).
 */
final class ForpsiSmtp
{
    /** @var resource|null */
    private $socket;

    public function __construct(
        private readonly string $host,
        private readonly int $port,
        private readonly string $secure,
        private readonly string $user,
        private readonly string $pass,
    ) {}

    public function send(
        string $to,
        string $subject,
        string $body,
        string $fromEmail,
        string $fromName,
        string $replyToEmail,
        string $replyToName,
    ): void {
        $this->connect();
        $this->expect(220);
        $this->command('EHLO massflow.cz', 250);

        if ($this->secure === 'tls') {
            $this->command('STARTTLS', 220);
            if (!stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('Nepodařilo se navázat TLS spojení.');
            }
            $this->command('EHLO massflow.cz', 250);
        }

        $this->command('AUTH LOGIN', 334);
        $this->command(base64_encode($this->user), 334);
        $this->command(base64_encode($this->pass), 235);

        $this->command('MAIL FROM:<' . $fromEmail . '>', 250);
        $this->command('RCPT TO:<' . $to . '>', 250);
        $this->command('DATA', 354);

        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $message = implode("\r\n", [
            'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
            'From: ' . $this->encodeAddress($fromName, $fromEmail),
            'Reply-To: ' . $this->encodeAddress($replyToName, $replyToEmail),
            'To: <' . $to . '>',
            'Subject: ' . $encodedSubject,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            $body,
            '',
        ]) . "\r\n.";

        $this->write($message);
        $this->expect(250);
        $this->command('QUIT', 221);
        $this->disconnect();
    }

    private function connect(): void
    {
        $remote = $this->secure === 'ssl'
            ? 'ssl://' . $this->host . ':' . $this->port
            : 'tcp://' . $this->host . ':' . $this->port;

        $errno = 0;
        $errstr = '';
        $socket = @stream_socket_client(
            $remote,
            $errno,
            $errstr,
            20,
            STREAM_CLIENT_CONNECT,
        );

        if ($socket === false) {
            throw new RuntimeException('SMTP spojení selhalo: ' . $errstr);
        }

        stream_set_timeout($socket, 20);
        $this->socket = $socket;
    }

    private function disconnect(): void
    {
        if (is_resource($this->socket)) {
            fclose($this->socket);
        }
        $this->socket = null;
    }

    private function command(string $command, int $expectedCode): void
    {
        $this->write($command);
        $this->expect($expectedCode);
    }

    private function write(string $data): void
    {
        if (!is_resource($this->socket)) {
            throw new RuntimeException('SMTP není připojeno.');
        }

        $payload = $data . "\r\n";
        if (fwrite($this->socket, $payload) === false) {
            throw new RuntimeException('SMTP zápis selhal.');
        }
    }

    private function expect(int $expectedCode): void
    {
        if (!is_resource($this->socket)) {
            throw new RuntimeException('SMTP není připojeno.');
        }

        $response = '';
        while (($line = fgets($this->socket, 515)) !== false) {
            $response .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }

        if ($response === '') {
            throw new RuntimeException('SMTP server neodpověděl.');
        }

        $code = (int) substr($response, 0, 3);
        if ($code !== $expectedCode) {
            throw new RuntimeException(trim($response));
        }
    }

    private function encodeAddress(string $name, string $email): string
    {
        $safeName = str_replace(['"', "\r", "\n"], '', $name);
        return sprintf('"%s" <%s>', $safeName, $email);
    }
}
