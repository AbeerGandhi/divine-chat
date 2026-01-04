import axios from "axios";

export async function explainScripture(
  scriptureText,
  userQuestion,
  language
) {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content: `
You are a spiritual guide.
ONLY explain the given scripture.
DO NOT add new verses or ideas.
Language: ${language}.
Tone: calm, devotional, motivating.
`
        },
        {
          role: "user",
          content: `
Scripture:
${scriptureText}

User Question:
${userQuestion}
`
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_KEY}`
      }
    }
  );

  return res.data.choices[0].message.content;
}
