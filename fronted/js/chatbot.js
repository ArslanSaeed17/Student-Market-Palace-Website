// ============================================================
//  Student Market Palace — AI Chatbot Widget
//  chatbot.js  →  100% client-side, NO backend, NO API key
// ============================================================
(function () {

  // ── Inject CSS ───────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #smp-chat-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      width: 64px;
      height: 64px;
      border: none;
      border-radius: 50%;
      background: rgba(124,58,237,.18);
      backdrop-filter: blur(18px);
      border: 1px solid rgba(255,255,255,.15);
      box-shadow: 0 10px 40px rgba(124,58,237,.35), inset 0 0 15px rgba(255,255,255,.08);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      animation: floatAI 4s ease-in-out infinite, glowAI 3s infinite;
    }

    @keyframes floatAI {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-8px); }
    }

    @keyframes glowAI {
      50% { box-shadow: 0 18px 60px rgba(168,85,247,.55); }
    }

    #smp-chat-btn:hover { transform: scale(1.08); }

    #smp-chat-window {
      position: fixed;
      right: 28px;
      bottom: 105px;
      width: 370px;
      height: 540px;
      display: none;
      flex-direction: column;
      background: linear-gradient(135deg, rgba(255,255,255,.10), rgba(255,255,255,.04));
      backdrop-filter: blur(28px);
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 25px 70px rgba(0,0,0,.5);
    }

    #smp-chat-window.open {
      display: flex;
      animation: openGlass .45s cubic-bezier(.2,.8,.2,1);
    }

    @keyframes openGlass {
      from { opacity: 0; transform: translateY(40px) scale(.94); }
      to   { opacity: 1; transform: none; }
    }

    #smp-chat-header {
      padding: 18px;
      background: linear-gradient(135deg, rgba(124,58,237,.40), rgba(0,229,255,.10));
      backdrop-filter: blur(30px);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .smp-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #00e5ff);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulseAvatar 2s infinite;
    }

    @keyframes pulseAvatar {
      50% { transform: scale(1.08); }
    }

    .smp-title strong { color: white; font-size: 15px; display: block; }
    .smp-title span   { color: rgba(255,255,255,.65); font-size: 12px; }

    #smp-chat-close {
      margin-left: auto;
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      opacity: .7;
    }
    #smp-chat-close:hover { opacity: 1; }

    #smp-chat-messages {
      flex: 1;
      padding: 18px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .smp-msg {
      padding: 12px 16px;
      max-width: 82%;
      border-radius: 18px;
      font-size: 14px;
      animation: messageAppear .25s;
    }

    @keyframes messageAppear {
      from { opacity: 0; transform: translateY(10px); }
    }

    .smp-msg.bot {
      background: rgba(255,255,255,.08);
      color: white;
      backdrop-filter: blur(18px);
    }

    .smp-msg.user {
      align-self: flex-end;
      background: linear-gradient(135deg, #7c3aed, #9333ea);
      color: white;
    }

    .typing { display: flex; gap: 4px; padding: 12px; }

    .typing span {
      width: 8px; height: 8px;
      background: #a855f7;
      border-radius: 50%;
      animation: typingDot 1.2s infinite;
    }
    .typing span:nth-child(2) { animation-delay: .2s; }
    .typing span:nth-child(3) { animation-delay: .4s; }

    @keyframes typingDot {
      50% { opacity: .25; transform: translateY(-4px); }
    }

    #smp-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 0 14px 10px;
    }

    .smp-suggestion {
      padding: 6px 12px;
      border: 1px solid rgba(139,92,246,.5);
      border-radius: 20px;
      background: rgba(139,92,246,.15);
      color: white;
      font-size: 12px;
      cursor: pointer;
      transition: .2s;
    }
    .smp-suggestion:hover { background: rgba(139,92,246,.35); }

    #smp-chat-input-row {
      padding: 14px;
      display: flex;
      gap: 10px;
      background: rgba(255,255,255,.04);
    }

    #smp-chat-input {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 14px;
      background: rgba(255,255,255,.08);
      backdrop-filter: blur(18px);
      color: white;
      font-size: 14px;
    }

    #smp-chat-input::placeholder { color: rgba(255,255,255,.4); }

    #smp-chat-input:focus {
      outline: none;
      box-shadow: 0 0 0 2px #8b5cf6;
    }

    #smp-chat-send {
      padding: 12px 18px;
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, #8b5cf6, #00e5ff);
      color: white;
      cursor: pointer;
      transition: .25s;
      font-size: 14px;
    }

    #smp-chat-send:hover { transform: scale(1.06); }
    #smp-chat-send:disabled { opacity: .5; cursor: not-allowed; transform: none; }
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
        👋 Assalam o Alaikum! Main SMP Assistant hun ❤️<br><br>
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
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(win);

  // ── Knowledge Base ───────────────────────────────────────────
  const KB = [
    {
      keywords: ['sell', 'selling', 'bechna', 'becho', 'list', 'listing', 'post ad', 'add product', 'apload', 'upload'],
      answer: '🛒 Selling on SMP is very easy!\n\n1. Click "Post Ad" on the homepage\n2. Choose a category for your item\n3. Add title, price, photos & description\n4. Enter your WhatsApp or email for buyers\n5. Submit — your listing goes live instantly!\n\n✅ Completely FREE for all students.'
    },
    {
      keywords: ['buy', 'buying', 'kharidna', 'purchase', 'order', 'khareedna', 'khareed'],
      answer: '🔍 Buying on SMP is simple:\n\n1. Browse or search listings on the homepage\n2. Click any product to see full details\n3. Hit "Contact Seller" to reach them via WhatsApp or Gmail\n4. Agree on a price and meet safely on campus\n\n💡 No online payment needed — all deals are direct between students!'
    },
    {
      keywords: ['contact', 'email', 'whatsapp', 'reach', 'support', 'help', 'helpline', 'admin', 'sampark'],
      answer: '📬 Contact SMP Support:\n\n📧 Email: arslanbrall@gmail.com\n💬 WhatsApp: +92-300-8971489\n🕐 Available: Mon–Sat, 9am–6pm\n\nYou can also use the "Contact Seller" button on any product listing to reach the seller directly.'
    },
    {
      keywords: ['free', 'cost', 'price', 'fee', 'charge', 'kitna', 'paid', 'muft', 'paisa', 'paise', 'rupay', 'rupees'],
      answer: '✅ Student Market Palace is 100% FREE!\n\n• No listing fee\n• No commission on sales\n• No hidden charges\n• No subscription needed\n\nJust register with your student email and start buying or selling!'
    },
    {
      keywords: ['safety', 'safe', 'scam', 'fraud', 'tips', 'secure', 'dhoka', 'trust', 'fake'],
      answer: '🛡️ Student Safety Tips:\n\n• Always meet in a public place (on campus is best)\n• Never pay in advance without seeing the item\n• Verify the seller on WhatsApp before meeting\n• Do NOT share your bank account or CNIC details\n• Prefer cash payment on delivery\n• Report fake listings to admin immediately\n\n🚨 Suspicious? Email: arslanbrall@gmail.com'
    },
    {
      keywords: ['account', 'register', 'signup', 'sign up', 'login', 'log in', 'profile', 'register karna', 'banana'],
      answer: '👤 Creating an account is quick:\n\n1. Click "Register" in the top navigation\n2. Enter your name and student email\n3. Set a strong password\n4. Verify your email (check inbox/spam)\n5. Done! You can now post listings.\n\n💡 Already registered? Click "Login" and enter your credentials.'
    },
    {
      keywords: ['delete', 'remove', 'edit', 'update', 'change', 'modify', 'hatana', 'badalna'],
      answer: '✏️ To edit or delete a listing:\n\n1. Log into your account\n2. Click your profile icon → "My Listings"\n3. Find the item you want to change\n4. Click ✏️ Edit to update details\n   OR 🗑️ Delete to remove it\n\n⏰ Note: Listings automatically expire after 30 days.'
    },
    {
      keywords: ['category', 'categories', 'books', 'electronics', 'clothes', 'notes', 'uniform', 'laptop', 'mobile', 'phone'],
      answer: '📦 Available categories on SMP:\n\n📚 Books & Notes\n💻 Electronics & Gadgets\n👕 Clothes & Uniforms\n🛋️ Dorm & Room Items\n🎮 Games & Hobbies\n🍱 Food & Snacks\n🧪 Lab Equipment\n📐 Stationery & Supplies\n\nMore categories being added soon!'
    },
    {
      keywords: ['password', 'forgot', 'reset', 'bhool', 'bhool gaya', 'change password'],
      answer: '🔑 Forgot your password?\n\n1. Click "Login" on the homepage\n2. Click "Forgot Password?" below the form\n3. Enter your registered email\n4. Check your inbox for a reset link\n5. Click the link and set a new password\n\n📧 Didn\'t get the email? Check your spam folder or contact support.'
    },
    {
      keywords: ['search', 'find', 'dhundna', 'dhundo', 'item', 'product', 'kahan'],
      answer: '🔎 How to search on SMP:\n\n• Use the Search Bar at the top of the homepage\n• Type the item name (e.g. "calculus book", "HP laptop")\n• Filter results by category, price range, or location\n• Sort by Newest or Lowest Price\n\n💡 Tip: Use simple keywords for best results!'
    },
    {
      keywords: ['photo', 'image', 'picture', 'tasveer', 'upload photo', 'add photo'],
      answer: '📷 Adding photos to your listing:\n\n• You can upload up to 5 photos per listing\n• Accepted formats: JPG, PNG, WEBP\n• Max size: 5MB per photo\n• Good photos = faster sales!\n\n💡 Tip: Take photos in natural daylight for best quality.'
    },
    {
      keywords: ['smp', 'student market palace', 'kya hai', 'what is', 'about', 'ke baare', 'platform'],
      answer: '🎓 About Student Market Palace (SMP):\n\nSMP is a free online marketplace built exclusively for university students.\n\n✅ Buy & sell used books, electronics, clothes and more\n✅ Connect directly with fellow students\n✅ Safe, simple, and completely free\n✅ No middleman — deal directly!\n\nBuilt by students, for students. 🚀'
    },
  ];

  const FALLBACK = '🤔 Mujhe samajh nahi aaya!\n\nAap yeh cheezain poochh saktay ho:\n• Selling / Buying\n• Account banana\n• Contact info\n• Safety tips\n• Categories\n• Fees / Cost\n\nYa seedha email karein: arslanbrall@gmail.com';

  // ── Matcher ──────────────────────────────────────────────────
  function getReply(userText) {
    const lower = userText.toLowerCase().trim();
    if (!lower) return '😊 Kuch to likho! Main help karne ke liye yahan hun.';
    for (const entry of KB) {
      if (entry.keywords.some(kw => lower.includes(kw))) return entry.answer;
    }
    return FALLBACK;
  }

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

  document.getElementById('smp-suggestions').addEventListener('click', e => {
    if (e.target.classList.contains('smp-suggestion')) {
      const input = document.getElementById('smp-chat-input');
      input.value = e.target.textContent;
      document.getElementById('smp-suggestions').style.display = 'none';
      sendMessage();
    }
  });

  // ── Send Message ─────────────────────────────────────────────
  async function sendMessage() {
    const input   = document.getElementById('smp-chat-input');
    const sendBtn = document.getElementById('smp-chat-send');
    const text    = input.value.trim();
    if (!text || sendBtn.disabled) return;

    document.getElementById('smp-suggestions').style.display = 'none';
    input.value      = '';
    sendBtn.disabled = true;

    appendMessage(text, 'user');

    // Typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'smp-msg bot typing';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    const msgs = document.getElementById('smp-chat-messages');
    msgs.appendChild(typingEl);
    msgs.scrollTop = msgs.scrollHeight;

    await new Promise(r => setTimeout(r, 500));
    typingEl.remove();

    appendMessage(getReply(text), 'bot');
    sendBtn.disabled = false;
    input.focus();
  }

  // ── Helper ───────────────────────────────────────────────────
  function appendMessage(text, cls) {
    const msgs = document.getElementById('smp-chat-messages');
    const el   = document.createElement('div');
    el.className = 'smp-msg ' + cls;
    el.innerHTML = text.replace(/\n/g, '<br>');
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

})();
