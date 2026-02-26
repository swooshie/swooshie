<?php
declare(strict_types=1);

if (!function_exists('portfolio_log_write')) {
    function portfolio_log_write(string $level, string $message, array $context = []): void {
        try {
            $logsDir = dirname(__DIR__) . '/logs';
            if (!is_dir($logsDir)) {
                @mkdir($logsDir, 0775, true);
            }

            $logFile = $logsDir . '/portfolio-bot.log';
            if (is_file($logFile) && @filesize($logFile) > 5 * 1024 * 1024) {
                @rename($logFile, $logsDir . '/portfolio-bot.log.1');
            }

            $record = [
                'ts' => gmdate('c'),
                'level' => $level,
                'message' => $message,
                'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
                'ua' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                'context' => $context,
            ];

            @file_put_contents(
                $logFile,
                json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL,
                FILE_APPEND | LOCK_EX
            );
        } catch (Throwable $e) {
            // Avoid crashing request because logging failed.
        }
    }
}

