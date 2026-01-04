import axios from "axios";

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

  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistralai/mistral-7b-instruct",
      max_tokens: 160,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  let text = res.data.choices[0].message.content || "";

  // 🔒 SAFETY CLEAN (GUARANTEED)
  text = text
    .replace(/<[^>]*>/g, "")
    .replace(/\[.*?\]/g, "")
    .trim();

  return text;
}
