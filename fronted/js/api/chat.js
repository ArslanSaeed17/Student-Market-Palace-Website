export default async function handler(req, res) {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are SMP Assistant",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.content?.[0]?.text || "No response"
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
