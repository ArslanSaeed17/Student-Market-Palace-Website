// ============================================================
//  Student Market Palace — AI Assistant
//  Uses Anthropic API (injected by claude.ai artifact system)
//  Knowledge: ONLY about this website, its creator, and contact
// ============================================================

const SMP_SYSTEM_PROMPT = `You are the official AI assistant for "Student Market Palace" — a campus marketplace website built for UMT (University of Management and Technology) students in Lahore, Pakistan.

YOUR IDENTITY:
- Your name is "SMP Assistant" or "Campus Assistant"
- You were built into Student Market Palace by Arslan Saeed
- You ONLY answer questions about Student Market Palace, how to use it, its creator, and contact info
- If someone asks anything unrelated (general knowledge, coding, math, etc.), politely say: "I can only help with Student Market Palace questions. For other queries, please use a general assistant."

ABOUT THE WEBSITE:
- Name: Student Market Palace
- URL: https://student-market-place-documentation.vercel.app
- Purpose: A free campus marketplace where UMT students can buy and sell academic goods
- It is 100% free — no listing fees, no commissions
- Built as an OSSD (Open Source Software Development) project at UMT, Department of Cyber Security

CREATOR:
- Name: Arslan Saeed
- University: University of Management and Technology (UMT), Lahore
- Department: Cyber Security
- Email: arslanbrall@gmail.com
- WhatsApp: +92 300 8971489
- Helpline: +92 307 9193634

HOW TO USE THE WEBSITE:
- Browse: Go to the Browse page to see all available listings. Filter by category or condition.
- Search: Use the search bar on Home or Browse page to find specific items.
- Register: Create a free account with your name, email, and password.
- Login: Login with your email and password.
- Sell: After logging in, click "+ Sell Item" to post a listing. Fill in title, category, condition, price, description, and optional image URL.
- Contact Seller: On any product page, click "Contact Seller" to reach them via WhatsApp.
- My Profile: View your listings, see active/reserved/sold counts.
- Edit/Delete: On your own listings, you can edit details or delete them.

CATEGORIES AVAILABLE:
📚 Books, 💻 Electronics, 🛋️ Furniture, 👕 Clothing, ⚽ Sports, 📦 Other

SAFETY TIPS (always share when relevant):
- Always meet in a public place on or near campus
- Inspect the item before paying any money
- Never pay in advance without seeing the item
- Bring a friend when buying expensive items
- Report scams to helpline: +92 307 9193634

PRODUCT STATUS MEANINGS:
- Available: Item is still for sale
- Reserved: Seller has reserved it for a buyer
- Sold: Item has been sold

TONE: Friendly, helpful, concise. Respond in the same language the user writes in (Urdu or English). Keep answers short and to the point.`;

// ── Build the chat UI ─────────────────────────────────────────
function initChatbot() {
  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #smp-chat-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(124,58,237,0.5);
      font-size: 1.5rem; display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #smp-chat-btn:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(124,58,237,0.7); }

    #smp-chat-window {
      position: fixed; bottom: 96px; right: 28px; z-index: 9998;
      width: 340px; max-height: 480px;
      background: var(--surface, #1e1b2e); border: 1px solid var(--border, #2d2a45);
      border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.5);
      display: none; flex-direction: column; overflow: hidden;
      font-family: inherit;
    }
    #smp-chat-window.open { display: flex; }

    #smp-chat-header {
      padding: 14px 16px; background: linear-gradient(135deg, #7c3aed, #a855f7);
      display: flex; align-items: center; justify-content: space-between;
    }
    #smp-chat-header span { font-weight: 700; color: #fff; font-size: 0.92rem; }
    #smp-chat-close { background: none; border: none; color: #fff; font-size: 1.1rem; cursor: pointer; padding: 0; }

    #smp-chat-messages {
      flex: 1; overflow-y: auto; padding: 14px; display: flex;
      flex-direction: column; gap: 10px; max-height: 340px;
    }
    .smp-msg { max-width: 85%; padding: 9px 13px; border-radius: 12px; font-size: 0.84rem; line-height: 1.5; }
    .smp-msg.bot { background: var(--bg3, #2a2740); color: var(--text, #e2e0f0); align-self: flex-start; border-bottom-left-radius: 4px; }
    .smp-msg.user { background: #7c3aed; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
    .smp-msg.typing { opacity: 0.6; font-style: italic; }

    #smp-chat-input-row {
      padding: 10px 12px; border-top: 1px solid var(--border, #2d2a45);
      display: flex; gap: 8px;
    }
    #smp-chat-input {
      flex: 1; padding: 9px 12px; border-radius: 8px;
      background: var(--bg3, #2a2740); border: 1px solid var(--border, #2d2a45);
      color: var(--text, #e2e0f0); font-size: 0.84rem; outline: none;
    }
    #smp-chat-input:focus { border-color: #7c3aed; }
    #smp-chat-send {
      padding: 9px 14px; background: #7c3aed; color: #fff;
      border: none; border-radius: 8px; cursor: pointer; font-size: 0.84rem; font-weight: 600;
      transition: background 0.15s;
    }
    #smp-chat-send:hover { background: #6d28d9; }
    #smp-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
  `;
  document.head.appendChild(style);

  // Build HTML
  const btn = document.createElement('button');
  btn.id = 'smp-chat-btn';
  btn.title = 'Ask SMP Assistant';
  btn.innerHTML = '🤖';

  const win = document.createElement('div');
  win.id = 'smp-chat-window';
  win.innerHTML = `
    <div id="smp-chat-header">
      <span>🤖 SMP Assistant</span>
      <button id="smp-chat-close" title="Close">✕</button>
    </div>
    <div id="smp-chat-messages">
      <div class="smp-msg bot">👋 Salam! Main Student Market Palace ka assistant hun. Website ke baare mein kuch bhi poochh saktay ho — buying, selling, account, ya contact info!</div>
    </div>
    <div id="smp-chat-input-row">
      <input id="smp-chat-input" type="text" placeholder="Kuch poochho…" autocomplete="off"/>
      <button id="smp-chat-send">Send</button>
    </div>`;

  document.body.appendChild(btn);
  document.body.appendChild(win);

  // Events
  btn.addEventListener('click', () => win.classList.toggle('open'));
  document.getElementById('smp-chat-close').addEventListener('click', () => win.classList.remove('open'));
  document.getElementById('smp-chat-send').addEventListener('click', sendMessage);
  document.getElementById('smp-chat-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });
}

// ── Conversation history ──────────────────────────────────────
const chatHistory = [];

async function sendMessage() {
  const input   = document.getElementById('smp-chat-input');
  const sendBtn = document.getElementById('smp-chat-send');
  const text    = input.value.trim();
  if (!text) return;

  input.value = '';
  sendBtn.disabled = true;

  appendMessage(text, 'user');
  chatHistory.push({ role: 'user', content: text });

  const typingEl = appendMessage('Typing…', 'bot typing');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SMP_SYSTEM_PROMPT,
        messages: chatHistory
      })
    });

    const data = await response.json();
    const reply = data.content && data.content[0] && data.content[0].text
      ? data.content[0].text
      : 'Sorry, kuch masla hua. Dobara try karein.';

    typingEl.remove();
    appendMessage(reply, 'bot');
    chatHistory.push({ role: 'assistant', content: reply });

  } catch(err) {
    typingEl.remove();
    appendMessage('Connection error. Please try again.', 'bot');
  }

  sendBtn.disabled = false;
  input.focus();
}

function appendMessage(text, cls) {
  const msgs = document.getElementById('smp-chat-messages');
  const el   = document.createElement('div');
  el.className = 'smp-msg ' + cls;
  el.textContent = text;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
  return el;
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}
