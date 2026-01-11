export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = JSON.parse(event.body);
    const { messages } = body;

    // 🛡️ SECURITY & VALIDATION
    // Debug: Check loaded key (masking most of it)
    console.log("🔑 Active Key Start:", process.env.OPENROUTER_KEY ? process.env.OPENROUTER_KEY.substring(0, 15) + "..." : "UNDEFINED");

    if (!messages || !Array.isArray(messages)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid messages format" }) };
    }

    // Basic Rate Limiting / Spam Protection (Content Length Check)
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.content?.length > 1000) {
      return { statusCode: 400, body: JSON.stringify({ error: "Message too long" }) };
    }

    // 🤖 MODEL STACK (Prioritized)
    const openRouterModels = [
      "nousresearch/hermes-3-llama-3.1-405b:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "mistralai/mistral-7b-instruct:free",
      "qwen/qwen3-coder:free",
    ];

    let lastError = null;

    // 1️⃣ PHASE 1: Try OpenRouter (The Preferred Path)
    for (const model of openRouterModels) {
      try {
        console.log(`Attempting OpenRouter model: ${model}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s Timeout

        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_KEY?.trim()}`,
              "Content-Type": "application/json",
              "HTTP-Referer": process.env.URL || "http://localhost:3000",
              "X-Title": "DharmaGuide"
            },
            body: JSON.stringify({ model, max_tokens: 400, messages }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          const raw = await response.text();

          if (!response.ok) {
            // If Rate Limit (429), we want to break loop and go to Google? 
            // Or continue to other OR models? Usually OR rate limits the USER, so other models fail too.
            // But we will 'continue' to be safe, eventually loop finishes.
            throw new Error(`OpenRouter Error: ${raw}`);
          }

          const data = JSON.parse(raw);
          console.log(`Backend success with OR model: ${model}`);
          return {
            statusCode: 200,
            body: JSON.stringify({
              reply: data.choices?.[0]?.message?.content || "...",
              used_model: model
            })
          };

        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError.name === 'AbortError') {
            console.warn(`TIMEOUT: ${model} > 15s. Next...`);
            continue;
          }
          throw fetchError;
        }

      } catch (err) {
        console.warn(`OR Model failed: ${model} - ${err.message}`);
        lastError = err;
      }
    }

    // 2️⃣ PHASE 2: SambaNova Cloud (Llama 3.3 70B - High Limits)
    // "SambaNova uses a different type of chip that makes running large models like Llama 70B very cheap."
    if (!lastError || lastError) { // Always try if previous failed
      console.log("⚠️ Switching to Phase 2: SambaNova Cloud...");
      try {
        const sambaKey = process.env.SAMBANOVA_API_KEY;
        if (!sambaKey) {
          console.log("⏭️ SambaNova Key missing. Skipping.");
        } else {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 10000); // 10s Timeout for speed

          const sResp = await fetch("https://api.sambanova.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${sambaKey.trim()}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "Meta-Llama-3.3-70B-Instruct",
              messages: [
                { role: "system", content: "You are a helpful assistant. Reply in Hinglish." }, // Simplified system prompt for fallback
                ...messages
              ],
              max_tokens: 400
            }),
            signal: controller.signal
          });

          if (sResp.ok) {
            const sData = await sResp.json();
            console.log("✅ SambaNova Success!");
            return {
              statusCode: 200,
              body: JSON.stringify({
                reply: sData.choices?.[0]?.message?.content || "...",
                used_model: "sambanova/llama-3.3-70b"
              })
            };
          } else {
            const errText = await sResp.text();
            console.warn(`SambaNova Failed: ${errText}`);
          }
        }
      } catch (sErr) {
        console.warn("SambaNova Error:", sErr.message);
      }
    }

    // 3️⃣ PHASE 3: Groq Cloud (Llama 3.3 70B - Fast & Generous)
    // "Groq is famous for being the fastest AI provider."
    console.log("⚠️ Switching to Phase 3: Groq Cloud...");
    try {
      const groqKey = process.env.GROQ_API_KEY;
      if (!groqKey) {
        console.log("⏭️ Groq Key missing. Skipping.");
      } else {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 10000); // 10s Timeout

        const gResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqKey.trim()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: messages, // Groq supports full messages array usually
            max_tokens: 400
          }),
          signal: controller.signal
        });

        if (gResp.ok) {
          const gData = await gResp.json();
          console.log("✅ Groq Success!");
          return {
            statusCode: 200,
            body: JSON.stringify({
              reply: gData.choices?.[0]?.message?.content || "...",
              used_model: "groq/llama-3.3-70b"
            })
          };
        } else {
          const errText = await gResp.text();
          console.warn(`Groq Failed: ${errText}`);
        }
      }
    } catch (gErr) {
      console.warn("Groq Error:", gErr.message);
    }

    // 4️⃣ PHASE 4: Google Gemini Direct Fallback (The Final Safety Net)
    console.log("⚠️ Switching to Phase 4: Google Gemini Direct...");
    try {
      const googleKey = process.env.GEMINI_API_KEY;
      if (!googleKey) throw new Error("No Google Key found for fallback");

      // Convert messages to Gemini format (simplistic: combined text or last message)
      const lastUserMsg = messages.findLast(m => m.role === 'user')?.content || "";
      const systemMsg = messages.find(m => m.role === 'system')?.content || "";

      const fullPrompt = `${systemMsg}\n\nUSER QUESTION: ${lastUserMsg}`;

      const gResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      });

      const gRaw = await gResp.text();
      if (!gResp.ok) throw new Error(`Google Error: ${gRaw}`);

      const gData = JSON.parse(gRaw);
      const reply = gData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        console.log("✅ Google Gemini Direct Success!");
        return {
          statusCode: 200,
          body: JSON.stringify({
            reply: reply,
            used_model: "google/gemini-1.5-flash-direct"
          })
        };
      }

    } catch (gErr) {
      console.error("Google Fallback Failed:", gErr);
      lastError = gErr;
    }

    // 3️⃣ PHASE 3: Hugging Face (Final Straw - Optional/Future)
    // Skipping for now to keep response fast (Google is reliable enough)

    // Final Failure
    console.error("All providers failed.");
    return {
      statusCode: 503,
      body: JSON.stringify({ error: "Divine connection completely unreachable. Try again later." })
    };

  } catch (err) {
    console.error("Function Critical Error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
  }
}
