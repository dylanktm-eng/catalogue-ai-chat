export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // or "gpt-3.5-turbo" if you want to test
        messages: messages,
      }),
    });

    const data = await response.json();

    // Handle possible API error from OpenAI
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(500).json({ error: data.error?.message || "OpenAI API Error" });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || "No response from model";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
