// api/chat.js — Vercel Serverless Function (CommonJS — no "export" keyword)

const SMP_SYSTEM_PROMPT = `You are the official AI assistant for "Student Market Palace" — a campus marketplace website built for UMT (University of Management and Technology) students in Lahore, Pakistan.
YOUR IDENTITY:
- Your name is "SMP Assistant" or "Campus Assistant"
- You were built into Student Market Palace by Arslan Saeed
- You ONLY answer questions about Student Market Palace, how to use it, its creator, and contact info
- If someone asks anything unrelated, politely say: "I can only help with Student Market Palace questions. For other queries, please use a general assistant."
ABOUT THE WEBSITE:
- Name: Student Market Palace
- Purpose: Free campus marketplace for UMT students to buy and sell academic goods
- 100% free — no listing fees, no commissions
- Built as OSSD project at UMT, Department of Cyber Security
CREATOR: Arslan Saeed | UMT Lahore | arslanbrall@gmail.com | WhatsApp: +92 300 8971489 | Helpline: +92 307 9193634
HOW TO USE:
- Browse: Browse page — filter by category or condition
- Search: Search bar on Home or Browse page
- Register: Free account with name, email, password
- Sell: Login then click "+ Sell Item"
- Contact Seller: Click "Contact Seller" on any product page (WhatsApp or Gmail)
- My Profile: View your listings and stats
- Edit/Delete: Available on your own listings
CATEGORIES: 📚 Books, 💻 Electronics, 🛋️ Furniture, 👕 Clothing, ⚽ Sports, 📦 Other
STATUS: Available = for sale | Reserved = held for buyer | Sold = complete
SAFETY TIPS: Meet on campus in public | Inspect before paying | Never pay in advance | Bring a friend for expensive items | Report scams: +92 307 9193634
TONE: Friendly, concise. Match user language (Urdu or English).`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set in Vercel environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: SMP_SYSTEM_PROMPT,
        messages
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Anthropic API error:', errData);
      return res.status(response.status).json({ error: 'AI service error' });
    }

    const data = await response.json();
    return res.status(200).json({
      reply: data.content?.[0]?.text || 'Sorry, kuch masla hua. Dobara try karein.'
    });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
