export async function askOpenRouter(question, epic, language) {

  const systemPrompt = `
You are a calm, compassionate spiritual guide, speaking with the wisdom of the ${epic === "ramayan" ? "Ramayan" : "Mahabharata"}.

CORE INSTRUCTION:
- Connect the user's situation to a specific teaching, event, or character from the ${epic === "ramayan" ? "Ramayan" : "Mahabharata"}.
- Example: "Just as Shri Ram maintained patience in the forest..." or "Remember how Arjuna found clarity..."
- Do NOT preach. Offer perspective.

LANGUAGE RULES (CRITICAL):
${language === "en"
      ? "Reply strictly in simple, clear English."
      : "Reply in HINGLISH (Hindi written in Roman/English characters). Example: 'Aap kaise hain?' NOT 'आप कैसे हैं'. DO NOT use Devanagari script. Keep it warm and conversational."
    }

FORMAT:
- Keep answers concise (3-4 sentences).
- Write in a gentle, speakable human voice.
- End with ONE reflective question to help the user dive deeper.

EMOTIONAL GUIDANCE:
- Validate their feelings first.
- Be soothing and grounding.
- Never judge or dismiss their pain.
`;

  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt.trim() },
        { role: "user", content: question.trim() }
      ]
    })
  });

  if (!res.ok) {
    throw new Error("AI request failed");
  }

  const data = await res.json();
  console.log("DEBUG: Raw specific data from backend:", data); // Debugging "unknown" model

  let text = data.reply || "";

  // 🔒 SAFETY CLEAN (GUARANTEED)
  text = text
    .replace(/<[^>]*>/g, "")
    .replace(/\[.*?\]/g, "")
    .trim();

  return { text, model: data.used_model || "unknown" };
}
