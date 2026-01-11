import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";
import { User, Sparkles } from "lucide-react";

export default function ChatMessage({ role, text }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex max-w-[85%] sm:max-w-[75%] gap-2 sm:gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>

        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-sm ${isUser
          ? "bg-gray-200 text-gray-600"
          : "bg-gradient-to-br from-yellow-300 to-yellow-500 text-white"
          }`}>
          {isUser ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed ${isUser
            ? "bg-white text-gray-800 rounded-tr-none border border-gray-100"
            : "bg-white/95 backdrop-blur-md text-gray-800 rounded-tl-none border border-white/40"
            }`}>
            {text}
          </div>

          {/* Action Buttons (Assistant Only) */}
          {/* Action Buttons (Assistant Only) - Listen button removed */}
        </div>
      </div>
    </motion.div>
  );
}
