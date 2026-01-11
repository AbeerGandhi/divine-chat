import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Globe2 } from "lucide-react";

export default function Homepage() {
  const { epic, setEpic, language, setLanguage } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [hoveredEpic, setHoveredEpic] = useState(null);

  const handleStart = () => {
    if (epic) {
      navigate("/chat");
    }
  };

  // Determine active theme for background
  // If hovering, show that theme. If selected, show that theme. Default to neutral.
  const activeTheme = hoveredEpic || epic;

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-serif">

      {/* BACKGROUND LAYERS */}
      <AnimatePresence mode="wait">
        {activeTheme === "ramayan" && (
          <motion.div
            key="ram-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/ram.png')" }} // Reuse the chat bg or a placeholder
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-900/40 to-black/60 mix-blend-multiply" />
          </motion.div>
        )}
        {activeTheme === "mahabharata" && (
          <motion.div
            key="krishna-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/krishna.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-black/60 mix-blend-multiply" />
          </motion.div>
        )}
        {!activeTheme && (
          <motion.div
            key="neutral-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            {/* Spiritual Ambient Gradient Animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-black animate-pulse-slow" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url('/bg-pattern.png')",
                backgroundSize: "cover"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark Overlay for contrast */}
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-10 max-w-5xl w-full px-6 py-12 flex flex-col items-center text-center">

        {/* Header Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white" // Force white text on dark bg
        >
          <div className="inline-block p-3 rounded-full bg-white/10 mb-6 backdrop-blur-md border border-white/20">
            
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-2xl">
            DharmaGuide
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Discover clarity and purpose through the timeless wisdom of
            <span className="font-semibold text-yellow-400"> Ancient Scriptures</span>.
          </p>
        </motion.div>

        {/* Epic Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mt-12">
          {/* Ramayan Card */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredEpic("ramayan")}
            onHoverEnd={() => setHoveredEpic(null)}
            onClick={() => setEpic("ramayan")}
            className={`group relative overflow-hidden p-8 rounded-3xl border-2 transition-all duration-300 text-left backdrop-blur-xl ${epic === "ramayan"
              ? "border-yellow-500 bg-black/40 shadow-[0_0_30px_rgba(234,179,8,0.3)]"
              : "border-white/10 bg-white/5 hover:border-yellow-500/50 hover:bg-black/30"
              }`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl filter drop-shadow-lg">🪔</span>
              {epic === "ramayan" && <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_#eab308]" />}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Ramayan</h3>
            <p className="text-gray-300 leading-snug">
              Guidance on <strong>Duty, Devotion, and Sacrifice</strong> from the life of Maryada Purushottam Ram.
            </p>
          </motion.button>

          {/* Mahabharata Card */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredEpic("mahabharata")}
            onHoverEnd={() => setHoveredEpic(null)}
            onClick={() => setEpic("mahabharata")}
            className={`group relative overflow-hidden p-8 rounded-3xl border-2 transition-all duration-300 text-left backdrop-blur-xl ${epic === "mahabharata"
              ? "border-blue-500 bg-black/40 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              : "border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-black/30"
              }`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl filter drop-shadow-lg">🦚</span>
              {epic === "mahabharata" && <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Mahabharata</h3>
            <p className="text-gray-300 leading-snug">
              Wisdom on <strong>Karma, Dharma, and Strategy</strong> from Shri Krishna and the Bhagavad Gita.
            </p>
          </motion.button>
        </div>

        {/* Controls Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-center gap-6 mt-12 bg-black/30 p-2 rounded-2xl backdrop-blur-md border border-white/10"
        >
          {/* Language Toggle */}
          <div className="flex bg-black/20 rounded-xl p-1 border border-white/5">
            {["en", "hi"].map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${language === l
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                {l === "en" ? "English" : "Hindi"}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-white/20 hidden md:block"></div>

          {/* Start CTA */}
          <button
            disabled={!epic}
            onClick={handleStart}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-lg font-semibold transition-all shadow-lg ${epic
              ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-orange-500/50 hover:scale-105"
              : "bg-white/10 text-gray-500 cursor-not-allowed border border-white/5"
              }`}
          >
            Start Journey <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-sm text-gray-400 flex items-center gap-2 opacity-60"
        >
          <Globe2 className="w-4 h-4" />
          Private & Secure • AI Powered Guidance
        </motion.p>
      </div>
    </div>
  );
}
