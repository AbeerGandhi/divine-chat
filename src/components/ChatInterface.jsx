import { useContext, useState, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import ChatMessage from "./ChatMessage"; // ✅ MUST BE THIS
import { askOpenRouter } from "../services/openrouter";
import { speak } from "../utils/speak";
import VoiceInput from "./VoiceInput";

export default function ChatInterface() {
  const { epic, language } = useContext(ThemeContext);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        epic === "ramayan"
          ? "Ask me anything about life, duty, and devotion from the Ramayan."
          : "Ask me anything about dharma, karma, and wisdom from the Mahabharata."
    }
  ]);

  const [input, setInput] = useState("");
  const lastInputType = useRef("text");

  const send = async (text, type = "text") => {
    if (lastInputType.current === "voice" && text.length < 3) {
  return;
}

    if (!text || !text.trim() || text.length < 2) return;


    lastInputType.current = type;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");

    const reply = await askOpenRouter(text, epic, language);

    setMessages((m) => [...m, { role: "assistant", text: reply }]);
    // 🔑 Let React paint first, then speak
    if (type === "voice") {
      requestAnimationFrame(() => {
        speak(reply, language);
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden">

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto pt-20 sm:pt-10 space-y-4">
        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            role={m.role}   // ✅ REQUIRED
            text={m.text}   // ✅ REQUIRED
          />
        ))}
      </div>

      {/* INPUT BAR */}
      <div className="sticky bottom-0 bg-black/30 backdrop-blur py-3">
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur rounded-2xl px-4 py-3 shadow-md">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent outline-none text-sm"
            onKeyDown={(e) => e.key === "Enter" && send(input)}
          />

          <VoiceInput
            onResult={(text) => send(text, "voice")}
            language={language}
          />

          <button
            onClick={() => send(input)}
            className="text-gray-500 hover:text-black"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
