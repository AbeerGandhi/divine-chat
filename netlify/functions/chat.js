export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { messages } = JSON.parse(event.body);

    if (!process.env.OPENROUTER_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OPENROUTER_KEY missing" })
      };
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "DharmaGuide"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages
        })
      }
    );

    const raw = await response.text();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: raw
      };
    }

    const data = JSON.parse(raw);

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices[0].message.content
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Function crashed",
        details: err.message
      })
    };
  }
}
