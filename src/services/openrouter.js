export async function askOpenRouter(question, epic, language) {
  const languageRule =
    language === "en"
      ? "Reply strictly in English."
      : `
Reply in natural Hindi or Hinglish (Hindi written in English letters).
Do NOT use Sanskrit-heavy or robotic language.
`;

  const systemPrompt = `
You are a calm, compassionate spiritual guide.

STRICT RULES:
- NEVER include tokens like <s>, </s>, [OUTST], [/OUTST], or any markers.
- NEVER include brackets or system text.
- Write like a human guide, not like an AI model.
- Keep response to 2–4 short sentences only.
- Use simple, comforting words.
- End with ONE gentle follow-up question.

CONTEXT:
Base guidance on ${
    epic === "ramayan"
      ? "Ramayan and the ideals of Shri Ram"
      : "Mahabharata, Shri Krishna, and the Bhagavad Gita"
  }.

LANGUAGE:
${languageRule}
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

  let text = data.reply || "";

  // 🔒 SAFETY CLEAN (GUARANTEED)
  text = text
    .replace(/<[^>]*>/g, "")
    .replace(/\[.*?\]/g, "")
    .trim();

  return text;
}
