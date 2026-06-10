<?php
declare(strict_types=1);

ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED);

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/_logger.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const FALLBACK_MESSAGE = "I don't know based on the provided portfolio notes. If you want, tell me what to add.";

function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function load_local_config(): array {
    $configFile = __DIR__ . '/chat.config.php';
    if (!is_file($configFile)) return [];
    $cfg = include $configFile;
    return is_array($cfg) ? $cfg : [];
}

function env_value(string $key, ?string $default = null): ?string {
    $v = getenv($key);
    if ($v !== false && $v !== '') return $v;
    if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') return (string) $_SERVER[$key];
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') return (string) $_ENV[$key];
    return $default;
}

function normalize_text(string $text): string {
    return trim(str_replace("\r", '', $text));
}

function tokenize(string $text): array {
    static $stopwords = [
        'the','and','for','with','that','this','from','what','about','into',
        'your','have','has','did','does','are','was','were','how','can',
        'you','his','her','their','them','they','but','not','all','any',
        'who','where','when','why','which','tell','more','please','like'
    ];
    static $stopSet = null;
    if ($stopSet === null) {
        $stopSet = array_fill_keys($stopwords, true);
    }
    preg_match_all('/\b[\w-]{2,}\b/u', mb_strtolower($text, 'UTF-8'), $m);
    $tokens = $m[0] ?? [];
    $normalized = [];
    foreach ($tokens as $t) {
        if (isset($stopSet[$t])) continue;
        // Lightweight normalization for common query/portfolio variants.
        if (in_array($t, ['worked', 'working', 'works'], true)) $t = 'work';
        if (in_array($t, ['builds', 'built', 'building'], true)) $t = 'build';
        if (in_array($t, ['skills', 'skillset'], true)) $t = 'skill';
        if (in_array($t, ['courses', 'coursework', 'classes'], true)) $t = 'course';
        $normalized[] = $t;
    }
    return $normalized;
}

function chunk_text(string $text, string $source): array {
    $parts = preg_split("/\n\s*\n/", normalize_text($text)) ?: [];
    $chunks = [];
    $buffer = '';
    $currentSection = '';
    foreach ($parts as $part) {
        $seg = trim($part);
        if ($seg === '') continue;

        if (preg_match('/^##\s+.+/m', $seg)) {
            $lines = preg_split("/\n/", $seg) ?: [];
            foreach ($lines as $line) {
                $line = trim($line);
                if (preg_match('/^##\s+.+/', $line)) {
                    $currentSection = $line;
                    break;
                }
            }
        }

        $segWithContext = $seg;
        if ($currentSection !== '' && !str_contains($seg, $currentSection)) {
            $segWithContext = $currentSection . "\n\n" . $seg;
        }

        if ($buffer !== '' && mb_strlen($buffer . "\n\n" . $segWithContext, 'UTF-8') > 700) {
            $chunks[] = [
                'source' => $source,
                'text' => trim($buffer),
                'tokens' => tokenize($buffer),
            ];
            $buffer = $segWithContext;
        } else {
            $buffer = $buffer === '' ? $segWithContext : ($buffer . "\n\n" . $segWithContext);
        }
    }
    if ($buffer !== '') {
        $chunks[] = [
            'source' => $source,
            'text' => trim($buffer),
            'tokens' => tokenize($buffer),
        ];
    }
    return $chunks;
}

function detect_intent(string $query): string {
    $q = mb_strtolower($query, 'UTF-8');
    if (preg_match('/\b(react|next\.?js|frontend|front-end|visa|sponsorship|work authorization|authorized to work|authorization to work|work permit|can you work in (the )?usa|work in (the )?us|relocation|professional profile)\b/u', $q)) return 'professional';
    if (preg_match('/\b(experience|work|job|role|intern|company|nyu|sainapse|aidash|paypal)\b/u', $q)) return 'experience';
    if (preg_match('/\b(skill|stack|tech|technology|tools|languages|framework)\b/u', $q)) return 'skills';
    if (preg_match('/\b(course|coursework|class|study|studied|education|tandon|bits)\b/u', $q)) return 'courses';
    if (preg_match('/\b(project|repo|github|built|build|telegram|linq|message|messaging|chat|bot|place|places|location|reminder|snooze|openstreetmap|nominatim|leaflet)\b/u', $q)) return 'projects';
    return 'general';
}

function source_boost(string $source, string $intent): float {
    if ($intent === 'projects' && $source === '/data/projects.md') return 2.5;
    if ($intent === 'experience' && $source === '/data/experience.md') return 2.5;
    if ($intent === 'skills' && $source === '/data/skills.md') return 2.5;
    if ($intent === 'courses' && $source === '/data/courses.md') return 2.5;
    if ($intent === 'professional' && $source === '/data/professional-profile.md') return 3.0;
    return 0.0;
}

function query_anchor_terms(string $query): array {
    $q = mb_strtolower($query, 'UTF-8');
    $anchors = [
        'sainapse' => ['sainapse'],
        'nyu' => ['nyu', 'new york university', 'gemss', 'global enrollment management'],
        'aidash' => ['aidash'],
        'paypal' => ['paypal'],
        'smart task manager' => ['smart task manager', 'task manager', 'asp.net', '.net', 'c#', 'redis', 'tf-idf', 'vercel', 'render', 'telegram', 'linq', 'places', 'location', 'reminders', 'snooze', 'openstreetmap', 'nominatim', 'leaflet'],
        'market data' => ['market data', 'finnhub', 'kafka', 'fastapi'],
        'apple wallet' => ['apple wallet', 'passkit', 'coupon'],
        'computer vision' => ['computer vision', 'cs-gy 6643', 'cellpose', 'geoguessr'],
        'ai project suite' => ['artificial intelligence', 'anomalib', 'qdrant', 'pddl', 'openrouter'],
        'react profile' => ['react', 'next.js', 'frontend', 'front-end', 'workflow ui'],
        'work authorization' => ['visa', 'work authorization', 'work permit', 'sponsorship'],
    ];
    foreach ($anchors as $name => $terms) {
        foreach ($terms as $term) {
            if (mb_strpos($q, $term) !== false) return $terms;
        }
    }
    return [];
}

function retrieve_context(array $knowledgeBase, string $query, int $topK = 4): array {
    $qTokens = tokenize($query);
    if (!$qTokens || !$knowledgeBase) return [];
    $intent = detect_intent($query);
    $qLower = mb_strtolower(trim($query), 'UTF-8');
    $isCurrentQuery = (bool) preg_match('/\b(current|currently|right now|present|now)\b/u', $qLower);
    $anchorTerms = query_anchor_terms($query);
    $scored = [];

    foreach ($knowledgeBase as $chunk) {
        $score = 0.0;
        $uniqueHits = 0;
        foreach ($qTokens as $token) {
            if (in_array($token, $chunk['tokens'], true)) {
                $score += 1.0;
                $uniqueHits += 1;
            }
        }

        $chunkLower = mb_strtolower($chunk['text'], 'UTF-8');
        $anchorMatched = false;
        foreach ($anchorTerms as $term) {
            if (mb_strpos($chunkLower, $term) !== false) {
                $anchorMatched = true;
                $score += 3.5;
            }
        }
        if ($anchorTerms && !$anchorMatched) {
            $score -= 2.0;
        }
        if ($qLower !== '' && mb_strpos($chunkLower, $qLower) !== false) {
            $score += 4.0;
        }
        if ($isCurrentQuery) {
            if (mb_strpos($chunkLower, 'present') !== false) {
                $score += 5.0;
            } else {
                $score -= 0.8;
            }
        }

        if (count($qTokens) >= 2) {
            for ($i = 0; $i < count($qTokens) - 1; $i++) {
                $phrase = $qTokens[$i] . ' ' . $qTokens[$i + 1];
                if (mb_strpos($chunkLower, $phrase) !== false) $score += 1.5;
            }
        }

        $density = $score / max(1, count($chunk['tokens']));
        $titleBoost = preg_match('/^#{1,3}\s/m', $chunk['text']) ? 0.4 : 0.0;
        $intentBoost = source_boost($chunk['source'], $intent);
        $finalScore = $score + $density + $titleBoost + $intentBoost + ($uniqueHits * 0.15);

        if ($finalScore > 0) {
            $scored[] = ['chunk' => $chunk, 'score' => $finalScore];
        }
    }

    usort($scored, fn($a, $b) => $b['score'] <=> $a['score']);

    // For clear domain intents, prefer chunks from the primary markdown source to avoid noisy cross-file matches.
    $preferredSource = match ($intent) {
        'projects' => '/data/projects.md',
        'experience' => '/data/experience.md',
        'skills' => '/data/skills.md',
        'courses' => '/data/courses.md',
        'professional' => '/data/professional-profile.md',
        default => null,
    };

    if ($preferredSource !== null) {
        $preferred = array_values(array_filter($scored, fn($row) => $row['chunk']['source'] === $preferredSource));
        if (count($preferred) >= 2) {
            $scored = $preferred;
        }
    }

    if ($anchorTerms) {
        $anchorOnly = array_values(array_filter($scored, function ($row) use ($anchorTerms) {
            $t = mb_strtolower($row['chunk']['text'], 'UTF-8');
            foreach ($anchorTerms as $term) {
                if (mb_strpos($t, $term) !== false) return true;
            }
            return false;
        }));
        if ($anchorOnly) {
            $scored = $anchorOnly;
        }
    }

    return array_map(fn($x) => $x['chunk'], array_slice($scored, 0, $topK));
}

function build_kb(): array {
    $root = dirname(__DIR__);
    $paths = [
        '/data/projects.md',
        '/data/experience.md',
        '/data/skills.md',
        '/data/courses.md',
        '/data/professional-profile.md',
    ];
    $chunks = [];
    foreach ($paths as $rel) {
        $abs = $root . $rel;
        if (!is_file($abs)) continue;
        $text = file_get_contents($abs);
        if ($text === false) continue;
        $chunks = array_merge($chunks, chunk_text($text, $rel));
    }
    return $chunks;
}

function build_prompt(string $question, array $history, array $contexts): string {
    $fallback = FALLBACK_MESSAGE;
    $contextBlock = implode("\n\n", array_map(
        fn($c, $idx) => "Chunk " . ($idx + 1) . " ({$c['source']}):\n{$c['text']}",
        $contexts,
        array_keys($contexts)
    ));

    $historyLines = [];
    foreach (array_slice($history, -8) as $msg) {
        $role = ($msg['role'] ?? '') === 'assistant' ? 'Assistant' : 'User';
        $content = trim((string) ($msg['content'] ?? ''));
        if ($content === '') continue;
        $historyLines[] = "{$role}: {$content}";
    }
    $historyBlock = $historyLines ? implode("\n", $historyLines) : 'None';

    return <<<PROMPT
You are a helpful portfolio assistant for Aditya Jhaveri.
Answer using only the provided context from the portfolio markdown notes.
Do not invent details. If the answer is not in context, reply exactly:
"{$fallback}"
Give clear, specific answers with useful detail from the context. Keep it concise only when the user explicitly asks for a short answer.
If the user asks about a technology/domain where direct experience is limited or not explicitly stated, do not stop immediately.
Instead, say that direct experience is limited based on the notes, then present the closest relevant experience, transferable skills, and adaptability evidence from context.
Use wording like: "I don't have much direct experience with X in these notes, but I have related experience in Y and Z."
Only use the exact fallback message when there is no relevant adjacent context at all.
When the user asks about work/projects, prefer bullet points and include metrics/technologies if present in context.
Finish complete sentences. Do not stop mid-sentence.
Use plain text only. Do not use Markdown formatting (no **, __, #, or code fences).
For questions about "current", "right now", or "currently", use the dates in context and prefer entries marked "Present".

Conversation history:
{$historyBlock}

Context:
{$contextBlock}

User question:
{$question}
PROMPT;
}

function gemini_request(string $apiKey, string $model, string $prompt): array {
    if (!function_exists('curl_init')) {
        throw new RuntimeException('cURL is required for Gemini API requests.');
    }

    $url = "https://generativelanguage.googleapis.com/v1beta/models/" . rawurlencode($model) . ":generateContent";
    $payload = [
        'contents' => [[
            'role' => 'user',
            'parts' => [['text' => $prompt]],
        ]],
        'generationConfig' => [
            'temperature' => 0.2,
            'maxOutputTokens' => 1500,
        ],
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'x-goog-api-key: ' . $apiKey,
        ],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        CURLOPT_TIMEOUT => 45,
    ]);

    $raw = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    if ($raw === false) {
        throw new RuntimeException('Gemini request failed: ' . $curlErr);
    }

    $json = json_decode($raw, true);
    if ($httpCode >= 400) {
        $msg = $json['error']['message'] ?? ('Gemini API HTTP ' . $httpCode);
        throw new RuntimeException($msg);
    }

    return is_array($json) ? $json : [];
}

function extract_gemini_text(array $resp): string {
    $candidates = $resp['candidates'] ?? [];
    if (!is_array($candidates) || !$candidates) return '';
    $parts = $candidates[0]['content']['parts'] ?? [];
    if (!is_array($parts)) return '';
    $texts = [];
    foreach ($parts as $p) {
        if (isset($p['text']) && is_string($p['text'])) $texts[] = $p['text'];
    }
    return trim(implode("\n", $texts));
}

function friendly_api_error(string $message): array {
    $lower = mb_strtolower($message, 'UTF-8');
    $isQuota = str_contains($lower, 'quota')
        || str_contains($lower, 'rate limit')
        || str_contains($lower, 'resource_exhausted')
        || str_contains($lower, 'high demand')
        || str_contains($lower, 'try again later')
        || str_contains($lower, '429');

    if (!$isQuota) {
        return ['message' => $message, 'status' => 500];
    }

    $retrySeconds = null;
    if (preg_match('/(\d+)\s*second/i', $message, $m)) {
        $retrySeconds = (int) $m[1];
    } elseif (preg_match('/retry.*?(\d+)/i', $message, $m)) {
        $retrySeconds = (int) $m[1];
    }
    if ($retrySeconds === null || $retrySeconds <= 0) {
        $retrySeconds = 30;
    }

    return [
        'message' => 'Out of tokens, not out of talent. Retry shortly.',
        'status' => 429,
        'retry_after_seconds' => $retrySeconds,
    ];
}

function is_quota_like_error(string $message): bool {
    $lower = mb_strtolower($message, 'UTF-8');
    return str_contains($lower, 'quota')
        || str_contains($lower, 'rate limit')
        || str_contains($lower, 'resource_exhausted')
        || str_contains($lower, 'high demand')
        || str_contains($lower, 'try again later')
        || str_contains($lower, '429');
}

$localConfig = load_local_config();
$apiKey = $localConfig['gemini_api_key'] ?? env_value('GEMINI_API_KEY');
$configuredModel = $localConfig['gemini_model'] ?? env_value('GEMINI_MODEL', DEFAULT_GEMINI_MODEL) ?? DEFAULT_GEMINI_MODEL;
$modelPool = $localConfig['gemini_models'] ?? [];
if (!is_array($modelPool) || !$modelPool) {
    $modelPool = [$configuredModel];
} else {
    $modelPool = array_values(array_filter(array_map('strval', $modelPool), fn($m) => trim($m) !== ''));
    if (!$modelPool) $modelPool = [$configuredModel];
}
$model = $modelPool[0];

if ($method === 'GET') {
    if (!$apiKey) {
        portfolio_log_write('error', 'chat_health_missing_api_key', ['model' => $model]);
        json_response([
            'ok' => false,
            'error' => 'Gemini API key is not configured on the server.',
            'model' => $model,
        ], 500);
    }
    json_response([
        'ok' => true,
        'mode' => 'api',
        'provider' => 'gemini',
        'model' => $model,
        'models' => $modelPool,
    ]);
}

if ($method !== 'POST') {
    portfolio_log_write('warn', 'chat_method_not_allowed', ['method' => $method]);
    json_response(['error' => 'Method not allowed'], 405);
}

if (!$apiKey) {
    portfolio_log_write('error', 'chat_missing_api_key');
    json_response(['error' => 'Gemini API key is not configured on the server.'], 500);
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput ?: '', true);
if (!is_array($input)) {
    portfolio_log_write('warn', 'chat_invalid_json');
    json_response(['error' => 'Invalid JSON body.'], 400);
}

$question = trim((string) ($input['question'] ?? ''));
$history = is_array($input['history'] ?? null) ? $input['history'] : [];

if ($question === '' || mb_strlen($question, 'UTF-8') < 2) {
    portfolio_log_write('warn', 'chat_invalid_question', ['question_len' => mb_strlen($question, 'UTF-8')]);
    json_response(['error' => 'Question is required.'], 400);
}

try {
    static $kb = null;
    if ($kb === null) $kb = build_kb();
    $contexts = retrieve_context($kb, $question, 4);
    if (!$contexts) {
        json_response([
            'answer' => FALLBACK_MESSAGE,
            'sources' => [],
            'mode' => 'api',
            'provider' => 'gemini',
            'model' => $model,
        ]);
    }

    $prompt = build_prompt($question, $history, $contexts);
    $gemini = null;
    $answer = '';
    $usedModel = $modelPool[0];
    $lastError = null;
    foreach ($modelPool as $candidateModel) {
        try {
            $gemini = gemini_request($apiKey, $candidateModel, $prompt);
            $answer = extract_gemini_text($gemini);
            $usedModel = $candidateModel;
            if ($answer === '') {
                throw new RuntimeException('Empty response from Gemini model ' . $candidateModel);
            }
            break;
        } catch (Throwable $modelErr) {
            $lastError = $modelErr;
            portfolio_log_write('warn', 'chat_model_attempt_failed', [
                'candidate_model' => $candidateModel,
                'error' => $modelErr->getMessage(),
                'question' => mb_substr($question, 0, 200, 'UTF-8'),
            ]);
            // Only fail over to another model for quota/rate issues.
            if (!is_quota_like_error($modelErr->getMessage())) {
                throw $modelErr;
            }
        }
    }

    if ($answer === '') {
        if ($lastError instanceof Throwable) {
            throw $lastError;
        }
        $answer = FALLBACK_MESSAGE;
    }
    if ($answer === '') $answer = FALLBACK_MESSAGE;

    $sourceLabels = [
        '/data/projects.md' => 'Projects',
        '/data/experience.md' => 'Experience',
        '/data/skills.md' => 'Skills',
        '/data/courses.md' => 'Courses',
        '/data/professional-profile.md' => 'Professional Profile',
    ];
    $sources = [];
    foreach ($contexts as $c) {
        $label = $sourceLabels[$c['source']] ?? $c['source'];
        if (!in_array($label, $sources, true)) $sources[] = $label;
    }

    json_response([
        'answer' => $answer,
        'sources' => $sources,
        'mode' => 'api',
        'provider' => 'gemini',
        'model' => $usedModel,
    ]);
} catch (Throwable $e) {
    $friendly = friendly_api_error($e->getMessage());
    portfolio_log_write('error', 'chat_request_failed', [
        'question' => mb_substr($question, 0, 300, 'UTF-8'),
        'error' => $e->getMessage(),
        'friendly_error' => $friendly['message'],
        'status' => $friendly['status'],
        'model' => $model,
        'model_pool' => $modelPool,
    ]);
    json_response([
        'error' => $friendly['message'],
        'retry_after_seconds' => $friendly['retry_after_seconds'] ?? null,
        'mode' => 'api',
        'provider' => 'gemini',
        'model' => $model,
    ], $friendly['status']);
}
