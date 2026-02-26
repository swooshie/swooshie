// Portfolio Chatbot - self contained widget using Shadow DOM
(() => {
  if (window.__portfolioBotLoaded) return;
  window.__portfolioBotLoaded = true;

  const CHAT_API_ENDPOINT = "/api/chat.php";
  const LOG_API_ENDPOINT = "/api/log.php";
  const DATA_PATHS = [
    "/data/projects.md",
    "/data/experience.md",
    "/data/skills.md",
    "/data/courses.md",
  ];
  const SOURCE_LABELS = {
    "/data/projects.md": "Projects",
    "/data/experience.md": "Experience",
    "/data/skills.md": "Skills",
    "/data/courses.md": "Courses",
  };
  const STOPWORDS = new Set([
    "the", "and", "for", "with", "that", "this", "from", "what", "about", "into",
    "your", "have", "has", "did", "does", "are", "was", "were", "how", "can",
    "you", "his", "her", "their", "them", "they", "but", "not", "all", "any",
    "who", "where", "when", "why", "which", "tell", "more", "please", "like"
  ]);
  const FALLBACK_MESSAGE =
    "I don't know based on the provided portfolio notes. If you want, tell me what to add.";

  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.bottom = "18px";
  host.style.right = "18px";
  host.style.zIndex = "2147483646";
  host.style.maxWidth = "100vw";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host {
        all: initial;
        font-family: "Inter", "SF Pro Text", system-ui, -apple-system, sans-serif;
      }
      .bot-shell {
        position: relative;
        display: flex;
        justify-content: flex-end;
      }
      .chat-toggle {
        pointer-events: auto;
        border: none;
        background: linear-gradient(135deg, #111827, #1f2937);
        color: #f9fafb;
        width: 54px;
        height: 54px;
        border-radius: 999px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: transform 160ms ease, box-shadow 160ms ease;
      }
      .chat-toggle.nudge {
        animation: botNudge 900ms ease 2;
      }
      .chat-toggle:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
      }
      .chat-toggle:active {
        transform: translateY(0);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.24);
      }
      .panel {
        position: absolute;
        bottom: 64px;
        right: 0;
        width: min(520px, 96vw);
        max-height: min(70vh, 680px);
        background: #0b1222;
        color: #e5e7eb;
        border-radius: 16px;
        box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.08);
        overflow: hidden;
        display: grid;
        grid-template-rows: auto 1fr auto;
        transform-origin: bottom right;
        opacity: 0;
        transform: translateY(10px) scale(0.98);
        pointer-events: none;
        transition: opacity 180ms ease, transform 180ms ease;
      }
      .panel.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      .panel-header {
        padding: 12px 14px;
        background: rgba(255, 255, 255, 0.03);
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .title {
        font-weight: 600;
        letter-spacing: 0.01em;
        font-size: 14px;
      }
      .status {
        color: #9ca3af;
        font-size: 12px;
      }
      .mode-badge {
        margin-top: 4px;
        display: inline-flex;
        align-items: center;
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.04);
        color: #cbd5e1;
      }
      .mode-badge.local {
        border-color: rgba(16, 185, 129, 0.3);
        background: rgba(16, 185, 129, 0.08);
        color: #a7f3d0;
      }
      .mode-badge.notes {
        border-color: rgba(245, 158, 11, 0.35);
        background: rgba(245, 158, 11, 0.08);
        color: #fde68a;
      }
      .mode-badge.api {
        border-color: rgba(59, 130, 246, 0.35);
        background: rgba(59, 130, 246, 0.08);
        color: #bfdbfe;
      }
      .header-actions {
        margin-left: auto;
        display: flex;
        gap: 6px;
      }
      .ghost-btn, .icon-btn {
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.04);
        color: #e5e7eb;
        border-radius: 10px;
        font-size: 12px;
        padding: 6px 10px;
        cursor: pointer;
        transition: background 140ms ease, border-color 140ms ease;
      }
      .ghost-btn:hover, .icon-btn:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.16);
      }
      .ghost-btn:active, .icon-btn:active {
        background: rgba(255, 255, 255, 0.12);
      }
      .icon-btn {
        padding: 6px;
        width: 30px;
        height: 30px;
        display: grid;
        place-items: center;
      }
      .messages {
        padding: 12px;
        overflow-y: auto;
        background: radial-gradient(circle at 20% 20%, rgba(32, 64, 128, 0.12), transparent 30%), #0b1222;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .message {
        border-radius: 12px;
        padding: 10px 12px;
        line-height: 1.4;
        font-size: 13px;
        white-space: pre-wrap;
        word-break: break-word;
        overflow-wrap: anywhere;
        max-width: 100%;
      }
      .user {
        background: linear-gradient(135deg, #1d4ed8, #2563eb);
        color: #f8fafc;
        align-self: flex-end;
      }
      .assistant {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #e5e7eb;
        align-self: flex-start;
      }
      .system {
        background: rgba(255, 255, 255, 0.04);
        color: #cbd5e1;
        font-style: italic;
      }
      .composer {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        padding: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(6, 12, 24, 0.9);
      }
      .composer textarea {
        resize: none;
        height: 62px;
        padding: 10px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.04);
        color: #f1f5f9;
        font-size: 13px;
        outline: none;
        overflow-wrap: anywhere;
        transition: border-color 140ms ease, background 140ms ease;
      }
      .composer textarea:focus {
        border-color: rgba(59, 130, 246, 0.7);
        background: rgba(255, 255, 255, 0.06);
      }
      .send-btn {
        padding: 0 14px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(135deg, #10b981, #34d399);
        color: #052e16;
        font-weight: 700;
        cursor: pointer;
        transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
        min-width: 84px;
      }
      .send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .send-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 8px 18px rgba(16, 185, 129, 0.35);
      }
      .send-btn:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: none;
      }
      .loader-row {
        padding: 10px 12px;
        color: #cbd5e1;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.12);
        border-top-color: #60a5fa;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes botNudge {
        0% { transform: translateY(0) scale(1); }
        20% { transform: translateY(-4px) scale(1.03); }
        40% { transform: translateY(0) scale(1); }
        60% { transform: translateY(-3px) scale(1.02); }
        100% { transform: translateY(0) scale(1); }
      }
      .error {
        padding: 10px 12px;
        background: rgba(239, 68, 68, 0.08);
        color: #fecdd3;
        border-top: 1px solid rgba(239, 68, 68, 0.25);
        font-size: 13px;
      }
      .hidden {
        display: none;
      }
      @media (max-width: 480px) {
        .panel {
          bottom: 68px;
          width: min(98vw, 440px);
          max-height: 68vh;
        }
        .chat-toggle {
          width: 50px;
          height: 50px;
        }
      }
    </style>
    <div class="bot-shell">
      <button class="chat-toggle" aria-label="Open portfolio chat" type="button">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      <div class="panel" aria-live="polite">
        <div class="panel-header">
          <div>
            <div class="title">Portfolio Chat</div>
            <div class="status">Loading notes...</div>
            <div class="mode-badge">Initializing...</div>
          </div>
          <div class="header-actions">
            <button class="ghost-btn clear-btn" type="button">Clear chat</button>
            <button class="icon-btn close-btn" aria-label="Close chat" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="messages"></div>
        <div class="loader-row hidden">
          <div class="spinner"></div>
          <span class="loader-text">Connecting to chat service...</span>
        </div>
        <div class="error hidden"></div>
        <form class="composer">
          <textarea name="message" placeholder="Ask about my projects, experience, skills, or courses" minlength="2"></textarea>
          <button class="send-btn" type="submit" disabled>Send</button>
        </form>
      </div>
    </div>
  `;

  const panel = shadow.querySelector(".panel");
  const toggleBtn = shadow.querySelector(".chat-toggle");
  const closeBtn = shadow.querySelector(".close-btn");
  const clearBtn = shadow.querySelector(".clear-btn");
  const messagesEl = shadow.querySelector(".messages");
  const loaderRow = shadow.querySelector(".loader-row");
  const loaderText = shadow.querySelector(".loader-text");
  const statusEl = shadow.querySelector(".status");
  const modeBadgeEl = shadow.querySelector(".mode-badge");
  const errorEl = shadow.querySelector(".error");
  const form = shadow.querySelector(".composer");
  const textarea = form.querySelector("textarea");
  const sendBtn = form.querySelector(".send-btn");

  let knowledgeBase = [];
  const chatHistory = [];
  let modelReady = false;
  let kbReady = true;
  let isSending = false;
  let notesOnlyMode = false;
  let activeModelId = null;
  let didAutoOpen = false;
  let pendingReadyChime = false;
  let interactionAudioUnlocked = false;

  const setStatus = (text) => {
    statusEl.textContent = text;
  };

  const setModeBadge = (kind, text) => {
    modeBadgeEl.classList.remove("local", "notes", "api");
    if (kind) modeBadgeEl.classList.add(kind);
    modeBadgeEl.textContent = text;
  };

  const logClientError = async (message, context = {}, level = "error") => {
    try {
      await fetch(LOG_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          message,
          context: {
            ...context,
            page: window.location.pathname,
            mode_badge: modeBadgeEl?.textContent || null,
          },
        }),
      });
    } catch (_) {
      // Ignore logger failures.
    }
  };

  const showLoader = (text) => {
    loaderText.textContent = text;
    loaderRow.classList.remove("hidden");
  };

  const openPanel = () => {
    panel.classList.add("open");
    setTimeout(() => textarea.focus(), 120);
  };

  const playReadyChime = async () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.connect(ctx.destination);

      // A short notification swoosh/chime inspired cue (not an Apple audio asset).
      const o1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      o1.type = "triangle";
      o1.frequency.setValueAtTime(950, now);
      o1.frequency.exponentialRampToValueAtTime(620, now + 0.11);
      g1.gain.setValueAtTime(0.0001, now);
      g1.gain.exponentialRampToValueAtTime(0.055, now + 0.014);
      g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      o1.connect(g1).connect(master);

      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = "sine";
      o2.frequency.setValueAtTime(520, now + 0.08);
      o2.frequency.exponentialRampToValueAtTime(760, now + 0.2);
      g2.gain.setValueAtTime(0.0001, now + 0.08);
      g2.gain.exponentialRampToValueAtTime(0.04, now + 0.11);
      g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      o2.connect(g2).connect(master);

      o1.start(now);
      o1.stop(now + 0.15);
      o2.start(now + 0.08);
      o2.stop(now + 0.25);

      setTimeout(() => {
        try { ctx.close(); } catch (_) {}
      }, 450);
      return true;
    } catch (_) {
      return false;
    }
  };

  const announceChatReady = async () => {
    if (didAutoOpen) return;
    didAutoOpen = true;
    const key = "portfolio_bot_auto_open_seen";
    let seen = false;
    try { seen = window.sessionStorage.getItem(key) === "1"; } catch (_) {}
    if (seen) return;
    try { window.sessionStorage.setItem(key, "1"); } catch (_) {}

    setTimeout(async () => {
      toggleBtn.classList.add("nudge");
      openPanel();
      pendingReadyChime = true;
      if (interactionAudioUnlocked) {
        const played = await playReadyChime();
        if (played) pendingReadyChime = false;
      }
      setTimeout(() => toggleBtn.classList.remove("nudge"), 1800);
    }, 1500);
  };

  const hideLoader = () => {
    loaderRow.classList.add("hidden");
  };

  const showError = (text) => {
    errorEl.textContent = text;
    errorEl.classList.remove("hidden");
  };

  const clearError = () => {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  };

  const addMessage = (role, content) => {
    const msg = document.createElement("div");
    msg.className = `message ${role}`;
    msg.textContent = content;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const detectIntent = (query) => {
    const q = query.toLowerCase();
    if (/\b(project|repo|github|built|build)\b/.test(q)) return "projects";
    if (/\b(experience|work|job|role|intern|company|nyu|sainapse|aidash|paypal)\b/.test(q)) return "experience";
    if (/\b(skill|stack|tech|technology|tools|languages|framework)\b/.test(q)) return "skills";
    if (/\b(course|coursework|class|study|studied|education|nyu tandon|bits)\b/.test(q)) return "courses";
    return "general";
  };

  const sourceBoostForIntent = (source, intent) => {
    if (intent === "projects" && source === "/data/projects.md") return 2.5;
    if (intent === "experience" && source === "/data/experience.md") return 2.5;
    if (intent === "skills" && source === "/data/skills.md") return 2.5;
    if (intent === "courses" && source === "/data/courses.md") return 2.5;
    return 0;
  };

  const cleanSnippet = (text, maxLen = 340) => {
    const compact = text.replace(/\s+/g, " ").trim();
    return compact.length > maxLen ? `${compact.slice(0, maxLen).trim()}...` : compact;
  };

  const extractHelpfulLines = (chunkText, queryTokens) => {
    const lines = chunkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .filter((l) => !/^---+$/.test(l));

    const scored = lines.map((line) => {
      const lower = line.toLowerCase();
      let score = 0;
      for (const t of queryTokens) {
        if (lower.includes(t)) score += 2;
      }
      if (/^#{1,6}\s/.test(line)) score += 1.5;
      if (/^[-*]\s/.test(line)) score += 1;
      if (/\*\*/.test(line)) score += 0.5;
      return { line, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.line.replace(/^[-*]\s*/, ""))
      .join(" | ");
  };

  const answerFromNotesOnly = (question) => {
    const intent = detectIntent(question);
    const qTokens = tokenize(question);
    const contexts = retrieveContext(question, 3);
    if (!contexts.length) return FALLBACK_MESSAGE;

    const bullets = contexts.map((c) => {
      const sourceLabel = SOURCE_LABELS[c.source] || c.source;
      const focused = extractHelpfulLines(c.text, qTokens);
      const snippet = focused ? cleanSnippet(focused, 320) : cleanSnippet(c.text, 320);
      return `- [${sourceLabel}] ${snippet}`;
    });

    const sourceList = [...new Set(contexts.map((c) => SOURCE_LABELS[c.source] || c.source))].join(", ");
    const intentLabel = intent === "general" ? "general portfolio question" : `${intent} question`;
    return [
      `Notes-only mode: I could not load the on-device model, so I am answering directly from your portfolio notes (${intentLabel}).`,
      "",
      ...bullets,
      "",
      `Sources used: ${sourceList}`,
      "Ask a narrower question (for example: 'What did I build at Sainapse?' or 'What is the Market Data Service stack?') for a more precise answer.",
    ].join("\n");
  };

  const sanitizeText = (text) =>
    text
      .replace(/\r/g, "")
      .trim();

  const chunkText = (text, source) => {
    const parts = sanitizeText(text).split(/\n\s*\n/);
    const chunks = [];
    let buffer = "";
    for (const part of parts) {
      const seg = part.trim();
      if (!seg) continue;
      if ((buffer + "\n\n" + seg).length > 650 && buffer) {
        chunks.push(buffer.trim());
        buffer = seg;
      } else {
        buffer = buffer ? `${buffer}\n\n${seg}` : seg;
      }
    }
    if (buffer) chunks.push(buffer.trim());
    return chunks.map((chunk) => ({
      source,
      text: chunk,
      tokens: tokenize(chunk),
    }));
  };

  const tokenize = (text) =>
    (text.toLowerCase().match(/\b[\w-]{2,}\b/g) || [])
      .map((w) => w)
      .filter((w) => !STOPWORDS.has(w));

  const initApi = async () => {
    showLoader("Connecting to chat service...");
    setStatus("Connecting...");
    setModeBadge(null, "Connecting...");
    try {
      const res = await fetch(CHAT_API_ENDPOINT, { method: "GET" });
      if (!res.ok) throw new Error(`API health check failed (${res.status})`);
      const data = await res.json().catch(() => ({}));
      modelReady = true;
      activeModelId = data?.model || "Gemini";
      hideLoader();
      setStatus(`API ready (${activeModelId})`);
      setModeBadge("api", "API mode");
      sendBtn.disabled = false;
      announceChatReady();
    } catch (err) {
      console.error("Portfolio bot API init error:", err);
      logClientError("api_init_failed", {
        error: err instanceof Error ? err.message : String(err),
      });
      hideLoader();
      showError("Chat service is unavailable. Configure /api/chat.php and a Gemini API key on the server.");
      setStatus("API unavailable");
      setModeBadge("notes", "API unavailable");
      sendBtn.disabled = true;
    }
  };

  const retrieveContext = (query, topK = 3) => {
    const intent = detectIntent(query);
    const qTokens = tokenize(query);
    if (!qTokens.length || !knowledgeBase.length) return [];
    const qLower = query.toLowerCase().trim();
    const scores = knowledgeBase.map((chunk) => {
      let score = 0;
      let uniqueHits = 0;
      for (const token of qTokens) {
        if (chunk.tokens.includes(token)) {
          score += 1;
          uniqueHits += 1;
        }
      }
      if (qLower && chunk.text.toLowerCase().includes(qLower)) score += 4;
      if (qTokens.length >= 2) {
        for (let i = 0; i < qTokens.length - 1; i += 1) {
          const phrase = `${qTokens[i]} ${qTokens[i + 1]}`;
          if (chunk.text.toLowerCase().includes(phrase)) score += 1.5;
        }
      }
      const density = score / (chunk.tokens.length || 1);
      const titleBoost = /^#{1,3}\s/m.test(chunk.text) ? 0.4 : 0;
      const intentBoost = sourceBoostForIntent(chunk.source, intent);
      return { chunk, score: score + density + titleBoost + intentBoost + uniqueHits * 0.15 };
    });
    return scores
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((s) => s.chunk);
  };

  const buildPrompt = (question) => {
    const contexts = retrieveContext(question);
    if (!contexts.length) return { canAnswer: false, messages: [] };
    const contextBlock = contexts
      .map((c, idx) => `Chunk ${idx + 1} (${c.source}):\n${c.text}`)
      .join("\n\n");
    const system = [
      "You are a helpful portfolio guide.",
      "Use only the provided context to answer.",
      "Do not rely on any outside knowledge or prior responses.",
      "If the context does not have the answer, respond exactly with:",
      `"${FALLBACK_MESSAGE}"`,
      "Keep answers concise unless the user asks for more detail.",
      "Context:",
      contextBlock,
    ].join("\n");
    const recentHistory = chatHistory.slice(-6);
    return {
      canAnswer: true,
      messages: [
        { role: "system", content: system },
        ...recentHistory,
        { role: "user", content: question },
      ],
    };
  };

  const sendToModel = async (question) => {
    if (!modelReady) throw new Error("API not ready");
    const recentHistory = chatHistory.slice(-8);
    const res = await fetch(CHAT_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        history: recentHistory,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      await logClientError("chat_api_error", {
        status: res.status,
        api_error: data?.error || null,
        question,
      });
      throw new Error(data?.error || `Chat API failed (${res.status})`);
    }
    if (data?.model) {
      activeModelId = data.model;
      setStatus(`API ready (${activeModelId})`);
    }
    if (Array.isArray(data?.sources) && data.sources.length) {
      return `${data.answer}\n\nSources: ${data.sources.join(", ")}`;
    }
    return data?.answer || FALLBACK_MESSAGE;
  };

  const togglePanel = () => {
    const isOpen = panel.classList.toggle("open");
    if (!isOpen) {
      textarea.blur();
    } else {
      setTimeout(() => textarea.focus(), 120);
    }
  };

  const clearChat = () => {
    messagesEl.innerHTML = "";
    chatHistory.length = 0;
    clearError();
    addMessage(
      "system",
      "Hi, I am a portfolio chatbot backed by a secure API. Ask about projects, experience, skills, or courses."
    );
  };

  toggleBtn.addEventListener("click", () => {
    togglePanel();
  });

  closeBtn.addEventListener("click", () => {
    panel.classList.remove("open");
  });

  clearBtn.addEventListener("click", () => {
    clearChat();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = textarea.value.trim();
    if (!question || isSending || !kbReady || !modelReady) return;
    clearError();
    addMessage("user", question);
    textarea.value = "";
    textarea.style.height = "62px";
    sendBtn.disabled = true;
    isSending = true;
    showLoader("Thinking...");
    try {
      const answer = await sendToModel(question);
      chatHistory.push({ role: "user", content: question });
      chatHistory.push({ role: "assistant", content: answer });
      if (chatHistory.length > 12) chatHistory.splice(0, chatHistory.length - 12);
      addMessage("assistant", answer);
    } catch (err) {
      console.error("Portfolio bot chat error:", err);
      const msg = err instanceof Error ? err.message : "Something went wrong while answering. Please try again.";
      logClientError("chat_send_failed", {
        error: msg,
        question,
      });
      showError(msg);
      chatHistory.push({ role: "user", content: question });
      chatHistory.push({ role: "assistant", content: msg });
      addMessage("assistant", msg);
    } finally {
      isSending = false;
      hideLoader();
      if (kbReady && modelReady) sendBtn.disabled = false;
    }
  });

  textarea.addEventListener("input", () => {
    textarea.style.height = "62px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  });

  // Prevent scroll capture when panel is closed
  const observer = new MutationObserver(() => {
    if (panel.classList.contains("open")) {
      host.style.pointerEvents = "auto";
    } else {
      host.style.pointerEvents = "auto";
    }
  });
  observer.observe(panel, { attributes: true, attributeFilter: ["class"] });

  window.addEventListener("error", (event) => {
    logClientError("window_error", {
      message: event.message,
      source: event.filename,
      line: event.lineno,
      column: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    logClientError("unhandled_rejection", {
      reason: typeof reason === "string"
        ? reason
        : (reason?.message || String(reason)),
    });
  });

  const tryPlayPendingReadyChime = async () => {
    interactionAudioUnlocked = true;
    if (!pendingReadyChime) return;
    const played = await playReadyChime();
    if (played) {
      pendingReadyChime = false;
    } else {
      logClientError("ready_chime_blocked", {}, "warn");
    }
  };

  window.addEventListener("pointerdown", tryPlayPendingReadyChime, { once: true });
  window.addEventListener("keydown", tryPlayPendingReadyChime, { once: true });

  // Initialize
  clearChat();
  setModeBadge(null, "Initializing...");
  initApi();
})();
