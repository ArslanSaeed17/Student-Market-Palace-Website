// ============================================================
//  Student Market Palace — AI Chatbot Widget
//  chatbot.js  →  calls /api/chat (Vercel serverless)
//  API key is NEVER exposed in the browser
// ============================================================

(function () {
  'use strict';

  // ── Inject CSS ──────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* Floating button */
    #smp-chat-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 58px; height: 58px; border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      border: none; cursor: pointer;
      box-shadow: 0 4px 24px rgba(124,58,237,0.55);
      font-size: 1.5rem; display: flex; align-items: center;
      justify-content: center; transition: transform 0.2s, box-shadow 0.2s;
      animation: smpPulse 3s ease-in-out infinite;
    }
    #smp-chat-btn:hover {
      transform: scale(1.12);
      box-shadow: 0 6px 32px rgba(124,58,237,0.75);
      animation: none;
    }
    @keyframes smpPulse {
      0%, 100% { box-shadow: 0 4px 24px rgba(124,58,237,0.55); }
      50%       { box-shadow: 0 4px 36px rgba(168,85,247,0.8); }
    }

    /* Chat window */
    #smp-chat-window {
      position: fixed; bottom: 98px; right: 28px; z-index: 9998;
      width: 340px; max-height: 500px;
      background: var(--surface, #1e1b2e);
      border: 1px solid var(--border2, rgba(139,92,246,0.3));
      border-radius: 18px;
      box-shadow: 0 12px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1);
      display: none; flex-direction: column; overflow: hidden;
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
      animation: smpSlideIn 0.25s ease;
    }
    #smp-chat-window.open { display: flex; }
    @keyframes smpSlideIn {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to   { opacity: 1; transform: none; }
    }

    /* Header */
    #smp-chat-header {
      padding: 14px 16px;
      background: linear-gradient(135deg, #6d28d9, #a855f7);
      display: flex; align-items: center; gap: 10px;
    }
    #smp-chat-header .smp-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; flex-shrink: 0;
    }
    #smp-chat-header .smp-title { flex: 1; }
    #smp-chat-header .smp-title strong {
      display: block; color: #fff; font-size: 0.9rem; font-weight: 700;
    }
    #smp-chat-header .smp-title span {
      font-size: 0.72rem; color: rgba(255,255,255,0.7);
    }
    #smp-chat-close {
      background: rgba(255,255,255,0.15); border: none; color: #fff;
      width: 28px; height: 28px; border-radius: 50%; font-size: 0.9rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: background 0.15s; flex-shrink: 0;
    }
    #smp-chat-close:hover { background: rgba(255,255,255,0.3); }

    /* Messages */
    #smp-chat-messages {
      flex: 1; overflow-y: auto; padding: 14px 12px;
      display: flex; flex-direction: column; gap: 8px;
      max-height: 360px; scroll-behavior: smooth;
    }
    #smp-chat-messages::-webkit-scrollbar { width: 4px; }
    #smp-chat-messages::-webkit-scrollbar-track { background: transparent; }
    #smp-chat-messages::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 2px; }

    .smp-msg {
      max-width: 88%; padding: 9px 13px; border-radius: 14px;
      font-size: 0.84rem; line-height: 1.55; word-break: break-word;
    }
    .smp-msg.bot {
      background: var(--bg3, #2a2740); color: var(--text, #e2e0f0);
      align-self: flex-start; border-bottom-left-radius: 4px;
    }
    .smp-msg.user {
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      color: #fff; align-self: flex-end; border-bottom-right-radius: 4px;
    }
    .smp-msg.typing { opacity: 0.65; font-style: italic; color: var(--text3, #9896b8); }
    .smp-msg.error { background: rgba(239,68,68,0.15); color: #fca5a5; border: 1px solid rgba(239,68,68,0.25); }

    /* Suggested questions */
    #smp-suggestions {
      display: flex; flex-wrap: wrap; gap: 6px;
      padding: 0 12px 10px;
    }
    .smp-suggestion {
      padding: 5px 11px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;
      background: var(--bg3, #2a2740); color: var(--purple-light, #a78bfa);
      border: 1px solid rgba(139,92,246,0.25); cursor: pointer;
      transition: all 0.15s; white-space: nowrap;
    }
    .smp-suggestion:hover { background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.5); }

    /* Input row */
    #smp-chat-input-row {
      padding: 10px 12px;
      border-top: 1px solid var(--border, rgba(139,92,246,0.15));
      display: flex; gap: 8px; align-items: center;
    }
    #smp-chat-input {
      flex: 1; padding: 9px 12px; border-radius: 10px;
      background: var(--bg3, #2a2740);
      border: 1px solid var(--border, rgba(139,92,246,0.2));
      color: var(--text, #e2e0f0); font-size: 0.84rem;
      font-family: inherit; outline: none; transition: border-color 0.2s;
    }
    #smp-chat-input:focus { border-color: #7c3aed; }
    #smp-chat-input::placeholder { color: var(--text3, #6b6890); }
    #smp-chat-send {
      padding: 9px 14px; background: linear-gradient(135deg, #7c3aed, #a855f7);
      color: #fff; border: none; border-radius: 10px; cursor: pointer;
      font-size: 0.84rem; font-weight: 700; transition: opacity 0.15s, transform 0.15s;
      white-space: nowrap;
    }
    #smp-chat-send:hover:not(:disabled) { opacity: 0.9; transform: scale(1.04); }
    #smp-chat-send:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  `;
  document.head.appendChild(style);

  // ── Build HTML ───────────────────────────────────────────────
  const btn = document.createElement('button');
  btn.id    = 'smp-chat-btn';
  btn.title = 'Chat with SMP Assistant';
  btn.innerHTML = '🤖';

  const win = document.createElement('div');
  win.id = 'smp-chat-window';
  win.innerHTML = `
    <div id="smp-chat-header">
      <div class="smp-avatar">🤖</div>
      <div class="smp-title">
        <strong>SMP Assistant</strong>
        <span>Student Market Palace · Online</span>
      </div>
      <button id="smp-chat-close" title="Close">✕</button>
    </div>
    <div id="smp-chat-messages">
      <div class="smp-msg bot">
        👋 Assalam o Alaikum! Main SMP Assistant hun.<br><br>
        Student Market Palace ke baare mein kuch bhi poochh saktay ho — buying, selling, account, ya contact info!
      </div>
    </div>
    <div id="smp-suggestions">
      <button class="smp-suggestion">How to sell?</button>
      <button class="smp-suggestion">Contact info</button>
      <button class="smp-suggestion">Kitna free hai?</button>
      <button class="smp-suggestion">Safety tips</button>
    </div>
    <div id="smp-chat-input-row">
      <input id="smp-chat-input" type="text" placeholder="Kuch poochho…" autocomplete="off" maxlength="400"/>
      <button id="smp-chat-send">Send ➤</button>
    </div>`;

  document.body.appendChild(btn);
  document.body.appendChild(win);

  // ── State ────────────────────────────────────────────────────
  const chatHistory = [];

  // ── Events ───────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    win.classList.toggle('open');
    if (win.classList.contains('open')) {
      document.getElementById('smp-chat-input').focus();
    }
  });

  document.getElementById('smp-chat-close').addEventListener('click', () => {
    win.classList.remove('open');
  });

  document.getElementById('smp-chat-send').addEventListener('click', sendMessage);

  document.getElementById('smp-chat-input').addEventListener('keypress', e => {
    if (e.key === 'Enter' && !e.shiftKey) sendMessage();
  });

  // Suggested questions — click to autofill and send
  document.getElementById('smp-suggestions').addEventListener('click', e => {
    if (e.target.classList.contains('smp-suggestion')) {
      const input = document.getElementById('smp-chat-input');
      input.value = e.target.textContent;
      // Hide suggestions after first use
      document.getElementById('smp-suggestions').style.display = 'none';
      sendMessage();
    }
  });

  // ── Send message ─────────────────────────────────────────────
  async function sendMessage() {
    const input   = document.getElementById('smp-chat-input');
    const sendBtn = document.getElementById('smp-chat-send');
    const text    = input.value.trim();
    if (!text || sendBtn.disabled) return;

    // Hide suggestions once conversation starts
    document.getElementById('smp-suggestions').style.display = 'none';

    input.value  = '';
    sendBtn.disabled = true;

    appendMessage(text, 'user');
    chatHistory.push({ role: 'user', content: text });

    const typingEl = appendMessage('⏳ Typing…', 'bot typing');

    try {
      // ✅ Calls YOUR serverless function — API key never touches the browser
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      const data = await response.json();

      typingEl.remove();

      if (!response.ok || data.error) {
        appendMessage('⚠️ ' + (data.error || 'Something went wrong. Please try again.'), 'bot error');
      } else {
        const reply = data.reply;
        appendMessage(reply, 'bot');
        chatHistory.push({ role: 'assistant', content: reply });
      }

    } catch (err) {
      typingEl.remove();
      appendMessage('⚠️ Connection error. Please check your internet and try again.', 'bot error');
      console.error('SMP chatbot error:', err);
    }

    sendBtn.disabled = false;
    input.focus();
  }

  // ── Helper ───────────────────────────────────────────────────
  function appendMessage(text, cls) {
    const msgs = document.getElementById('smp-chat-messages');
    const el   = document.createElement('div');
    el.className  = 'smp-msg ' + cls;
    el.innerHTML  = text.replace(/\n/g, '<br>');
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

})(); // IIFE — no global variables leaked
