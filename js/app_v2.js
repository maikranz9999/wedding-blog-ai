// app_v2.js - Wedding Blog AI v2 (Titel per KI, Blogpost per Webhook, Ergebnis per E-Mail)

// Hard init guard (v2 separat von v1)
if (window.__WBAI_V2_INIT__) {
  console.debug('Wedding Blog AI v2 already initialized, skipping re-init');
  throw new Error('__WBAI_V2_DUP_INIT__');
}
window.__WBAI_V2_INIT__ = true;

// ----------------------------
// Learningsuite Query Params
// Wrapper setzt: ?user_id=...&tool_id=...&email=...&first_name=...
// ----------------------------
const __qs = new URLSearchParams(location.search);
const LS_TOOL_ID = Number(__qs.get('tool_id') || '0');
const LS_USER_ID = String(__qs.get('user_id') || '').trim();
const LS_USER_EMAIL = String(__qs.get('email') || '').trim();
const LS_FIRST_NAME = String(__qs.get('first_name') || '').trim();

// ----------------------------
// Config
// ----------------------------
const WRITER_REQUEST_WEBHOOK = 'https://n8n.maikranz-business.com/webhook/90698a91-081f-45ba-8901-c1c32dfa7262';
const MAX_KEYWORDS = 3;

// ----------------------------
// State
// ----------------------------
let selectedKeywords = [];
let isBusy = false;

// ----------------------------
// UI Helpers
// ----------------------------
function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showStatusMessage(html) {
  const statusContainer = document.getElementById('statusMessages');
  if (!statusContainer) return;

  const message = document.createElement('div');
  message.className = 'status-message';
  message.innerHTML = html;

  statusContainer.appendChild(message);
  statusContainer.scrollTop = statusContainer.scrollHeight;

  if (String(html).includes('✅')) {
    setTimeout(() => {
      if (message.parentNode) message.remove();
    }, 12000);
  }
}

function clearStatusMessages() {
  const statusContainer = document.getElementById('statusMessages');
  if (statusContainer) statusContainer.innerHTML = '';
}

function showTyping() {
  const typing = document.getElementById('typing');
  if (typing) typing.style.display = 'block';
}

function hideTyping() {
  const typing = document.getElementById('typing');
  if (typing) typing.style.display = 'none';
}

function setActionState(disabled) {
  const selectors = [
    '#optimizeTitleBtn',
    '#requestPostBtn',
    '#mainKeyword',
    '#blogTitle',
    '#service',
    '#wordCount',
    '#toneStyle',
    '#notes'
  ];
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.disabled = !!disabled;
    });
  });
}

function showToast(msg) {
  let box = document.getElementById('mkz-toast');
  if (!box) {
    box = document.createElement('div');
    box.id = 'mkz-toast';
    box.style.cssText =
      'position:fixed;right:16px;bottom:16px;z-index:99999;display:flex;flex-direction:column;gap:8px';
    document.body.appendChild(box);
  }
  const n = document.createElement('div');
  n.style.cssText =
    'padding:10px 14px;border-radius:10px;font:14px system-ui;color:#fff;background:#b91c1c;box-shadow:0 4px 16px rgba(0,0,0,.25)';
  n.textContent = msg;
  box.appendChild(n);
  setTimeout(() => n.remove(), 4200);
}

// ----------------------------
// Learningsuite Credits Gate + Consume
// ----------------------------
function preflight(kind = 'tool') {
  return new Promise((resolve) => {
    const onMsg = (ev) => {
      const d = ev.data || {};
      if (d.mkz === 'allow_generate') {
        window.removeEventListener('message', onMsg);
        resolve(true);
      }
      if (d.mkz === 'deny_generate') {
        window.removeEventListener('message', onMsg);
        showToast(
          d.reason === 'limit'
            ? `Credit Limit erreicht. Noch ${d.days_left} Tage bis Reset.`
            : 'Aktion abgebrochen.'
        );
        resolve(false);
      }
    };

    window.addEventListener('message', onMsg);
    window.parent.postMessage({ mkz: 'request_generate', tool_id: LS_TOOL_ID, kind }, '*');

    setTimeout(() => {
      window.removeEventListener('message', onMsg);
      resolve(false);
    }, 5000);
  });
}

let __lastConsumeAt = 0;
function sendConsume(action, input = {}, output = {}, kind = 'tool') {
  const now = Date.now();
  if (now - __lastConsumeAt < 1200) return;
  __lastConsumeAt = now;

  window.parent.postMessage(
    {
      mkz: 'consume',
      tool_id: LS_TOOL_ID,
      kind,
      payload: { action, input, output }
    },
    '*'
  );
}

// ----------------------------
// Height reporting (für Learningsuite iframe auto height)
// ----------------------------
function reportHeight() {
  const h = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    document.documentElement.offsetHeight,
    document.body.offsetHeight
  );
  window.parent?.postMessage({ mkz: 'content_height', tool_id: LS_TOOL_ID, height: h }, '*');
}
window.addEventListener('message', (ev) => {
  const d = ev.data || {};
  if (d.mkz === 'request_height') reportHeight();
});
try {
  const ro = new ResizeObserver(() => reportHeight());
  ro.observe(document.documentElement);
  ro.observe(document.body);
} catch {
  // ignore
}
setInterval(reportHeight, 2000);
document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';

// ----------------------------
// Keywords UI
// ----------------------------
const predefinedKeywords = [
  'Hochzeit',
  'Hochzeitsplanung',
  'Hochzeitslocation',
  'Freie Trauung',
  'Hochzeitsbudget',
  'Kosten Hochzeit',
  'Hochzeitsfotograf',
  'Hochzeitsvideograf',
  'Hochzeitsdeko',
  'Trauredner',
  'DJ Hochzeit',
  'Hochzeitsband',
  'Hochzeitseinladung',
  'Hochzeitstorte',
  'Brautkleid',
  'Brautfrisur'
];

function updateKeywordCounter() {
  const counter = document.getElementById('keywordCounter');
  if (!counter) return;
  counter.textContent = `${selectedKeywords.length}/${MAX_KEYWORDS}`;
  if (selectedKeywords.length >= MAX_KEYWORDS) counter.classList.add('full');
  else counter.classList.remove('full');
}

function renderKeywords() {
  const container = document.getElementById('keywordsDisplay');
  if (!container) return;
  container.innerHTML = '';

  selectedKeywords.forEach((keyword, index) => {
    const pill = document.createElement('div');
    pill.className = index === 0 ? 'keyword-pill primary' : 'keyword-pill secondary';
    pill.innerHTML = `
      <span>${escapeHtml(keyword)}</span>
      <span class="keyword-remove">×</span>
    `;
    pill.querySelector('.keyword-remove').addEventListener('click', () => removeKeyword(keyword));
    container.appendChild(pill);
  });
}

function hideKeywordDropdown() {
  const dropdown = document.getElementById('keywordDropdown');
  if (dropdown) dropdown.style.display = 'none';
}

function showKeywordDropdown(searchTerm) {
  if (selectedKeywords.length >= MAX_KEYWORDS) {
    hideKeywordDropdown();
    return;
  }

  const dropdown = document.getElementById('keywordDropdown');
  if (!dropdown) return;

  const value = String(searchTerm || '').trim().toLowerCase();
  const matches = predefinedKeywords
    .filter((k) => k.toLowerCase().includes(value) && !selectedKeywords.includes(k))
    .slice(0, 8);

  let html = '';
  matches.forEach((k) => {
    html += `<div class="dropdown-item" data-k="${escapeHtml(k)}">${escapeHtml(k)}</div>`;
  });

  const raw = String(searchTerm || '').trim();
  if (raw && !selectedKeywords.includes(raw)) {
    const alreadyInList = matches.some((m) => m.toLowerCase() === raw.toLowerCase());
    if (!alreadyInList) {
      html += `<div class="dropdown-item create-new" data-k="${escapeHtml(raw)}">+ "${escapeHtml(raw)}" hinzufügen</div>`;
    }
  }

  if (!html) {
    hideKeywordDropdown();
    return;
  }

  dropdown.innerHTML = html;
  dropdown.style.display = 'block';

  dropdown.querySelectorAll('.dropdown-item').forEach((el) => {
    el.addEventListener('click', () => addKeyword(el.getAttribute('data-k')));
  });
}

function addKeyword(keywordText) {
  const k = String(keywordText || '').trim();
  if (!k) return;

  if (selectedKeywords.length >= MAX_KEYWORDS) {
    showStatusMessage(`❌ Du hast schon ${MAX_KEYWORDS} Keywords gesetzt. Entferne zuerst eins.`);
    return;
  }
  if (selectedKeywords.includes(k)) return;

  selectedKeywords.push(k);
  renderKeywords();
  updateKeywordCounter();

  const input = document.getElementById('mainKeyword');
  if (input) input.value = '';
  hideKeywordDropdown();
}

function removeKeyword(keywordText) {
  selectedKeywords = selectedKeywords.filter((k) => k !== keywordText);
  renderKeywords();
  updateKeywordCounter();
}

function getKeywordsString() {
  return selectedKeywords.join(', ');
}

function initKeywordTagSystem() {
  const input = document.getElementById('mainKeyword');
  const dropdown = document.getElementById('keywordDropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', (e) => {
    const v = e.target.value || '';
    if (String(v).trim().length > 0) showKeywordDropdown(v);
    else hideKeywordDropdown();
  });

  input.addEventListener('focus', () => {
    const v = input.value || '';
    showKeywordDropdown(v);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword(input.value);
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tag-input-container')) hideKeywordDropdown();
  });
}

// ----------------------------
// Claude API (für Titel Optimierung)
// ----------------------------
async function callAI(prompt, type = 'general') {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, type })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error (${response.status})`);
  }

  const data = await response.json();
  return data.content;
}

// ----------------------------
// Actions
// ----------------------------
async function optimizeTitle() {
  if (!(await preflight('tool'))) return;

  const titleInput = document.getElementById('blogTitle');
  if (!titleInput) return;

  const originalTitle = String(titleInput.value || '').trim();
  if (!originalTitle) {
    showStatusMessage('❌ Bitte gib zuerst einen Titel ein.');
    return;
  }

  const optimizeBtn = document.getElementById('optimizeTitleBtn');
  if (optimizeBtn) {
    optimizeBtn.classList.add('loading');
    optimizeBtn.disabled = true;
  }

  showTyping();
  try {
    const optimizedTitle = await callAI(
      `Optimiere diesen Hochzeitsblog Titel für SEO: "${originalTitle}"
Regeln:
- Maximal 60 Zeichen
- Du Form
- Hauptkeyword möglichst weit vorne
Gib nur den optimierten Titel zurück, ohne Anführungszeichen.`,
      'title-optimization'
    );

    titleInput.value = String(optimizedTitle || '').trim();
    showStatusMessage(`✅ <strong>Optimierter Titel:</strong><br>${escapeHtml(titleInput.value)}`);

    sendConsume(
      'optimize_title',
      { original_title: originalTitle },
      { optimized_title: titleInput.value },
      'tool'
    );
  } catch (error) {
    showStatusMessage(`❌ <strong>Fehler bei der Titel Optimierung:</strong> ${escapeHtml(error.message)}`);
  } finally {
    hideTyping();
    if (optimizeBtn) {
      optimizeBtn.classList.remove('loading');
      optimizeBtn.disabled = false;
    }
  }
}

async function requestPostByEmail() {
  if (isBusy) return;
  if (!(await preflight('tool'))) return;

  const title = String(document.getElementById('blogTitle')?.value || '').trim();
  const service = String(document.getElementById('service')?.value || '').trim();
  const wordCount = Number(document.getElementById('wordCount')?.value || '1500');
  const tone = String(document.getElementById('toneStyle')?.value || 'freundlich-beratend').trim();
  const notes = String(document.getElementById('notes')?.value || '').trim();

  if (!title) {
    showStatusMessage('❌ Bitte gib einen Titel ein.');
    return;
  }
  if (!selectedKeywords.length) {
    showStatusMessage('❌ Bitte setze mindestens ein Keyword.');
    return;
  }
  if (!service) {
    showStatusMessage('❌ Bitte trage deine Dienstleistung ein, damit Backlinks passend gewählt werden.');
    return;
  }
  if (!LS_USER_EMAIL) {
    showStatusMessage('❌ Deine E Mail fehlt. Bitte öffne das Tool über die Learningsuite Card.');
    return;
  }

  const btn = document.getElementById('requestPostBtn');
  isBusy = true;
  setActionState(true);
  if (btn) btn.innerHTML = '⏳ Anfrage wird gesendet...';

  showTyping();
  clearStatusMessages();

  const payload = {
    schemaVersion: 1,
    source: 'learningsuite_wedding_blog_ai_v2',
    requestedAtIso: new Date().toISOString(),
    requester: {
      userId: LS_USER_ID,
      email: LS_USER_EMAIL,
      firstName: LS_FIRST_NAME,
      toolId: LS_TOOL_ID
    },
    input: {
      title,
      mainKeyword: selectedKeywords[0] || '',
      keywords: selectedKeywords,
      service,
      notes,
      wordCount,
      tone,
      language: 'de'
    }
  };

  try {
    const r = await fetch(WRITER_REQUEST_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const rawText = await r.text();
    let resp = null;
    try { resp = rawText ? JSON.parse(rawText) : null; } catch { resp = { raw: rawText }; }

    if (!r.ok) {
      const msg = resp?.message || resp?.error || `HTTP ${r.status}`;
      showStatusMessage(`❌ <strong>Fehler beim Senden:</strong> ${escapeHtml(msg)}`);
      return;
    }

    sendConsume(
      'request_blogpost',
      { title, keywords: selectedKeywords, service, wordCount, tone },
      { response: resp },
      'tool'
    );

    const name = LS_FIRST_NAME ? `, ${escapeHtml(LS_FIRST_NAME)}` : '';
    showStatusMessage(
      `✅ <strong>Alles klar${name}.</strong><br>` +
      `Wir haben deine Anfrage gespeichert. Du bekommst in etwa 15 Minuten eine E Mail an <strong>${escapeHtml(LS_USER_EMAIL)}</strong> mit dem fertigen Blogpost.`
    );

  } catch (error) {
    showStatusMessage(
      `❌ <strong>Netzwerkfehler:</strong> ${escapeHtml(error.message || String(error))}<br><br>` +
      `Wenn das im Browser passiert, ist es oft CORS. Dann sende den Request über eine serverseitige Proxy Route (z.B. Vercel API Route), die an n8n weiterleitet.`
    );
  } finally {
    hideTyping();
    isBusy = false;
    setActionState(false);
    if (btn) btn.innerHTML = '📩 Blogpost anfordern, Ergebnis per E Mail';
  }
}

// ----------------------------
// Init
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
  initKeywordTagSystem();
  updateKeywordCounter();

  // Buttons (falls nicht inline onclick genutzt wird)
  const optimizeBtn = document.getElementById('optimizeTitleBtn');
  if (optimizeBtn) optimizeBtn.addEventListener('click', optimizeTitle);

  const requestBtn = document.getElementById('requestPostBtn');
  if (requestBtn) requestBtn.addEventListener('click', requestPostByEmail);

  // Enter Key für Titel
  const titleInput = document.getElementById('blogTitle');
  if (titleInput) {
    titleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') optimizeTitle();
    });
  }

  if (!LS_USER_EMAIL) {
    showStatusMessage('⚠️ Hinweis: Email wurde nicht übergeben. In der Learningsuite Card muss userEmail korrekt gesetzt sein.');
  }

  setTimeout(() => {
    showStatusMessage(
      '🎯 <strong>Bereit.</strong><br>' +
      '1) Titel eintragen oder per Zauberstab optimieren. ' +
      '2) Keywords setzen. ' +
      '3) Dienstleistung eintragen. ' +
      '4) Absenden und Ergebnis per E Mail erhalten.'
    );
  }, 400);
});

// Export in window (falls HTML onclick verwendet wird)
window.optimizeTitle = optimizeTitle;
window.requestPostByEmail = requestPostByEmail;
