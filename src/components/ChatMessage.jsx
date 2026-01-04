import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { speak } from "../utils/speak";

export default function ChatMessage({ role, text }) {
  const { language } = useContext(ThemeContext);
  const isUser = role === "user";

  // ASSISTANT MESSAGE
  if (!isUser) {
    return (
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-yellow-300 flex items-center justify-center text-black">
            ☸
          </div>

          {/* Message bubble */}
          <div className="bg-white/90 backdrop-blur px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow max-w-[85%] sm:max-w-xl text-sm sm:text-base">
            {text}
          </div>
        </div>

        {/* Listen */}
        <button
          onClick={() => speak(text, language)}
          className="ml-12 text-xs text-white-100 hover:text-red flex items-center gap-1"
        >
          🔊 Listen
        </button>
      </div>
    );
  }

  // USER MESSAGE
  return (
    <div className="flex justify-end">
      <div className="bg-yellow-300 text-black px-3 sm:px-4 py-2 rounded-2xl max-w-[85%] sm:max-w-xl shadow text-sm sm:text-base">
        {text}
      </div>
    </div>
  );
}
