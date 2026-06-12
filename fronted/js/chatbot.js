//  Student Market Palace — Chatbot Widget  v3.0
//  Fixed: position, z-index, events, scroll, send
//  New: dancing bot, glassmorphism UI, smooth animations
// ============================================================
(function () {
  'use strict';

  // ── Inject CSS ──────────────────────────────────────────────
  const css = `
    #smp-fab {
      position: fixed !important;
      bottom: 32px !important;
      right: 32px !important;
      z-index: 2147483647 !important;
      width: 68px;
      height: 68px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex !important;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      background: linear-gradient(135deg, #7c3aed, #a855f7, #06b6d4);
      background-size: 200% 200%;
      box-shadow: 0 8px 32px rgba(124,58,237,0.55), 0 0 0 0 rgba(168,85,247,0.4);
      animation: smp-dance 1.8s ease-in-out infinite, smp-gradshift 3s ease infinite, smp-pulse-ring 2s ease-out infinite;
      transform-origin: center;
      transition: transform 0.2s;
    }

    #smp-fab:hover {
      transform: scale(1.15) rotate(-5deg) !important;
      box-shadow: 0 12px 48px rgba(124,58,237,0.75), 0 0 60px rgba(168,85,247,0.4);
    }

    @keyframes smp-dance {
      0%   { transform: translateY(0px) rotate(0deg); }
      15%  { transform: translateY(-12px) rotate(-8deg); }
      30%  { transform: translateY(-6px) rotate(6deg); }
      45%  { transform: translateY(-14px) rotate(-5deg); }
      60%  { transform: translateY(-4px) rotate(4deg); }
      75%  { transform: translateY(-10px) rotate(-3deg); }
      90%  { transform: translateY(-2px) rotate(2deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }

    @keyframes smp-gradshift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes smp-pulse-ring {
      0%   { box-shadow: 0 8px 32px rgba(124,58,237,0.55), 0 0 0 0 rgba(168,85,247,0.5); }
      70%  { box-shadow: 0 8px 32px rgba(124,58,237,0.55), 0 0 0 18px rgba(168,85,247,0); }
      100% { box-shadow: 0 8px 32px rgba(124,58,237,0.55), 0 0 0 0 rgba(168,85,247,0); }
    }

    #smp-fab .smp-fab-emoji {
      display: block;
      animation: smp-emoji-bounce 1.8s ease-in-out infinite;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
    }

    @keyframes smp-emoji-bounce {
      0%,100% { transform: scale(1) rotate(0deg); }
      25%     { transform: scale(1.2) rotate(-10deg); }
      50%     { transform: scale(0.95) rotate(8deg); }
      75%     { transform: scale(1.1) rotate(-5deg); }
    }

    #smp-fab .smp-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 20px;
      height: 20px;
      background: #f43f5e;
      border-radius: 50%;
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
      font-weight: bold;
      animation: smp-badge-pop 1s ease infinite alternate;
    }

    @keyframes smp-badge-pop {
      from { transform: scale(1); }
      to   { transform: scale(1.2); }
    }

    /* ── Chat Window ── */
    #smp-win {
      position: fixed !important;
      bottom: 115px !important;
      right: 32px !important;
      z-index: 2147483646 !important;
      width: 360px;
      height: 560px;
      display: none;
      flex-direction: column;
      border-radius: 24px;
      overflow: hidden;
      background: rgba(15, 10, 30, 0.85);
      backdrop-filter: blur(32px) saturate(180%);
      -webkit-backdrop-filter: blur(32px) saturate(180%);
      border: 1px solid rgba(168, 85, 247, 0.25);
      box-shadow:
        0 32px 80px rgba(0,0,0,0.6),
        0 0 0 1px rgba(255,255,255,0.05) inset,
        0 0 60px rgba(124,58,237,0.15) inset;
    }

    #smp-win.smp-open {
      display: flex !important;
      animation: smp-window-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes smp-window-in {
      0%   { opacity: 0; transform: scale(0.7) translateY(40px); transform-origin: bottom right; }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    @keyframes smp-window-out {
      0%   { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.7) translateY(40px); transform-origin: bottom right; }
    }

    /* ── Header ── */
    #smp-header {
      padding: 16px 18px;
      background: linear-gradient(135deg, rgba(124,58,237,0.6), rgba(6,182,212,0.2));
      border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    #smp-header .smp-h-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      animation: smp-avatar-spin 6s ease-in-out infinite;
      box-shadow: 0 0 20px rgba(139,92,246,0.5);
      flex-shrink: 0;
    }

    @keyframes smp-avatar-spin {
      0%,100% { transform: rotate(0deg) scale(1); }
      25%     { transform: rotate(-8deg) scale(1.05); }
      75%     { transform: rotate(8deg) scale(1.05); }
    }

    #smp-header .smp-h-info { flex: 1; overflow: hidden; }
    #smp-header .smp-h-name { color: white; font-weight: 700; font-size: 15px; font-family: sans-serif; }
    #smp-header .smp-h-status {
      color: rgba(255,255,255,0.6);
      font-size: 12px;
      font-family: sans-serif;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 2px;
    }

    .smp-dot {
      width: 7px; height: 7px;
      background: #22c55e;
      border-radius: 50%;
      animation: smp-dot-pulse 1.5s ease-in-out infinite;
    }

    @keyframes smp-dot-pulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50%     { opacity: 0.5; transform: scale(0.7); }
    }

    #smp-close-btn {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.8);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    #smp-close-btn:hover {
      background: rgba(244,63,94,0.3);
      border-color: #f43f5e;
      color: white;
      transform: rotate(90deg);
    }

    /* ── Messages ── */
    #smp-msgs {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }

    #smp-msgs::-webkit-scrollbar { width: 4px; }
    #smp-msgs::-webkit-scrollbar-track { background: transparent; }
    #smp-msgs::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.4); border-radius: 4px; }

    .smp-m {
      max-width: 85%;
      padding: 11px 15px;
      border-radius: 18px;
      font-size: 13.5px;
      line-height: 1.55;
      font-family: sans-serif;
      animation: smp-msg-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      word-wrap: break-word;
    }

    @keyframes smp-msg-in {
      0%   { opacity: 0; transform: translateY(15px) scale(0.9); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    .smp-m.bot {
      align-self: flex-start;
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.92);
      border: 1px solid rgba(255,255,255,0.1);
      border-bottom-left-radius: 4px;
    }

    .smp-m.user {
      align-self: flex-end;
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      color: white;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 20px rgba(124,58,237,0.4);
    }

    /* Typing dots */
    .smp-typing {
      align-self: flex-start;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 12px 16px;
      border-radius: 18px;
      border-bottom-left-radius: 4px;
      display: flex;
      gap: 5px;
      align-items: center;
    }

    .smp-typing span {
      width: 7px; height: 7px;
      background: #a855f7;
      border-radius: 50%;
      display: block;
      animation: smp-tdot 1.2s ease-in-out infinite;
    }
    .smp-typing span:nth-child(2) { animation-delay: 0.2s; }
    .smp-typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes smp-tdot {
      0%,60%,100% { transform: translateY(0); opacity: 0.4; }
      30%         { transform: translateY(-6px); opacity: 1; }
    }

    /* ── Suggestions ── */
    #smp-sugg {
      padding: 8px 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      flex-shrink: 0;
      border-top: 1px solid rgba(255,255,255,0.05);
    }

    .smp-sq {
      padding: 5px 11px;
      background: rgba(124,58,237,0.2);
      border: 1px solid rgba(168,85,247,0.35);
      border-radius: 20px;
      color: rgba(255,255,255,0.85);
      font-size: 12px;
      cursor: pointer;
      font-family: sans-serif;
      transition: all 0.2s;
    }

    .smp-sq:hover {
      background: rgba(168,85,247,0.4);
      border-color: #a855f7;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(124,58,237,0.3);
    }

    /* ── Input Row ── */
    #smp-input-row {
      padding: 12px 14px;
      display: flex;
      gap: 8px;
      align-items: center;
      border-top: 1px solid rgba(255,255,255,0.07);
      background: rgba(0,0,0,0.2);
      flex-shrink: 0;
    }

    #smp-input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      color: white;
      font-size: 13.5px;
      font-family: sans-serif;
      outline: none;
      transition: all 0.2s;
      min-width: 0;
    }

    #smp-input:focus {
      background: rgba(255,255,255,0.11);
      border-color: rgba(168,85,247,0.6);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.2);
    }

    #smp-input::placeholder { color: rgba(255,255,255,0.3); }

    #smp-send {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      color: white;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
      box-shadow: 0 4px 16px rgba(124,58,237,0.4);
    }

    #smp-send:hover { transform: scale(1.1) rotate(-10deg); box-shadow: 0 6px 24px rgba(124,58,237,0.6); }
    #smp-send:active { transform: scale(0.95); }
    #smp-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Build HTML ──────────────────────────────────────────────
  // FAB Button
  const fab = document.createElement('button');
  fab.id = 'smp-fab';
  fab.setAttribute('aria-label', 'Open SMP Chat');
  fab.innerHTML = `
    <span class="smp-fab-emoji">🤖</span>
    <div class="smp-badge">1</div>
  `;

  // Chat Window
  const win = document.createElement('div');
  win.id = 'smp-win';
  win.innerHTML = `
    <div id="smp-header">
      <div class="smp-h-avatar">🤖</div>
      <div class="smp-h-info">
        <div class="smp-h-name">SMP Assistant</div>
        <div class="smp-h-status">
          <div class="smp-dot"></div>
          <span>Student Market Palace · Online</span>
        </div>
      </div>
      <button id="smp-close-btn" aria-label="Close chat">✕</button>
    </div>
    <div id="smp-msgs">
      <div class="smp-m bot">
        👋 <strong>Assalam o Alaikum!</strong><br><br>
        Main SMP Assistant hun ❤️<br>
        Buying, selling, account, ya koi bhi cheez poochho — main yahan hun!
      </div>
    </div>
    <div id="smp-sugg">
      <button class="smp-sq">🛒 How to sell?</button>
      <button class="smp-sq">📬 Contact info</button>
      <button class="smp-sq">💰 Kitna free hai?</button>
      <button class="smp-sq">🛡️ Safety tips</button>
    </div>
    <div id="smp-input-row">
      <input id="smp-input" type="text" placeholder="Kuch poochho…" maxlength="400" autocomplete="off" />
      <button id="smp-send" aria-label="Send">➤</button>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(win);

  // ── Knowledge Base ──────────────────────────────────────────
  const KB = [
    {
      keywords: ['sell','selling','bechna','becho','list','listing','post ad','add product','upload','apload'],
      answer: '🛒 <strong>Selling is super easy!</strong><br><br>1️⃣ Click "Post Ad" on homepage<br>2️⃣ Choose a category<br>3️⃣ Add title, price, photos & description<br>4️⃣ Enter your WhatsApp/email<br>5️⃣ Submit — goes live instantly!<br><br>✅ <strong>Completely FREE for all students!</strong>'
    },
    {
      keywords: ['buy','buying','kharidna','purchase','order','khareedna','khareed'],
      answer: '🔍 <strong>Buying on SMP:</strong><br><br>1️⃣ Browse or search listings<br>2️⃣ Click product to see details<br>3️⃣ Hit "Contact Seller" (WhatsApp/Email)<br>4️⃣ Agree on price, meet safely on campus<br><br>💡 No online payment — direct student deals!'
    },
    {
      keywords: ['contact','email','whatsapp','reach','support','help','helpline','admin'],
      answer: '📬 <strong>SMP Support:</strong><br><br>📧 arslanbrall@gmail.com<br>💬 WhatsApp: +92-300-8971489<br>🕐 Mon–Sat, 9am–6pm<br><br>Or use "Contact Seller" on any listing!'
    },
    {
      keywords: ['free','cost','price','fee','charge','kitna','paid','muft','paisa','paise','rupay','rupees'],
      answer: '✅ <strong>100% FREE!</strong><br><br>• No listing fee<br>• No commission<br>• No hidden charges<br>• No subscription<br><br>Just register with your student email and go!'
    },
    {
      keywords: ['safety','safe','scam','fraud','tips','secure','dhoka','trust','fake'],
      answer: '🛡️ <strong>Safety Tips:</strong><br><br>• Meet in a public / on-campus place<br>• Never pay in advance<br>• Verify seller on WhatsApp first<br>• Don\'t share CNIC or bank details<br>• Prefer cash on delivery<br>• Report fakes to admin instantly<br><br>🚨 Suspicious? Email us!'
    },
    {
      keywords: ['account','register','signup','sign up','login','log in','profile'],
      answer: '👤 <strong>Create Account:</strong><br><br>1️⃣ Click "Register" in navigation<br>2️⃣ Enter name & student email<br>3️⃣ Set strong password<br>4️⃣ Verify email (check spam too!)<br>5️⃣ Done — start posting!<br><br>💡 Already registered? Just click Login!'
    },
    {
      keywords: ['delete','remove','edit','update','change','modify','hatana','badalna'],
      answer: '✏️ <strong>Edit / Delete listing:</strong><br><br>1️⃣ Log in to your account<br>2️⃣ Profile icon → "My Listings"<br>3️⃣ Find your item<br>4️⃣ ✏️ Edit OR 🗑️ Delete<br><br>⏰ Listings auto-expire after 30 days.'
    },
    {
      keywords: ['category','categories','books','electronics','clothes','notes','uniform','laptop','mobile','phone'],
      answer: '📦 <strong>Available Categories:</strong><br><br>📚 Books & Notes<br>💻 Electronics & Gadgets<br>👕 Clothes & Uniforms<br>🛋️ Dorm & Room Items<br>🎮 Games & Hobbies<br>🍱 Food & Snacks<br>🧪 Lab Equipment<br>📐 Stationery & Supplies<br><br>More coming soon!'
    },
    {
      keywords: ['password','forgot','reset','bhool','change password'],
      answer: '🔑 <strong>Forgot Password?</strong><br><br>1️⃣ Click Login → "Forgot Password?"<br>2️⃣ Enter registered email<br>3️⃣ Check inbox for reset link<br>4️⃣ Set new password<br><br>📧 No email? Check spam or contact us!'
    },
    {
      keywords: ['search','find','dhundna','dhundo','item','product','kahan'],
      answer: '🔎 <strong>Search on SMP:</strong><br><br>• Use the Search Bar at top of homepage<br>• Filter by category, price, location<br>• Sort by Newest or Lowest Price<br><br>💡 Use simple keywords for best results!'
    },
    {
      keywords: ['photo','image','picture','tasveer','upload photo','add photo'],
      answer: '📷 <strong>Adding Photos:</strong><br><br>• Up to 5 photos per listing<br>• Formats: JPG, PNG, WEBP<br>• Max 5MB per photo<br><br>💡 Natural daylight = best quality photos!'
    },
    {
      keywords: ['smp','student market palace','kya hai','what is','about','platform'],
      answer: '🎓 <strong>About SMP:</strong><br><br>Student Market Palace is a FREE marketplace built for university students!<br><br>✅ Buy & sell books, electronics, clothes & more<br>✅ Connect directly with fellow students<br>✅ Safe, simple, 100% free<br>✅ No middleman!<br><br>🚀 Built by students, for students!'
    },
  ];

  const FALLBACK = '🤔 <strong>Samajh nahi aaya!</strong><br><br>Yeh poochh saktay ho:<br>• 🛒 Selling / Buying<br>• 👤 Account banana<br>• 📬 Contact info<br>• 🛡️ Safety tips<br>• 📦 Categories<br>• 💰 Fees / Cost<br><br>📧 arslanbrall@gmail.com';

  function getReply(txt) {
    const lower = txt.toLowerCase().trim();
    if (!lower) return '😊 Kuch to likho! Main yahan hun!';
    for (const e of KB) {
      if (e.keywords.some(kw => lower.includes(kw))) return e.answer;
    }
    return FALLBACK;
  }

  // ── Toggle Logic ────────────────────────────────────────────
  let isOpen = false;

  function openChat() {
    isOpen = true;
    win.style.display = 'flex';
    win.classList.add('smp-open');
    // Remove notification badge
    const badge = fab.querySelector('.smp-badge');
    if (badge) badge.style.display = 'none';
    // Focus input after animation
    setTimeout(() => {
      const inp = document.getElementById('smp-input');
      if (inp) inp.focus();
    }, 420);
  }

  function closeChat() {
    isOpen = false;
    win.classList.remove('smp-open');
    win.style.animation = 'smp-window-out 0.3s ease forwards';
    setTimeout(() => {
      win.style.display = 'none';
      win.style.animation = '';
    }, 300);
  }

  // ── Events ──────────────────────────────────────────────────
  fab.addEventListener('click', function(e) {
    e.stopPropagation();
    isOpen ? closeChat() : openChat();
  });

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (isOpen && !win.contains(e.target) && e.target !== fab) {
      closeChat();
    }
  });

  // ── Wire up buttons after DOM is ready ──────────────────────
  function wireEvents() {
    const closeBtn = document.getElementById('smp-close-btn');
    const sendBtn  = document.getElementById('smp-send');
    const input    = document.getElementById('smp-input');
    const suggBox  = document.getElementById('smp-sugg');

    if (!closeBtn || !sendBtn || !input) {
      setTimeout(wireEvents, 50);
      return;
    }

    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeChat();
    });

    sendBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      doSend();
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        doSend();
      }
    });

    // Stop window clicks bubbling to document close handler
    win.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    // Suggestion chips
    if (suggBox) {
      suggBox.addEventListener('click', function(e) {
        const btn = e.target.closest('.smp-sq');
        if (!btn) return;
        // Strip emoji prefix for cleaner query
        input.value = btn.textContent.replace(/^[^\w\u0600-\u06FF]+/, '').trim();
        suggBox.style.display = 'none';
        doSend();
      });
    }
  }

  wireEvents();

  // ── Send Message ────────────────────────────────────────────
  function doSend() {
    const input   = document.getElementById('smp-input');
    const sendBtn = document.getElementById('smp-send');
    const suggBox = document.getElementById('smp-sugg');
    if (!input || !sendBtn) return;

    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    if (suggBox) suggBox.style.display = 'none';

    input.value = '';
    sendBtn.disabled = true;

    addMsg(text, 'user');

    // Typing indicator
    const typEl = document.createElement('div');
    typEl.className = 'smp-typing';
    typEl.innerHTML = '<span></span><span></span><span></span>';
    const msgsEl = document.getElementById('smp-msgs');
    msgsEl.appendChild(typEl);
    msgsEl.scrollTop = msgsEl.scrollHeight;

    setTimeout(function() {
      if (typEl.parentNode) typEl.remove();
      addMsg(getReply(text), 'bot');
      sendBtn.disabled = false;
      if (input) input.focus();
    }, 550 + Math.random() * 300);
  }

  function addMsg(html, cls) {
    const msgsEl = document.getElementById('smp-msgs');
    if (!msgsEl) return;
    const el = document.createElement('div');
    el.className = 'smp-m ' + cls;
    el.innerHTML = html;
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

})();
