import { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import ChatMessage from "./ChatMessage";
import { askOpenRouter } from "../services/openrouter";
import VoiceInput from "./VoiceInput";
import TypingIndicator from "./TypingIndicator";
import { Send, ArrowUp } from "lucide-react";
import toast from "react-hot-toast";
import { useChatSessions } from "../hooks/useChatSessions";

export default function ChatInterface({ sessionId, onSessionStart }) {
  const { epic, language } = useContext(ThemeContext);
  const { updateSession } = useChatSessions();
  const bottomRef = useRef(null);

  // Load from local storage based on sessionId or epic default (for new chats)
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const lastInputType = useRef("text");

  // Load messages when sessionId changes
  useEffect(() => {
    if (!sessionId) {
      // New Chat State
      setMessages([
        {
          role: "assistant",
          text:
            epic === "ramayan"
              ? "Jai Shri Ram. I am here to guide you with wisdom from the Ramayan. What takes away your peace?"
              : "Jai Shri Krishna. I am here to help you navigate conflict with wisdom from the Mahabharata. What is your dilemma?",
        },
      ]);
    } else {
      // Existing Session
      const saved = localStorage.getItem(`divine_chat_${sessionId}`);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    }
  }, [sessionId, epic]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = async (text, type = "text") => {
    if (lastInputType.current === "voice" && text.length < 3) return;
    if (!text || !text.trim()) return;

    lastInputType.current = type;

    // 1. Determine local Session ID (create if new)
    let activeSessionId = sessionId;
    if (!activeSessionId) {
      // We need to signal parent to create a session usually, 
      // but here we can't create it ourselves easily without the hook if we didn't pass it.
      // However, we passed onSessionStart.
      // Actually, we should probably wait for parent? 
      // Better UX: Parent passed `createSession`.
      // Let's assume parent passed a callback `onSessionStart` that returns the ID?
      if (onSessionStart) {
        activeSessionId = onSessionStart(); // This handles creation in parent
      }
    }

    const userMsg = { role: "user", text };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Save user message immediately if we have an ID
    if (activeSessionId) {
      localStorage.setItem(`divine_chat_${activeSessionId}`, JSON.stringify(newMessages));
      // Update preview
      updateSession(activeSessionId, { preview: text });
    }

    try {
      const { text: reply, model } = await askOpenRouter(text, epic, language);

      console.log(`%c Divine Response via: ${model}`, "color: #eab308; font-weight: bold;");

      const aiMsg = { role: "assistant", text: reply };
      const updatedMessages = [...newMessages, aiMsg];

      setMessages(updatedMessages);

      // Save AI message
      if (activeSessionId) {
        localStorage.setItem(`divine_chat_${activeSessionId}`, JSON.stringify(updatedMessages));
      }

      /* Auto-speak removed by user request */
    } catch (error) {
      console.error(error);
      toast.error("The divine connection was interrupted.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6 pb-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} text={m.text} />
        ))}

        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/80 backdrop-blur px-4 py-3 rounded-2xl rounded-tl-none shadow border border-white/40">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
        <div className="relative flex items-end gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-2 shadow-2xl ring-1 ring-white/10 focus-within:ring-yellow-400/50 transition-all">

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask for guidance..."
            className="flex-1 max-h-32 bg-transparent border-none outline-none text-white placeholder-gray-300 resize-none py-3 px-4 min-h-[50px] scrollbar-hide"
            rows={1}
          />

          <div className="flex items-center gap-2 pb-2 pr-2">
            <VoiceInput onResult={(text) => send(text, "voice")} />

            <button
              onClick={() => send(input)}
              disabled={!input.trim() || isTyping}
              className={`p-3 rounded-full transition-all ${input.trim()
                ? "bg-yellow-400 text-black hover:bg-yellow-300 transform hover:scale-105"
                : "bg-white/10 text-gray-400 cursor-not-allowed"
                }`}
            >
              {input.trim() ? <Send className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-white/40 mt-2 font-light">
          Please wait for a strong response. It may take few seconds.
        </p>
      </div>
    </div>
  );
}
