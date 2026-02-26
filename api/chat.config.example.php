<?php
// Copy this file to api/chat.config.php on the server and set your real key there.
// Do NOT commit api/chat.config.php.
return [
    'gemini_api_key' => 'REPLACE_WITH_YOUR_GEMINI_API_KEY',
    'gemini_model' => 'gemini-2.5-flash',
    // Optional model failover pool (tried in order for quota/rate-limit errors only).
    // Use exact model IDs available in your Google AI Studio project.
    // 'gemini_models' => [
    //     'gemini-2.5-flash',
    //     'gemini-2.5-flash-lite',
    // ],
];
