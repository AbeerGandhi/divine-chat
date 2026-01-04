export async function askOpenRouter(userMessage, epic, language) {
  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: `You are a calm spiritual guide based on ${epic}. Reply in ${language}.`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    })
  });

  if (!res.ok) {
    throw new Error("AI request failed");
  }

  const data = await res.json();
  return data.reply;
}
